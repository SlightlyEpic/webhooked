package initializers

import (
	"github.com/SlightlyEpic/webhooked/services"
)

type Services struct {
	Db services.DatabaseService
}

func InitServices() Services {
	return Services{
		Db: services.NewDatabaseService(),
	}
}
