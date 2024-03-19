package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type WebhookInfo struct {
	Id              primitive.ObjectID   `bson:"_id,omitempty"`
	DestinationUrls []string             `bson:"destinationUrls"`
	Log             []primitive.ObjectID `bson:"log"`
	Owner           primitive.ObjectID   `bson:"owner"`
	Archived        bool                 `bson:"boolean"`
}
