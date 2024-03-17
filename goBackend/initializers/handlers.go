package initializers

import (
	"github.com/SlightlyEpic/webhooked/handlers"
	"github.com/danielgtaylor/huma/v2"
)

func InitHandlers(api huma.API, services Services) {
	deps := handlers.HandlerDependencies{
		Api:      api,
		Registry: huma.NewMapRegistry("#/global", huma.DefaultSchemaNamer),
		Db:       services.Db,
	}

	deps.PingHandler()
	deps.CreateHookHandler()
}
