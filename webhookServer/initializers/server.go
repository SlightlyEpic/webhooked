package initializers

import (
	"log/slog"
	"net/http"

	"github.com/SlightlyEpic/webhooked/middleware"
	"github.com/gin-gonic/gin"
)

func InitServer(logger *slog.Logger, useSlog bool) (*gin.Engine, *http.Server) {
	var r *gin.Engine
	if useSlog {
		r = gin.New()
		r.Use(middleware.Logger(logger))
		r.Use(gin.Recovery())
	} else {
		r = gin.Default()
	}

	srv := &http.Server{
		Addr:    ":3001",
		Handler: r,
	}

	return r, srv
}
