package analogInputs

import (
	"back-end/internal/models"
	"back-end/pkg/database"
	"back-end/pkg/services/logger"
)

type AnalogInputsService struct{}

func InitAnalogInputsService() *AnalogInputsService {
	return &AnalogInputsService{}
}

func (service *AnalogInputsService) CreateAnalogInput(analogInput *models.AnalogInput) (*models.AnalogInput, error) {

	logger.Info("AnalogInputsService.CreateAnalogInput service reached")

	err := database.DB.Create(analogInput).Error
	if err != nil {
		logger.Error("There was an error to save new analogInput in database")
		return nil, err
	}

	return analogInput, nil
}
