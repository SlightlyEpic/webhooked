package initializers

import (
	"log/slog"
	"net/http"

	"github.com/SlightlyEpic/webhooked/middleware"
	"github.com/gin-gonic/gin"
)

func InitServer(logger *slog.Logger) (*gin.Engine, *http.Server) {
	r := gin.New()
	r.Use(middleware.Logger(logger))
	r.Use(gin.Recovery())

	srv := &http.Server{
		Addr:    ":3001",
		Handler: r,
	}

	return r, srv
}
