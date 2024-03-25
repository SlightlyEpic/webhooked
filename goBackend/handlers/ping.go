package handlers

import (
	"github.com/gin-gonic/gin"
)

func (deps *handlerDependencies) PingHandler() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.String(200, "Pong")
	}
}
