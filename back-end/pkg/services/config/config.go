package config

import (
	"os"
	"time"
)

// Config holds configuration values
type Config struct {
	ModbusAddress string
	SlaveID       byte
	Timeout       time.Duration
}

// LoadConfig loads configuration from environment variables
func LoadConfig() *Config {
	return &Config{
		ModbusAddress: os.Getenv("MODBUS_ADDRESS"), // e.g., "192.168.1.100:502"
		SlaveID:       byte(1),                     // You can make this dynamic if needed
		Timeout:       10 * time.Second,            // or use an env variable for the timeout
	}
}
