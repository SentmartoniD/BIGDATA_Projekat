package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type DigitalInput struct {
	ID        string    `gorm:"type:varchar(36);primaryKey"`
	Register0 bool      `gorm:"column:register0"`
	Register1 bool      `gorm:"column:register1"`
	Register2 bool      `gorm:"column:register2"`
	Timestamp time.Time `gorm:"column:timestamp"`
}

func (DigitalInput) TableName() string {
	return "digital_input"
}

func (digitalInput *DigitalInput) BeforeCreate(tx *gorm.DB) (err error) {
	if digitalInput.ID == "" {
		digitalInput.ID = uuid.NewString()
	}
	return
}
