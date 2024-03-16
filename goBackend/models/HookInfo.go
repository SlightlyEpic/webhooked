package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type HookInfo struct {
	Id             primitive.ObjectID `bson:"_id"`
	AnySender      bool               `bson:"anySender"`
	SenderOrigin   string             `bson:"senderOrigin"`
	RecieverUrl    string             `bson:"recieveUrl"`
	DestinationUrl string             `bson:"destinationUrl"`
}
