package main

import (
	"back-end/internal/models"
	"back-end/pkg/database"
	"back-end/pkg/database/migrations"
	"back-end/pkg/services/analogInputs"
	"back-end/pkg/services/coils"
	"back-end/pkg/services/digitalInputs"
	"back-end/pkg/services/holdings"
	"back-end/pkg/services/logger"
	"back-end/pkg/services/modbus"
	"back-end/pkg/services/websocket"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
)

func main() {

	loadAllConfiguration()
	connectToDatabase()

	var slaveId byte = 1
	var timeout = 10 * time.Second
	modbusClient, err := modbus.NewModbusClient(os.Getenv("SLAVE_ADRRESS"), slaveId, timeout)
	if err != nil {
		logger.Error("Failed to connect to Modbus:", err)
		return
	}
	defer modbusClient.Close()

	go openWebSockets(modbusClient)

	coilsService := coils.InitCoilsService()
	digitalInputsService := digitalInputs.InitDigitalInputsService()
	holdingsService := holdings.InitHoldingsService()
	analogInputsService := analogInputs.InitAnalogInputsService()

	for {
		// digital output
		coils, err := modbusClient.ReadCoils(0, 8)
		if err != nil {
			logger.Error("Failed to read coils:", err)
			return
		}
		fmt.Println("Coils:", coils)

		coil := &models.Coil{
			ID:        uuid.NewString(),
			Register0: coils[0],
			Register1: coils[1],
			Register2: coils[2],
			Register3: coils[3],
			Register4: coils[4],
			Register5: coils[5],
			Register6: coils[6],
			Register7: coils[7],
			Timestamp: time.Now(),
		}
		coil, err = coilsService.CreateCoil(coil)
		if err != nil {
			logger.Error(err.Error())
		}
		fmt.Println(coil)

		//digital input
		digitalInputs, err := modbusClient.ReadDigitalInput(0, 3)
		if err != nil {
			logger.Error("Failed to read digital inputs:", err)
			return
		}

		digitalInput := &models.DigitalInput{
			ID:        uuid.NewString(),
			Register0: digitalInputs[0],
			Register1: digitalInputs[1],
			Register2: digitalInputs[2],
			Timestamp: time.Now(),
		}
		digitalInput, err = digitalInputsService.CreateDigitalInput(digitalInput)
		if err != nil {
			logger.Error(err.Error())
		}
		fmt.Println("Digtal inputs:", digitalInput)

		// analog output
		holdings, err := modbusClient.ReadHoldingRegisters(0, 6)
		if err != nil {
			logger.Error("Failed to read holding:", err)
			return
		}

		holding := &models.Holding{
			ID:        uuid.NewString(),
			Register0: holdings[0],
			Register1: holdings[1],
			Register2: holdings[2],
			Register3: holdings[3],
			Register4: holdings[4],
			Register5: holdings[5],
			Timestamp: time.Now(),
		}
		holding, err = holdingsService.CreateHolding(holding)
		if err != nil {
			logger.Error(err.Error())
		}
		fmt.Println("Holding:", holding)

		// analog input
		analogInputs, err := modbusClient.ReadAnalogInput(0, 3)
		if err != nil {
			logger.Error("Failed to read analog inputs:", err)
			return
		}
		analogInput := &models.AnalogInput{
			ID:        uuid.NewString(),
			Register0: analogInputs[0],
			Register1: analogInputs[1],
			Register2: analogInputs[2],
			Timestamp: time.Now(),
		}
		analogInput, err = analogInputsService.CreateAnalogInput(analogInput)
		if err != nil {
			logger.Error(err.Error())
		}
		fmt.Println("Analog inputs:", analogInput)

		websocket.SendMessage(fmt.Sprintf("Coils %v %v %v %v %v %v %v %v %v",
			coil.Register0, coil.Register1, coil.Register2, coil.Register3,
			coil.Register4, coil.Register5, coil.Register6, coil.Register7,
			coil.Timestamp.Format("2006-01-02 15:04:05")))

		websocket.SendMessage(fmt.Sprintf("DigitalInputs %v %v", digitalInput.Register0, digitalInput.Timestamp.Format("2006-01-02 15:04:05")))

		websocket.SendMessage(fmt.Sprintf("Holdings %v %v %v %v %v %v %v",
			holding.Register0, holding.Register1, holding.Register2,
			holding.Register3, holding.Register4, holding.Register5,
			holding.Timestamp.Format("2006-01-02 15:04:05")))
		// ANALOG INPUTS
		minAanalogInputValues, err := analogInputsService.GetMinValueForRegisters()
		if err != nil {
			logger.Error(err.Error())
		}
		avgAanalogInputValues, err := analogInputsService.GetAvgValueForRegisters()
		if err != nil {
			logger.Error(err.Error())
		}
		maxAanalogInputValues, err := analogInputsService.GetMaxValueForRegisters()
		if err != nil {
			logger.Error(err.Error())
		}
		websocket.SendMessage(fmt.Sprintf("AnalogInputs %v %v %v %v %v %v %v %v %v %v %v %v %v",
			analogInput.Register0, analogInput.Register1, analogInput.Register2,
			minAanalogInputValues[0], minAanalogInputValues[1], minAanalogInputValues[2],
			avgAanalogInputValues[0], avgAanalogInputValues[1], avgAanalogInputValues[2],
			maxAanalogInputValues[0], maxAanalogInputValues[1], maxAanalogInputValues[2], analogInput.Timestamp.Format("2006-01-02 15:04:05")))

		// GET DATA FROM SLAVE EVERY 5 SECONDS
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

func openWebSockets(modbusClient *modbus.ModbusClient) {

	var webSockerPort = os.Getenv("WEBSOCKET_PORT")

	logger.Info("WebSocket server started on ws://localhost" + webSockerPort)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		websocket.CreateWebSocketConnection(w, r, modbusClient)
	})

	if err := http.ListenAndServe(webSockerPort, nil); err != nil {
		logger.Error("Error starting server:", err)
	}
}
