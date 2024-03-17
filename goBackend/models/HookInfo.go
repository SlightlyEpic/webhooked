package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type HookInfo struct {
	Id             primitive.ObjectID `bson:"_id,omitempty"`
	AnySender      bool               `bson:"anySender"`
	SenderOrigin   string             `bson:"senderOrigin"`
	RecievePath    string             `bson:"recievePath"`
	DestinationUrl string             `bson:"destinationUrl"`
}
