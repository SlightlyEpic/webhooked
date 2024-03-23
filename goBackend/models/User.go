package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	Id           primitive.ObjectID   `bson:"_id,omitempty"`
	Username     string               `bson:"username"`
	Avatar       string               `bson:"avatar"`
	RegisteredAt time.Time            `bson:"registeredAt"`
	LastSignIn   time.Time            `bson:"lastSignIn"`
	Webhooks     []primitive.ObjectID `bson:"webhooks"`
}
