package services

import (
	"context"
	"os"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DatabaseService struct {
	client *mongo.Client
}

func NewDatabaseService() DatabaseService {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(os.Getenv("MONGO_CONN_STRING")).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	return DatabaseService{
		client: client,
	}
}

func (d DatabaseService) ListDatabases() ([]string, error) {
	return d.client.ListDatabaseNames(context.TODO(), bson.D{})
}

func (d DatabaseService) Disconnect() error {
	return d.client.Disconnect(context.TODO())
}
