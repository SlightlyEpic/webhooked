package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type MongoHookInfo struct {
	Id             primitive.ObjectID `bson:"_id,omitempty"`
	AnySender      bool               `bson:"anySender"`
	SenderOrigin   string             `bson:"senderOrigin"`
	RecievePath    string             `bson:"recievePath"`
	DestinationUrl string             `bson:"destinationUrl"`
}

type HookInfo struct {
	AnySender      bool   `bson:"anySender"`
	SenderOrigin   string `bson:"senderOrigin"`
	RecievePath    string `bson:"recievePath"`
	DestinationUrl string `bson:"destinationUrl"`
}
