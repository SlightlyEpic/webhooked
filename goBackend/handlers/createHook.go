package handlers

import (
	"context"
	"net/http"

	"github.com/SlightlyEpic/webhooked/models"
	"github.com/SlightlyEpic/webhooked/services"
	"github.com/danielgtaylor/huma/v2"
)

type createHookInput struct {
	SenderOrigin   string `json:"senderOrigin" doc:"The origin of the site sending the webhook"`
	RecievePath    string `json:"recievePath" doc:"The path at which this webhook will be recieved by our servers"`
	DestinationUrl string `json:"destinationUrl" doc:"The URL at which this webhook should be forwarded to"`
}

type createHookOutput struct {
	Body struct {
		Status string               `json:"status" doc:"Whether the operation was successful"`
		Hook   models.MongoHookInfo `json:"hook" doc:"Information about the created hook"`
	}
}

func CreateHookHandler(api huma.API, db services.DatabaseService) {
	huma.Register(api, huma.Operation{
		OperationID: "create-hook",
		Summary:     "Create a webhook reciever",
		Method:      http.MethodPost,
		Path:        "/hooks/create",
	}, func(c context.Context, input *createHookInput) (*createHookOutput, error) {
		hook, err := db.CreateHook(models.HookInfo{
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
