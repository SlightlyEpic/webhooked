package services

import (
	"context"
	"log/slog"
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

	watcherMutex    sync.RWMutex
	webhookWatchers []chan<- DocumentChangeEvent[models.WebhookInfo]
}

type DatabaseServiceOptions struct {
	ConnectionString           string
	DatabaseName               string
	WebhooksCollectionName     string
	UsersCollectionsName       string
	WebhookLogsCollectionsName string
	logger                     *slog.Logger
}

func NewDatabaseService(ctx context.Context, opts DatabaseServiceOptions) *DatabaseService {
	serverAPI := options.ServerAPI(options.ServerAPIVersion1)
	mongoOpts := options.Client().ApplyURI(opts.ConnectionString).SetServerAPIOptions(serverAPI)

	client, err := mongo.Connect(ctx, mongoOpts)
	if err != nil {
		panic(err)
	}

	db := client.Database(opts.DatabaseName)

	webhookCollection := db.Collection(opts.WebhooksCollectionName)

	serv := &DatabaseService{
		client:            client,
		database:          db,
		webhookCollection: webhookCollection,
		usersCollection:   db.Collection(opts.UsersCollectionsName),
		hookLogCollection: db.Collection(opts.WebhookLogsCollectionsName),

		watcherMutex:    sync.RWMutex{},
		webhookWatchers: make([]chan<- DocumentChangeEvent[models.WebhookInfo], 0),
	}

	// ~ Watch and relay any changes in WebhookInfo collection
	go watchWebhookStream(ctx, serv)

	return serv
}

func DestroyDatabaseService(d *DatabaseService) error {
	err := d.client.Disconnect(context.Background())
	return err
}

func (d *DatabaseService) ListDatabases(ctx context.Context) ([]string, error) {
	return d.client.ListDatabaseNames(ctx, bson.D{})
}

func (d *DatabaseService) Webhooks(ctx context.Context) ([]models.WebhookInfo, error) {
	coll := d.webhookCollection
	cursor, err := coll.Find(ctx, bson.D{})

	if err != nil {
		return nil, err
	}

	var webhooks []models.WebhookInfo
	err = cursor.All(ctx, webhooks)

	if err != nil {
		return nil, err
	}

	return webhooks, nil
}

func (d *DatabaseService) ActiveWebhooks(ctx context.Context) ([]models.WebhookInfo, error) {
	filter := bson.D{{Key: "archived", Value: false}}
	cursor, err := d.webhookCollection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}

	var data []models.WebhookInfo
	err = cursor.All(ctx, &data)
	if err != nil {
		return nil, err
	}
	return data, nil
}

func (d *DatabaseService) PushWebhookLog(ctx context.Context, doc *models.WebhookLogEntry) error {
	_, err := d.hookLogCollection.InsertOne(ctx, *doc)
	return err
}

func (d *DatabaseService) Disconnect() error {
	return d.client.Disconnect(context.Background())
}
