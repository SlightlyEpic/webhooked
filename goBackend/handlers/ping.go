package handlers

import (
	"github.com/gin-gonic/gin"
)

func (deps *HandlerDependencies) PingHandler() {
	deps.Router.GET("/ping", func(c *gin.Context) {
		c.String(200, "Pong")
	})
}
