package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type MongoUser struct {
	Id       primitive.ObjectID `bson:"_id"`
	Email    string             `bson:"email"`
	Username string             `bson:"username"`
}

type User struct {
	Email    string `bson:"email"`
	Username string `bson:"username"`
}
