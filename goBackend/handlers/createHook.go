package handlers

import (
	"context"
	"net/http"
	"reflect"

	"github.com/SlightlyEpic/webhooked/models"
	"github.com/danielgtaylor/huma/v2"
)

type createHookInput struct {
	SenderOrigin   string `json:"senderOrigin" doc:"The origin of the site sending the webhook"`
	RecievePath    string `json:"recievePath" doc:"The path at which this webhook will be recieved by our servers"`
	DestinationUrl string `json:"destinationUrl" doc:"The URL at which this webhook should be forwarded to"`
}

type createHookOutput struct {
	Body struct {
		Status string          `json:"status" doc:"Whether the operation was successful"`
		Hook   models.HookInfo `json:"hook" doc:"Information about the created hook"`
	}
}

func (deps *HandlerDependencies) CreateHookHandler() {
	schema := huma.SchemaFromType(deps.Registry, reflect.TypeOf(createHookInput{}))

	huma.Register(deps.Api, huma.Operation{
		OperationID: "create-hook",
		Summary:     "Create a webhook reciever",
		Method:      http.MethodPost,
		Path:        "/hook/create",
		RequestBody: &huma.RequestBody{
			Content: map[string]*huma.MediaType{
				"application/json": {
					Schema: schema,
				},
			},
		},
	}, func(c context.Context, input *createHookInput) (*createHookOutput, error) {
		hook, err := deps.Db.CreateHook(models.HookInfo{
			AnySender:      false,
			SenderOrigin:   input.SenderOrigin,
			RecievePath:    input.RecievePath,
			DestinationUrl: input.DestinationUrl,
		})

		if err != nil {
			return nil, huma.Error500InternalServerError(err.Error())
		}

		resp := createHookOutput{}
		resp.Body.Status = "Success"
		resp.Body.Hook = hook

		return &resp, nil
	})
}
