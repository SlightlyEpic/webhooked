package handlers

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"sync"
	"sync/atomic"
	"time"

	"github.com/SlightlyEpic/webhooked/models"
	"github.com/SlightlyEpic/webhooked/services"
	"github.com/gin-gonic/gin"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type webhookInfoChangeEvent = services.DocumentChangeEvent[models.WebhookInfo]
type idDestUrlsMap = map[string]([]string)

func (deps *HandlerDependencies) WebhookHandler(ctx context.Context) {
	hooks, err := deps.Db.ActiveWebhooks(ctx)
	if err != nil {
		panic(err)
	}

	// Maps Id -> []destUrls
	lookupRWMutex := sync.RWMutex{}
	hookLookup := make(idDestUrlsMap)

	// ~ Add existing hooks to lookup
	for _, hook := range hooks {
		hookLookup[hook.Id.Hex()] = hook.DestinationUrls
	}

	// ~ Respond to changes in db
	ch := make(chan webhookInfoChangeEvent)
	deps.Db.AddWebhookWatcher(ch)
	go deps.handleChangeEvent(ctx, ch, hookLookup, &lookupRWMutex)

	// ~ http client that sends the POST requests to destination urls
	httpClient := http.Client{}

	// ~ Dynamic route that will forward webhook if such a WebhookInfo record exists, else return a 404
	deps.Router.POST("/webhook/:webhookId", func(ctx *gin.Context) {
		hookId := ctx.Param("webhookId")
		lookupRWMutex.RLock()
		destUrls, ok := hookLookup[hookId]
		lookupRWMutex.RUnlock()

		if !ok {
			ctx.AbortWithStatus(http.StatusNotFound)
			return
		}

		// Time this webhook was recieved at, will be used when document is inserted into db
		timeRecieved := time.Now()

		reqBody, err := io.ReadAll(ctx.Request.Body)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		ctx.Request.Body.Close()
		ctx.Request.Body = io.NopCloser(bytes.NewReader(reqBody))

		var data map[string]interface{}
		if err := ctx.BindJSON(&data); err != nil {
			ctx.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		ctx.JSON(http.StatusOK, gin.H{"message": "Success"})

		go func(ctx *gin.Context) {
			successCounter := atomic.Int32{}
			wg := sync.WaitGroup{}
			wg.Add(len(destUrls))

			for _, destUrl := range destUrls {
				go func() {
					defer wg.Done()

					req, err := http.NewRequest("POST", destUrl, bytes.NewReader(reqBody))
					if err != nil {
						fmt.Printf("/webhook/%s -> %s: Failed to create request\n", hookId, destUrl)
						return
					}

					req.Header.Add("Content-Type", ctx.GetHeader("Content-Type"))

					resp, err := httpClient.Do(req)
					if err != nil {
						fmt.Printf("/webhook/%s -> %s: %s\n", hookId, destUrl, err)
						return
					}

					resp.Body.Close()
					successCounter.Add(1)
				}()
			}

			wg.Wait()

			// ~ Push log to db
			hookObjId, err := primitive.ObjectIDFromHex(hookId)

			if err != nil {
				// ! Log this when logger is setup
				return
			}

			succCount := int(successCounter.Load())

			record := models.WebhookLogEntry{
				Id:                 timeRecieved,
				WebhookId:          hookObjId,
				SenderIp:           ctx.Request.RemoteAddr,
				SuccessfulForwards: succCount,
				Data:               data,
			}

			deps.Db.PushWebhookLog(ctx, &record)
		}(ctx.Copy())
	})
}

func (deps *HandlerDependencies) handleChangeEvent(
	ctx context.Context,
	watcher <-chan webhookInfoChangeEvent,
	hookLookup idDestUrlsMap,
	lookupRWMutex *sync.RWMutex,
) {
	for {
		select {
		case <-ctx.Done():
			return
		case evt := <-watcher:
			lookupRWMutex.Lock()

			switch evt.OperationType {
			case "insert":
				hookLookup[evt.FullDocument.Id.Hex()] = evt.FullDocument.DestinationUrls
			case "update":
				if evt.FullDocument.Archived {
					hookLookup[evt.FullDocument.Id.Hex()] = evt.FullDocument.DestinationUrls
				} else {
					delete(hookLookup, evt.DocumentKey.Id.Hex())
				}
			case "delete":
				delete(hookLookup, evt.DocumentKey.Id.Hex())
			}

			lookupRWMutex.Unlock()
		}
	}
}
