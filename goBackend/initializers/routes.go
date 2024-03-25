package initializers

import (
	"context"

	"github.com/SlightlyEpic/webhooked/handlers"
	"github.com/gin-gonic/gin"
)

func InitRoutes(ctx context.Context, r *gin.Engine, services Services) {
	deps := handlers.DefaultDependencies().WithDb(services.Db)

	r.GET("/ping", deps.PingHandler())
	r.POST("/webhook/:webhookId", deps.WebhookHandler(ctx))
}
