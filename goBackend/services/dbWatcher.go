package services

import (
	"context"
	"fmt"

	"github.com/SlightlyEpic/webhooked/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type DocumentChangeEvent[T any] struct {
	Id          map[string]string   `bson:"_id"`
	ClusterTime primitive.Timestamp `bson:"clusterTime"`

	// Only available if OperationType is "insert" or "delete"
	FullDocument T `bson:"fullDocument,omitempty"`

	// Only available if OperationType is "update"
	UpdatedFields map[string]interface{} `bson:"_updatedFields,omitempty"`

	Ns            map[string]string `bson:"ns"`
	OperationType string            `bson:"operationType"`
	DocumentKey   struct {
		Id primitive.ObjectID `bson:"_id"`
	} `bson:"documentKey"`
}

// To watch and relay any changes in WebhookInfo collection
func watchWebhookStream(ctx context.Context, serv *DatabaseService) {
	webhookStream, err := serv.webhookCollection.Watch(ctx, mongo.Pipeline{}, options.ChangeStream().SetFullDocument(options.UpdateLookup))
	defer func() {
		err := webhookStream.Close(ctx)
		if err != nil {
			serv.logger.Error(
				"Error closing mongo changestream",
				"error", err.Error(),
			)
		} else {
			serv.logger.Info("mongo changestream closed")
		}
	}()

	if err != nil {
		panic(fmt.Sprintf("failed to create webhook collection stream: %v", err))
	}

	for webhookStream.Next(ctx) {
		var data DocumentChangeEvent[models.WebhookInfo]
		if err := webhookStream.Decode(&data); err != nil {
			continue
		}

		serv.watcherMutex.RLock()
		for _, ch := range serv.webhookWatchers {
			ch <- data
		}
		serv.watcherMutex.RUnlock()
	}
}

func (d *DatabaseService) AddWebhookWatcher(watcher chan<- DocumentChangeEvent[models.WebhookInfo]) {
	d.watcherMutex.Lock()
	defer d.watcherMutex.Unlock()
	d.webhookWatchers = append(d.webhookWatchers, watcher)
}
