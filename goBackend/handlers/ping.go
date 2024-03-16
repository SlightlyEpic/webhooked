package handlers

import (
	"context"
	"net/http"

	"github.com/SlightlyEpic/webhooked/services"
	"github.com/danielgtaylor/huma/v2"
)

type PingOutput struct {
	Body string
}

func PingHandler(api huma.API, db services.DatabaseService) {
	huma.Register(api, huma.Operation{
		OperationID: "ping",
		Summary:     "Ping the server",
		Method:      http.MethodGet,
		Path:        "/ping",
	}, func(c context.Context, input *struct{}) (*PingOutput, error) {
		return &PingOutput{Body: "Pong"}, nil
	})
}
