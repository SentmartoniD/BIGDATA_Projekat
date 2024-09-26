package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Primer struct {
	ID                 string     `gorm:"type:varchar(36);primaryKey"`
	Register1          bool     `gorm:"index:register1"`
	Register2        bool       `gorm:"column:register2"`
	TimeStamp     		time.Time  `gorm:"column:time_stamp"`
}

func (Primer) TableName() string {
	return "primer"
}

func (primer *Primer) BeforeCreate(tx *gorm.DB) (err error) {
	if primer.ID == "" {
		primer.ID = uuid.NewString()
	}
	return
}