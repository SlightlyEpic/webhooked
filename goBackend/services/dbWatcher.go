package services

import (
	"context"

	"github.com/SlightlyEpic/webhooked/models"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type DocumentChangeEvent[T any] struct {
	Id            map[string]string   `bson:"_id"`
	ClusterTime   primitive.Timestamp `bson:"clusterTime"`
	FullDocument  T                   `bson:"fullDocument"`
	Ns            map[string]string   `bson:"ns"`
	OperationType string              `bson:"operationType"`
	DocumentKey   struct {
		Id primitive.ObjectID `bson:"_id"`
	} `bson:"documentKey"`
}

// To watch and relay any changes in WebhookInfo collection
func watchWebhookStream(serv *DatabaseService) {
	for serv.webhookStream.Next(context.TODO()) {
		var data DocumentChangeEvent[models.WebhookInfo]
		if err := serv.webhookStream.Decode(&data); err != nil {
			continue
		}

		serv.watcherMut.Lock()
		for _, ch := range serv.webhookWatchers {
			ch <- data
		}
		serv.watcherMut.Unlock()
	}
}

func (d *DatabaseService) AddWebhookWatcher(watcher chan<- DocumentChangeEvent[models.WebhookInfo]) {
	d.watcherMut.Lock()
	defer d.watcherMut.Unlock()
	d.webhookWatchers = append(d.webhookWatchers, watcher)
}
