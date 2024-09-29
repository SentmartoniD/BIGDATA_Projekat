package coils

import (
	"back-end/internal/models"
	"back-end/pkg/database"
	"back-end/pkg/services/logger"
)

type CoilsService struct{}

func InitCoilsService() *CoilsService {
	return &CoilsService{}
}

func (service *CoilsService) CreateCoil(coil *models.Coil) (*models.Coil, error) {

	logger.Info("CoilsService.CreateCoil service reached")

	err := database.DB.Create(coil).Error
	if err != nil {
		logger.Error("There was an error to save new coil in database")
		return nil, err
	}

	return coil, nil
}
