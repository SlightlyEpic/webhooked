package services

import (
	"context"
	"os"

	"github.com/SlightlyEpic/webhooked/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DatabaseService struct {
	client          *mongo.Client
	database        *mongo.Database
	hooksCollection *mongo.Collection
	usersCollection *mongo.Collection
	logCollection   *mongo.Collection
}

func NewDatabaseService() DatabaseService {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(os.Getenv("MONGO_CONN_STRING")).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	db := client.Database(os.Getenv("MONGO_DB_NAME"))

	return DatabaseService{
		client:          client,
		database:        db,
		hooksCollection: db.Collection("hooks"),
		usersCollection: db.Collection("users"),
		logCollection:   db.Collection("hookLogs"),
	}
}

func (d DatabaseService) ListDatabases() ([]string, error) {
	return d.client.ListDatabaseNames(context.TODO(), bson.D{})
}

func (d DatabaseService) CreateHook(hook models.HookInfo) (primitive.ObjectID, error) {
	res, err := d.hooksCollection.InsertOne(context.TODO(), hook)
	if err != nil {
		return primitive.ObjectID{}, err
	}

	// The function description says it WILL be primitive.ObjectID
	id, _ := res.InsertedID.(primitive.ObjectID)
	return id, nil
}

func (d DatabaseService) DeleteHook(id primitive.ObjectID) (int64, error) {
	res, err := d.hooksCollection.DeleteOne(context.TODO(), bson.M{"_id": id})
	if err != nil {
		return 0, err
	}

	return res.DeletedCount, nil
}

func (d DatabaseService) Disconnect() error {
	return d.client.Disconnect(context.TODO())
}
