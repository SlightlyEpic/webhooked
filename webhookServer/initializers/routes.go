package initializers

import (
	"context"
	"log/slog"

	"github.com/SlightlyEpic/webhooked/handlers"
	"github.com/gin-gonic/gin"
)

func InitRoutes(ctx context.Context, r *gin.Engine, logger *slog.Logger, services Services) {
	deps := handlers.DefaultDependencies()
	deps = deps.WithDb(services.Db)
	deps = deps.WithLogger(logger)

	r.GET("/ping", deps.PingHandler())
	r.POST("/webhook/:webhookId", deps.WebhookHandler(ctx))
}
