package initializers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func InitServer() (*gin.Engine, *http.Server) {
	r := gin.Default()

	srv := &http.Server{
		Addr:    ":3001",
		Handler: r,
	}

	return r, srv
}
