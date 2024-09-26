package main

import (
	"fmt"
	"scada/pkg/services/logger"
	"scada/pkg/services/modbus"
	"time"
)

func main() {
	var address = "localhost:502"
	var slaveId byte = 1
	var timeout = 10 * time.Second

	client, err := modbus.NewModbusClient(address, slaveId, timeout)
	if err != nil {
		logger.Error("Failed to connect to Modbus:", err)
		return
	}
	defer client.Close()

	coils, err := client.ReadCoils(0, 3)
	if err != nil {
		logger.Error("Failed to read coils:", err)
		return
	}
	fmt.Println("Coils:", coils)

	holding, err := client.ReadHoldingRegisters(0, 3)
	if err != nil {
		logger.Error("Failed to read holding:", err)
		return
	}
	fmt.Println("Holding:", holding)

	// _, err = client.WriteSingleCoil(5, 0xFF00)
	// if err != nil {
	// 	logger.Error("Failed to write to coil:", err)
	// 	return
	// }
	// logger.Info("Successfully wrote to coil.")
}
