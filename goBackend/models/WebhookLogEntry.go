package models

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WebhookLogEntry struct {
	Id                 primitive.ObjectID  `bson:"_id,omitempty"`
	WebhookId          primitive.ObjectID  `bson:"webhookId"`
	SenderIp           string              `bson:"senderIp"`
	RecievedAt         primitive.Timestamp `bson:"recievedAt"`
	ExpireAt           primitive.Timestamp `bson:"expireAt"`
	Data               bson.M              `bson:"data"`
	SuccessfulForwards int                 `bson:"SuccessfulForwards"`
}
