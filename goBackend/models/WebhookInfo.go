package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WebhookInfo struct {
	Id              primitive.ObjectID `bson:"_id,omitempty"`
	DestinationUrls []string           `bson:"destinationUrls"`
	Log             []time.Time        `bson:"log"`
	Owner           primitive.ObjectID `bson:"owner"`
	Archived        bool               `bson:"boolean"`
}
