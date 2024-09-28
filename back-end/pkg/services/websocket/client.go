package websocket

import (
	"back-end/pkg/services/logger"
	"net/http"

	"github.com/gorilla/websocket"
)

type WebSocketClient struct {
	conn *websocket.Conn
}

var webSocketClient *WebSocketClient

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

	webSocketClient = &WebSocketClient{conn: conn}

	//defer conn.Close()
}

func SendMessage(message string) {
	if webSocketClient == nil || webSocketClient.conn == nil {
		logger.Error("No active WebSocket connection.")
		return
	}
	err := webSocketClient.conn.WriteMessage(websocket.TextMessage, []byte(message))
	if err != nil {
		logger.Error("Error sending message to client:", err)
		webSocketClient.conn.Close()
		webSocketClient = nil // Clear the client on error
	}
}
