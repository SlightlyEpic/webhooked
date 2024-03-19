package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	Id           primitive.ObjectID   `bson:"_id,omitempty"`
	Username     string               `bson:"username"`
	Avatar       string               `bson:"avatar"`
	RegisteredAt primitive.Timestamp  `bson:"registeredAt"`
	LastSignIn   primitive.Timestamp  `bson:"lastSignIn"`
	Webhooks     []primitive.ObjectID `bson:"webhooks"`
}
