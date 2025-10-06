package handlers

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

// Upgrader configures the WebSocket handshake
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		// Allow all origins for now (you can restrict later)
		return true
	},
}

// StreamHandler handles incoming WebSocket connections
func StreamHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	fmt.Println("WebSocket client connected")

	for {
		// Read binary messages from frontend
		messageType, data, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}

		if messageType == websocket.BinaryMessage {
			fmt.Printf("Received binary chunk of size: %d bytes\n", len(data))
			// TODO: process/save chunk (e.g., write to file or queue)
		} else {
			fmt.Printf("Received non-binary message: %s\n", string(data))
		}
	}
}
