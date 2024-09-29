package websocket

import (
	"back-end/pkg/services/logger"
	"back-end/pkg/services/modbus"
	"fmt"
	"net/http"
	"strings"

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
func CreateWebSocketConnection(w http.ResponseWriter, r *http.Request, modbusClient *modbus.ModbusClient) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logger.Error("Error upgrading connection:", err)
		return
	}

	webSocketClient = &WebSocketClient{conn: conn}

	//defer conn.Close()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			logger.Error("Error reading message:", err)
			break
		}

		HandleMessage(string(msg), conn, modbusClient)
	}
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
		webSocketClient = nil
	}
}

func HandleMessage(msg string, conn *websocket.Conn, modbusClient *modbus.ModbusClient) {
	parts := strings.Split(msg, " ")
	if len(parts) < 4 {
		logger.Error("Invalid message format")
		return
	}

	value := parts[1]
	index := parts[3]

	var coilValue uint16
	if value == "1" {
		coilValue = 0xFF00
	} else {
		coilValue = 0x0000
	}

	var coilIndex uint16
	fmt.Sscanf(index, "%d", &coilIndex)

	modbusAddress := coilIndex

	res, err := modbusClient.WriteSingleCoil(modbusAddress, coilValue)
	if err != nil {
		logger.Error("Failed to write to Modbus:", err)
		return
	}

	logger.Info("Modbus slave result: ", res)
}
