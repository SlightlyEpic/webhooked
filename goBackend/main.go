package main

import (
	"net/http"

	"github.com/SlightlyEpic/webhooked/initializers"
	_ "github.com/joho/godotenv/autoload"
)

func main() {
	r := initializers.InitGin()
	services := initializers.InitServices()
	initializers.InitHandlers(r, services)

	http.ListenAndServe("127.0.0.1:3001", r)
}
