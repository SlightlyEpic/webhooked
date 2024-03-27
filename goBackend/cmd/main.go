package main

import (
	"context"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/SlightlyEpic/webhooked/initializers"
	_ "github.com/joho/godotenv/autoload"
)

func run(ctx context.Context, logStream io.Writer, args []string, getenv func(string) string) error {
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	loggerOpts := &slog.HandlerOptions{
		Level: getLoggerLevel(getenv("VERBOSE")),
	}
	logger := slog.New(slog.NewJSONHandler(logStream, loggerOpts))

	r, srv := initializers.InitServer()
	services := initializers.InitServices(ctx)
	initializers.InitRoutes(ctx, r, services)

	go func() {
		if err := http.ListenAndServe("127.0.0.1:3001", r); err != nil && err != http.ErrServerClosed {
			logger.Error("http server error", "error", err.Error())
		}
	}()

	<-ctx.Done()
	logger.Info("Server exiting...")

	if err := srv.Shutdown(ctx); err != nil {
		logger.Error("server shutdown failed", "error", err.Error())
	}

	// Wait 3 seconds to let all other services clean up
	<-time.After(3 * time.Second)

	return nil
}

func main() {
	ctx := context.Background()

	if err := run(ctx, os.Stdout, []string{}, os.Getenv); err != nil {
		fmt.Printf("%s\n", err)
		os.Exit(1)
	}
}

func getLoggerLevel(verbosity string) slog.Level {
	switch verbosity {
	case "1":
		return slog.LevelError
	case "2":
		return slog.LevelWarn
	case "3":
		return slog.LevelInfo
	case "4":
		return slog.LevelDebug
	default:
		panic(fmt.Sprintf("invalid verbosity %s", verbosity))
	}
}
