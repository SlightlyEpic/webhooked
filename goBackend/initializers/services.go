package initializers

import (
	"os"

	"github.com/SlightlyEpic/webhooked/services"
)

type Services struct {
	Db *services.DatabaseService
}

func InitServices() Services {
	return Services{
		Db: services.NewDatabaseService(services.DatabaseServiceOptions{
			ConnectionString:           os.Getenv("MONGO_CONN_STRING"),
			DatabaseName:               os.Getenv("MONGO_DB_NAME"),
			WebhooksCollectionName:     "webhookInfo",
			UsersCollectionsName:       "user",
			WebhookLogsCollectionsName: "webhookLogEntry",
		}),
	}
}
