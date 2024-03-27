package handlers

import (
	"log/slog"

	"github.com/SlightlyEpic/webhooked/services"
)

type handlerDependencies struct {
	Db     *services.DatabaseService
	logger *slog.Logger
}

func DefaultDependencies() *handlerDependencies {
	return &handlerDependencies{}
}

func (deps *handlerDependencies) WithDb(db *services.DatabaseService) *handlerDependencies {
	deps.Db = db
	return deps
}

func (deps *handlerDependencies) WithLogger(logger *slog.Logger) *handlerDependencies {
	deps.logger = logger
	return deps
}
