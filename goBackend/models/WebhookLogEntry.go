package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WebhookLogEntry struct {
	Id                 time.Time              `bson:"_id,omitempty"`
	WebhookId          primitive.ObjectID     `bson:"webhookId"`
	OwnerId            primitive.ObjectID     `bson:"ownerId"`
	SenderIp           string                 `bson:"senderIp"`
	Data               map[string]interface{} `bson:"data"`
	SuccessfulForwards int                    `bson:"successfulForwards"`
}
