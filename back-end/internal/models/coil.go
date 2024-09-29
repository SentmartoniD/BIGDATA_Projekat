package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Coil struct {
	ID        string    `gorm:"type:varchar(36);primaryKey"`
	Register0 bool      `gorm:"column:register0"`
	Register1 bool      `gorm:"column:register1"`
	Register2 bool      `gorm:"column:register2"`
	Register3 bool      `gorm:"column:register3"`
	Register4 bool      `gorm:"column:register4"`
	Register5 bool      `gorm:"column:register5"`
	Register6 bool      `gorm:"column:register6"`
	Register7 bool      `gorm:"column:register7"`
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
