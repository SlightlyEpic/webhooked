package initializers

import (
	"github.com/SlightlyEpic/webhooked/handlers"
	"github.com/danielgtaylor/huma/v2"
)

func InitHandlers(api huma.API, services Services) {
	handlers.PingHandler(api)
	handlers.CreateHookHandler(api, services.Db)
}
