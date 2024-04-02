package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type WebhookInfo struct {
	Id              primitive.ObjectID `bson:"_id,omitempty"`
	Name            string             `bson:"name"`
	DestinationUrls []string           `bson:"destinationUrls"`
	Log             []time.Time        `bson:"log"`
	OwnerId         primitive.ObjectID `bson:"ownerId"`
	Active          bool               `bson:"active"`
	Archived        bool               `bson:"boolean"`
	Created         time.Time          `bson:"created"`
}
