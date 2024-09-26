package logger

import (
	"log"
	"os"
)

// Logger is a basic logger instance
var Logger = log.New(os.Stdout, "[APP] ", log.LstdFlags)

// Info logs informational messages
func Info(v ...interface{}) {
	Logger.Println(v...)
}

// Error logs error messages
func Error(v ...interface{}) {
	Logger.Println(v...)
}
