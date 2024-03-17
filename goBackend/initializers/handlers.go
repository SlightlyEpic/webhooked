package initializers

import (
	"github.com/SlightlyEpic/webhooked/handlers"
	"github.com/gin-gonic/gin"
)

func InitHandlers(r *gin.Engine, services Services) {
	deps := handlers.HandlerDependencies{
		Router: r,
		Db:     services.Db,
	}

	deps.PingHandler()
	deps.CreateHookHandler()
}
