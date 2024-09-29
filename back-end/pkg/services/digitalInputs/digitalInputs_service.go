package digitalInputs

import (
	"back-end/internal/models"
	"back-end/pkg/database"
	"back-end/pkg/services/logger"
)

type DigitalInputsService struct{}

func InitDigitalInputsService() *DigitalInputsService {
	return &DigitalInputsService{}
}

func (service *DigitalInputsService) CreateDigitalInput(digitalInput *models.DigitalInput) (*models.DigitalInput, error) {

	logger.Info("DigitalInputsService.CreateDigitalInput service reached")

	err := database.DB.Create(digitalInput).Error
	if err != nil {
		logger.Error("There was an error to save new digitalInput in database")
		return nil, err
	}

	return digitalInput, nil
}
