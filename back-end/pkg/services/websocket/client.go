package websocket

import (
	"back-end/pkg/services/logger"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow connections from any origin
	},
}

// CreateWebsocketConnection creates a websocket
func CreateWebSocketConnection(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Error("Error upgrading connection:", err)
		return
	}
	defer conn.Close()
}
