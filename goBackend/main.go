package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/SlightlyEpic/webhooked/initializers"
	_ "github.com/joho/godotenv/autoload"
)

func run(ctx context.Context, stdin io.Reader, stdout, stderr io.Writer, args []string) error {
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	r, srv := initializers.InitServer()
	services := initializers.InitServices(ctx)
	initializers.InitRoutes(ctx, r, services)

	go func() {
		if err := http.ListenAndServe("127.0.0.1:3001", r); err != nil && err != http.ErrServerClosed {
			fmt.Fprintf(stderr, "listen: %s\n", err.Error())
		}
	}()

	<-ctx.Done()
	if err := srv.Shutdown(ctx); err != nil {
		fmt.Fprintf(stderr, "server: %s\n", err.Error())
	}

	fmt.Fprintln(stdout, "Server exiting...")

	// Wait 3 seconds to let all other services clean up
	<-time.After(3 * time.Second)

	return nil
}

func main() {
	ctx := context.Background()

	if err := run(ctx, os.Stdin, os.Stdout, os.Stderr, os.Args); err != nil {
		fmt.Printf("%s\n", err)
		os.Exit(1)
	}
}
