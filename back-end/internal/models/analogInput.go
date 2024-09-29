package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type AnalogInput struct {
	ID        string    `gorm:"type:varchar(36);primaryKey"`
	Register0 uint16    `gorm:"column:register0"`
	Register1 uint16    `gorm:"column:register1"`
	Register2 uint16    `gorm:"column:register2"`
	Timestamp time.Time `gorm:"column:timestamp"`
}

func (AnalogInput) TableName() string {
	return "analog_input"
}

func (analogInput *AnalogInput) BeforeCreate(tx *gorm.DB) (err error) {
	if analogInput.ID == "" {
		analogInput.ID = uuid.NewString()
	}
	return
}
