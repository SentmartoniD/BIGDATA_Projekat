package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Coil struct {
	ID        string    `gorm:"type:varchar(36);primaryKey"`
	Register1 bool      `gorm:"column:register1"`
	Register2 bool      `gorm:"column:register2"`
	Register3 bool      `gorm:"column:register3"`
	Timestamp time.Time `gorm:"column:timestamp"`
}

func (Coil) TableName() string {
	return "coil"
}

func (coil *Coil) BeforeCreate(tx *gorm.DB) (err error) {
	if coil.ID == "" {
		coil.ID = uuid.NewString()
	}
	return
}
