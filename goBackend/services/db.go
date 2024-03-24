package services

import (
	"context"
	"fmt"
	"sync"

	"github.com/SlightlyEpic/webhooked/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DatabaseService struct {
	client            *mongo.Client
	database          *mongo.Database
	webhookCollection *mongo.Collection
	usersCollection   *mongo.Collection
	hookLogCollection *mongo.Collection

	webhookStream   *mongo.ChangeStream
	watcherMut      sync.Mutex
	webhookWatchers []chan<- DocumentChangeEvent[models.WebhookInfo]
}

type DatabaseServiceOptions struct {
	ConnectionString           string
	DatabaseName               string
	WebhooksCollectionName     string
	UsersCollectionsName       string
	WebhookLogsCollectionsName string
}

func NewDatabaseService(serviceOpts DatabaseServiceOptions) *DatabaseService {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	opts := options.Client().ApplyURI(serviceOpts.ConnectionString).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(context.TODO(), opts)
	if err != nil {
		panic(err)
	}

	db := client.Database(serviceOpts.DatabaseName)

	webhookCollection := db.Collection(serviceOpts.WebhooksCollectionName)
	hookStream, err := webhookCollection.Watch(context.TODO(), mongo.Pipeline{})

	if err != nil {
		panic(fmt.Errorf("failed to create webhook collection stream: %v", err))
	}

	serv := &DatabaseService{
		client:            client,
		database:          db,
		webhookCollection: webhookCollection,
		usersCollection:   db.Collection(serviceOpts.UsersCollectionsName),
		hookLogCollection: db.Collection(serviceOpts.WebhookLogsCollectionsName),

		webhookStream:   hookStream,
		watcherMut:      sync.Mutex{},
		webhookWatchers: make([]chan<- DocumentChangeEvent[models.WebhookInfo], 0),
	}

	// ~ Watch and relay any changes in WebhookInfo collection
	go watchWebhookStream(serv)

	return serv
}

func DestroyDatabaseService(d *DatabaseService) error {
	err := d.webhookStream.Close(context.TODO())
	if err != nil {
		return err
	}

	err = d.client.Disconnect(context.TODO())
	if err != nil {
		return err
	}

	return nil
}

func (d *DatabaseService) ListDatabases() ([]string, error) {
	return d.client.ListDatabaseNames(context.TODO(), bson.D{})
}

func (d *DatabaseService) Webhooks() ([]models.WebhookInfo, error) {
	coll := d.webhookCollection
	cursor, err := coll.Find(context.TODO(), bson.D{})

	if err != nil {
		return nil, err
	}

	var webhooks []models.WebhookInfo
	err = cursor.All(context.TODO(), webhooks)

	if err != nil {
		return nil, err
	}

	return webhooks, nil
}

func (d *DatabaseService) ActiveWebhooks() ([]models.WebhookInfo, error) {
	filter := bson.D{{Key: "archived", Value: false}}
	cursor, err := d.webhookCollection.Find(context.TODO(), filter)
	if err != nil {
		return nil, err
	}

	var data []models.WebhookInfo
	err = cursor.All(context.TODO(), &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (d *DatabaseService) PushWebhookLog(doc *models.WebhookLogEntry) error {
	_, err := d.hookLogCollection.InsertOne(context.TODO(), *doc)
	if err != nil {
		return err
	}

	return nil
}

func (d *DatabaseService) Disconnect() error {
	return d.client.Disconnect(context.TODO())
}
