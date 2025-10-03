package main

import (
	"net/http"
	"time"
	"videoProcessor/internal/app"
	"videoProcessor/internal/routes"
)

func main() {
    app, err := app.NewApplication();

    if err != nil {
        panic(err)
    }

    app.Logger.Println("We are running our app.")

    r := routes.SetupRoutes(app)

    server := &http.Server{
        Addr: ":8080",
        Handler: r,
        IdleTimeout: time.Minute,
        ReadTimeout: 10 * time.Second,
        WriteTimeout: 30 * time.Second,
    }

    err = server.ListenAndServe()

    if err != nil {
        app.Logger.Fatal(err)
    }
}
