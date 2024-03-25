package handlers

import (
	"github.com/SlightlyEpic/webhooked/services"
)

type handlerDependencies struct {
	Db *services.DatabaseService
}

func DefaultDependencies() *handlerDependencies {
	return &handlerDependencies{}
}

func (deps *handlerDependencies) WithDb(db *services.DatabaseService) *handlerDependencies {
	deps.Db = db
	return deps
}
