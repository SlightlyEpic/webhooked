package handlers

import (
	"net/http"

	"github.com/SlightlyEpic/webhooked/models"
	"github.com/gin-gonic/gin"
)

type createHookInput struct {
	AnySender      bool   `json:"anySender" doc:"Whether the webhook can be sent from any domain"`
	SenderOrigin   string `json:"senderOrigin,omitempty" doc:"If anySender is false, then origin of the site sending the webhook"`
	RecievePath    string `json:"recievePath" doc:"The path at which this webhook will be recieved by our servers"`
	DestinationUrl string `json:"destinationUrl" doc:"The URL at which this webhook should be forwarded to"`
}

type createHookOutput struct {
	Status string          `json:"status" doc:"Whether the operation was successful"`
	Hook   models.HookInfo `json:"hook" doc:"Information about the created hook"`
}

func (deps *HandlerDependencies) CreateHookHandler() {
	deps.Router.POST("/hook/create", func(c *gin.Context) {
		var body createHookInput
		if err := c.BindJSON(&body); err != nil {
			c.AbortWithStatusJSON(http.StatusBadRequest, map[string]string{
				"error": err.Error(),
			})
			return
		}

		hook, err := deps.Db.CreateHook(models.HookInfo{
			AnySender:      false,
			SenderOrigin:   body.SenderOrigin,
			RecievePath:    body.RecievePath,
			DestinationUrl: body.DestinationUrl,
		})

		if err != nil {
			c.AbortWithStatusJSON(http.StatusInternalServerError, map[string]string{
				"error": err.Error(),
			})
			return
		}

		resp := createHookOutput{}
		resp.Status = "Success"
		resp.Hook = hook
		c.JSON(http.StatusOK, resp)
	})
}
