package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/signal"

	"github.com/SlightlyEpic/webhooked/initializers"
	_ "github.com/joho/godotenv/autoload"
)

func run(ctx context.Context, stdin io.Reader, stdout, stderr io.Writer, args []string) error {
	ctx, cancel := signal.NotifyContext(ctx, os.Interrupt)
	defer cancel()

	r := initializers.InitGin()
	services := initializers.InitServices(ctx)
	initializers.InitHandlers(ctx, r, services)

	if err := http.ListenAndServe("127.0.0.1:3001", r); err != nil {
		return err
	}

	return nil
}

func main() {
	ctx := context.Background()

	if err := run(ctx, os.Stdin, os.Stdout, os.Stderr, os.Args); err != nil {
		fmt.Printf("%s\n", err)
		os.Exit(1)
	}
}
