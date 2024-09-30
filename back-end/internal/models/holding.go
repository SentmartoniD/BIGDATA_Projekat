package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Holding struct {
	ID        string    `gorm:"type:varchar(36);primaryKey"`
	Register0 uint16    `gorm:"column:register0"`
	Register1 uint16    `gorm:"column:register1"`
	Register2 uint16    `gorm:"column:register2"`
	Register3 uint16    `gorm:"column:register3"`
	Register4 uint16    `gorm:"column:register4"`
	Register5 uint16    `gorm:"column:register5"`
	Timestamp time.Time `gorm:"column:timestamp"`
}

func (Holding) TableName() string {
	return "holding"
}

func (holding *Holding) BeforeCreate(tx *gorm.DB) (err error) {
	if holding.ID == "" {
		holding.ID = uuid.NewString()
	}
	return
}
