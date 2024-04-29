package initializers

import (
	"context"
	"log/slog"
	"os"

	"github.com/SlightlyEpic/webhooked/services"
)

type Services struct {
	Db *services.DatabaseService
}

func InitServices(ctx context.Context, logger *slog.Logger) Services {
	return Services{
		Db: services.NewDatabaseService(ctx, services.DatabaseServiceOptions{
			ConnectionString:           os.Getenv("MONGO_CONN_STRING"),
			DatabaseName:               os.Getenv("MONGO_DB_NAME"),
			WebhooksCollectionName:     "webhookInfo",
			UsersCollectionsName:       "user",
			WebhookLogsCollectionsName: "webhookLogEntry",
			Logger:                     logger.With("_from", "db service"),
		}),
	}
}
