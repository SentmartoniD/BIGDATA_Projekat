package modbus

import (
	"time"

	"github.com/goburrow/modbus"
)

// ModbusClient wraps modbus.Client and modbus.TCPClientHandler
type ModbusClient struct {
	handler *modbus.TCPClientHandler
	client  modbus.Client
}

// NewModbusClient initializes a new Modbus TCP client
func NewModbusClient(address string, slaveID byte, timeout time.Duration) (*ModbusClient, error) {
	handler := modbus.NewTCPClientHandler(address)
	handler.SlaveId = slaveID
	handler.Timeout = timeout

	err := handler.Connect()
	if err != nil {
		return nil, err
	}

	return &ModbusClient{
		handler: handler,
		client:  modbus.NewClient(handler),
	}, nil
}

// Close closes the Modbus connection
func (m *ModbusClient) Close() {
	m.handler.Close()
}
