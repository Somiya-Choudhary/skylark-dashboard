package routes

import (
	handlers "videoProcessor/internal/api"
	"videoProcessor/internal/app"

	"github.com/go-chi/chi/v5"
)

func SetupRoutes(app *app.Application) *chi.Mux {
	r := chi.NewRouter()

	r.Get("/health",app.HealthCheck)
	r.Get("/stream", handlers.StreamHandler)
	return r;
}