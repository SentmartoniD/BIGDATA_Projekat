package modbus

import (
	"fmt"
)

// WriteSingleCoil writes a single coil
func (m *ModbusClient) WriteSingleCoil(address uint16, value uint16) (string, error) {
	result, err := m.client.WriteSingleCoil(address, value)
	if err != nil {
		return "", fmt.Errorf("error writing coil: %w", err)
	}
	return string(result), nil
}

// WriteMultipleRegisters writes multiple holding registers
func (m *ModbusClient) WriteMultipleRegisters(address uint16, quantity uint16, values []byte) (string, error) {
	result, err := m.client.WriteMultipleRegisters(address, quantity, values)
	if err != nil {
		return "", fmt.Errorf("error writing holding registers: %w", err)
	}
	return string(result), nil
}
