package main

import (
	"net/http"

	// "github.com/SlightlyEpic/webhooked/services"
	"github.com/SlightlyEpic/webhooked/initializers"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	// dbService := services.NewDatabaseService()
	r, api := initializers.InitHuma()
	services := initializers.InitServices()
	initializers.InitHandlers(api, services)

	http.ListenAndServe("127.0.0.1:3001", r)
}
