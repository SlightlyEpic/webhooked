package handlers

import (
	"github.com/SlightlyEpic/webhooked/services"
	"github.com/danielgtaylor/huma/v2"
)

type HandlerDependencies struct {
	Api      huma.API
	Registry huma.Registry
	Db       services.DatabaseService
}
