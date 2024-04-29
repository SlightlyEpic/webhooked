package middleware

import (
	"log/slog"
	"time"

	"github.com/gin-gonic/gin"
)

func Logger(logger *slog.Logger) gin.HandlerFunc {
	// Yanked from https://github.com/gin-gonic/gin/blob/7a865dcf1dbe6ec52e074b1ddce830d278eb72cf/logger.go#L242
	// with some changes
	return func(c *gin.Context) {
		// Start timer
		start := time.Now()
		path := c.Request.URL.Path
		raw := c.Request.URL.RawQuery

		// Process request
		c.Next()

		// Stop timer
		latency := time.Since(start)

		clientIP := c.ClientIP()
		method := c.Request.Method
		statusCode := c.Writer.Status()
		errorMessage := c.Errors.ByType(gin.ErrorTypePrivate).String()

		bodySize := c.Writer.Size()

		if raw != "" {
			path = path + "?" + raw
		}

		logFunc := logger.Info
		if statusCode >= 500 {
			logFunc = logger.Error
		}

		logFunc(
			"Request",
			slog.Int("statusCode", statusCode),
			slog.String("latency", latency.String()),
			slog.String("clientIp", clientIP),
			slog.String("method", method),
			slog.String("path", path),
			slog.Int("bodySize", bodySize),
			slog.String("errors", errorMessage),
		)
	}
}
