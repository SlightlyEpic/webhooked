package handlers

import (
	"github.com/SlightlyEpic/webhooked/services"
	"github.com/gin-gonic/gin"
)

type HandlerDependencies struct {
	Router *gin.Engine
	Db     *services.DatabaseService
}
