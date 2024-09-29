package holdings

import (
	"back-end/internal/models"
	"back-end/pkg/database"
	"back-end/pkg/services/logger"
)

type HoldingsService struct{}

func InitHoldingsService() *HoldingsService {
	return &HoldingsService{}
}

func (service *HoldingsService) CreateHolding(holding *models.Holding) (*models.Holding, error) {

	logger.Info("HoldingsService.CreateHolding service reached")

	err := database.DB.Create(holding).Error
	if err != nil {
		logger.Error("There was an error to save new holding in database")
		return nil, err
	}

	return holding, nil
}
