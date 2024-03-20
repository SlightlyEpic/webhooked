package handlers

import (
	"fmt"
	"net/http"
	"sync"
	"sync/atomic"

	"github.com/SlightlyEpic/webhooked/models"
	"github.com/SlightlyEpic/webhooked/services"
	"github.com/gin-gonic/gin"
)

type WebhookInfoChangeEvent = services.DocumentChangeEvent[models.WebhookInfo]

func (deps *HandlerDependencies) WebhookHandler() {
	hooks, err := deps.Db.ActiveWebhooks()
	if err != nil {
		panic(err)
	}

	// Maps Id -> WebhookInfo
	hookLookup := make(map[string]models.WebhookInfo)

	// ~ Add existing hooks to lookup
	for _, hook := range hooks {
		hookLookup[hook.Id.Hex()] = hook
	}

	// ~ Respond to changes in db
	ch := make(chan WebhookInfoChangeEvent)
	deps.Db.AddWebhookWatcher(ch)
	go deps.handleChangeEvent(ch, hookLookup)

	// ~ http client that sends the POST requests to destination urls
	httpClient := http.Client{}

	// ~ Dynamic route that will forward webhook if such a WebhookInfo record exists, else return a 404
	deps.Router.POST("/webhook/:webhookId", func(ctx *gin.Context) {
		hookId := ctx.Param("webhookId")
		hookInfo, ok := hookLookup[hookId]

		if !ok {
			ctx.AbortWithStatus(http.StatusNotFound)
			return
		}

		successCount := atomic.Int32{}
		wg := sync.WaitGroup{}
		wg.Add(len(hookInfo.DestinationUrls))

		for _, destUrl := range hookInfo.DestinationUrls {
			go func() {
				defer wg.Done()

				req, err := http.NewRequest("POST", destUrl, ctx.Request.Body)
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
				successCount.Add(1)
			}()
		}

		wg.Wait()

		// * TODO: Write logic to push log to db
	})
}

func (deps *HandlerDependencies) handleChangeEvent(watcher <-chan WebhookInfoChangeEvent, hookLookup map[string]models.WebhookInfo) {
	for evt := range watcher {
		switch evt.OperationType {
		case "insert", "update":
			// fmt.Printf("New WebhookInfo: %s\n", evt.DocumentKey.Id.Hex())
			hookLookup[evt.FullDocument.Id.Hex()] = evt.FullDocument
		case "delete":
			// fmt.Printf("Deleting WebhookInfo: %s\n", evt.DocumentKey.Id.Hex())
			delete(hookLookup, evt.DocumentKey.Id.Hex())
		}
	}
}
