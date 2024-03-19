package handlers

import (
	"fmt"

	"github.com/gin-gonic/gin"
)

func (deps *HandlerDependencies) WebhookHandler() {
	// * TODO: Make changestream events update the router paths
	// ch := make(chan services.DocumentChangeEvent[models.WebhookInfo])

	// deps.Db.AddWebhookWatcher(ch)
	// fmt.Println("Added watcher...")

	hooks, err := deps.Db.ActiveWebhooks()
	if err != nil {
		panic(err)
	}
	for _, hook := range hooks {
		// ! DEBUG: This creates a route on /webhook/ObjectID("65f9f34767ec6ff0884da2df")
		deps.Router.POST(fmt.Sprintf("/webhook/%s", hook.Id), func(ctx *gin.Context) {
			fmt.Printf("Recieved webhook %s\n", hook.Id)
			// * TODO: Forward the webhook to the destination URL
			// * TODO for later: Forward the webhook to all websocket recievers
			// * TODO: Create a new log entry
		})
	}
}
