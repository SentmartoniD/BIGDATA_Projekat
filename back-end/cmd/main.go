package main

import (
	database "back-end/pkg/db"
	"back-end/pkg/db/migrations"
	"back-end/pkg/services/logger"
	"back-end/pkg/services/modbus"
	"back-end/pkg/services/websocket"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {

	loadAllConfiguration()
	connectToDatabase()
	go openWebSockets()

	var slaveId byte = 1
	var timeout = 10 * time.Second

	modbusClient, err := modbus.NewModbusClient(os.Getenv("SLAVE_ADRRESS"), slaveId, timeout)
	if err != nil {
		logger.Error("Failed to connect to Modbus:", err)
		return
	}
	defer modbusClient.Close()

	for {
		// digital output
		coils, err := modbusClient.ReadCoils(0, 3)
		if err != nil {
			logger.Error("Failed to read coils:", err)
			return
		}
		fmt.Println("Coils:", coils)

		//digital input
		digitalInputs, err := modbusClient.ReadDigitalInput(0, 3)
		if err != nil {
			logger.Error("Failed to digital inputs:", err)
			return
		}
		fmt.Println("Digtal inputs:", digitalInputs)

		// analog output
		holdings, err := modbusClient.ReadHoldingRegisters(0, 3)
		if err != nil {
			logger.Error("Failed to read holding:", err)
			return
		}
		fmt.Println("Holding:", holdings)

		// analog input
		analogInputs, err := modbusClient.ReadAnalogInput(0, 3)
		if err != nil {
			logger.Error("Failed to read analog inputs:", err)
			return
		}
		fmt.Println("Analog inputs:", analogInputs)

		websocket.SendMessage(fmt.Sprintf("Coils: %v", coils))
		websocket.SendMessage(fmt.Sprintf("Digital inputs: %v", digitalInputs))
		websocket.SendMessage(fmt.Sprintf("Holdings: %v", holdings))
		websocket.SendMessage(fmt.Sprintf("Analog inputs: %v", analogInputs))

		time.Sleep(5 * time.Second)
	}
}

func loadAllConfiguration() {
	godotenv.Load(".env")
}

func connectToDatabase() {

	databaseConfig := database.NewDatabaseConfig()
	err := database.Connect(databaseConfig)
	if err != nil {
		logger.Error("failed to connect to the Database")
		os.Exit(1)
	}
	logger.Info("Connected to the Database")

	err = migrations.ExecuteMigrations()
	if err != nil {
		logger.Error("failed to execute migrations")
		os.Exit(2)
	}
	logger.Info("Migrations executed")
}

// func connectToSlavesWithModbus() {

// 	var slaveAddress = os.Getenv("SLAVE_ADRRESS")
// 	var slaveId byte = 1
// 	var timeout = 10 * time.Second

// 	client, err := modbus.NewModbusClient(slaveAddress, slaveId, timeout)
// 	if err != nil {
// 		logger.Error("Failed to connect to Modbus:", err)
// 		return
// 	}
// 	defer client.Close()
// }

func openWebSockets() {

	var webSockerPort = os.Getenv("WEBSOCKET_PORT")

	logger.Info("WebSocket server started on ws://localhost" + webSockerPort)

	http.HandleFunc("/", websocket.CreateWebSocketConnection)

	if err := http.ListenAndServe(webSockerPort, nil); err != nil {
		logger.Error("Error starting server:", err)
	}
}
