package modbus

import (
	"fmt"
)

// ReadCoils reads coils from the Modbus server
func (m *ModbusClient) ReadCoils(startAddress uint16, quantity uint16) ([]bool, error) {
	results, err := m.client.ReadCoils(startAddress, quantity)
	if err != nil {
		return nil, fmt.Errorf("error reading coils: %w", err)
	}

	// Decode the coil statuses from the byte array
	var coilStatuses []bool
	for _, b := range results {
		// Each byte contains 8 coil statuses (bits)
		for i := 0; i < 8; i++ {
			// Extract each bit and append to coilStatuses
			coilStatuses = append(coilStatuses, (b>>i)&1 == 1)
		}
	}

	coilStatuses = coilStatuses[:quantity]

	return coilStatuses, nil
}

// ReadCoils reads coils from the Modbus server
func (m *ModbusClient) ReadDigitalInput(startAddress uint16, quantity uint16) ([]bool, error) {
	results, err := m.client.ReadDiscreteInputs(startAddress, quantity)
	if err != nil {
		return nil, fmt.Errorf("error reading coils: %w", err)
	}

	// Decode the coil statuses from the byte array
	var coilStatuses []bool
	for _, b := range results {
		// Each byte contains 8 coil statuses (bits)
		for i := 0; i < 8; i++ {
			// Extract each bit and append to coilStatuses
			coilStatuses = append(coilStatuses, (b>>i)&1 == 1)
		}
	}

	coilStatuses = coilStatuses[:quantity]

	return coilStatuses, nil
}

// ReadHoldingRegisters reads holding registers from the Modbus server and parses them into uint16 values.
func (m *ModbusClient) ReadHoldingRegisters(startAddress uint16, quantity uint16) ([]uint16, error) {
	results, err := m.client.ReadHoldingRegisters(startAddress, quantity)
	if err != nil {
		return nil, fmt.Errorf("error reading holding registers: %w", err)
	}

	// Each register is 2 bytes, so check if the result length is correct
	if len(results) != int(quantity)*2 {
		return nil, fmt.Errorf("unexpected result length: got %d bytes, expected %d", len(results), quantity*2)
	}

	// Parse the byte array into uint16 values
	parsedResults := make([]uint16, quantity)
	for i := 0; i < int(quantity); i++ {
		// Convert every two bytes into a uint16 value
		parsedResults[i] = uint16(results[2*i])<<8 | uint16(results[2*i+1])
	}

	return parsedResults, nil
}

// ReadHoldingRegisters reads holding registers from the Modbus server and parses them into uint16 values.
func (m *ModbusClient) ReadAnalogInput(startAddress uint16, quantity uint16) ([]uint16, error) {
	results, err := m.client.ReadInputRegisters(startAddress, quantity)
	if err != nil {
		return nil, fmt.Errorf("error reading holding registers: %w", err)
	}

	// Each register is 2 bytes, so check if the result length is correct
	if len(results) != int(quantity)*2 {
		return nil, fmt.Errorf("unexpected result length: got %d bytes, expected %d", len(results), quantity*2)
	}

	// Parse the byte array into uint16 values
	parsedResults := make([]uint16, quantity)
	for i := 0; i < int(quantity); i++ {
		// Convert every two bytes into a uint16 value
		parsedResults[i] = uint16(results[2*i])<<8 | uint16(results[2*i+1])
	}

	return parsedResults, nil
}
