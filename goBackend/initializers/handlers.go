package initializers

import (
	"context"

	"github.com/SlightlyEpic/webhooked/handlers"
	"github.com/gin-gonic/gin"
)

func InitHandlers(ctx context.Context, r *gin.Engine, services Services) {
	deps := handlers.HandlerDependencies{
		Router: r,
		Db:     services.Db,
	}

	deps.PingHandler()
	deps.WebhookHandler(ctx)
}
