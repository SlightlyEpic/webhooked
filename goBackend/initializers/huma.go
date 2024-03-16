package initializers

import (
	"github.com/danielgtaylor/huma/v2"
	"github.com/danielgtaylor/huma/v2/adapters/humagin"
	"github.com/gin-gonic/gin"
)

func InitHuma() (*gin.Engine, huma.API) {
	r := gin.Default()
	api := humagin.New(r, huma.DefaultConfig("Webhooked API", "0.1.0"))

	return r, api
}
