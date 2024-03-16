package handlers

import (
	"context"
	"net/http"

	"github.com/danielgtaylor/huma/v2"
)

type pingOutput struct {
	Body string
}

func PingHandler(api huma.API) {
	huma.Register(api, huma.Operation{
		OperationID: "ping",
		Summary:     "Ping the server",
		Method:      http.MethodGet,
		Path:        "/ping",
	}, func(c context.Context, input *struct{}) (*pingOutput, error) {
		return &pingOutput{Body: "Pong"}, nil
	})
}
