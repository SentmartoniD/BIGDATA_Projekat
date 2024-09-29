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

func (service *AnalogInputsService) GetMaxValueForRegisters() ([]uint16, error) {
	var maxRegister0 uint16
	var maxRegister1 uint16
	var maxRegister2 uint16

	if err := database.DB.Model(&models.AnalogInput{}).Select("MAX(register0)").Scan(&maxRegister0).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&models.AnalogInput{}).Select("MAX(register1)").Scan(&maxRegister1).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&models.AnalogInput{}).Select("MAX(register2)").Scan(&maxRegister2).Error; err != nil {
		return nil, err
	}

	return []uint16{maxRegister0, maxRegister1, maxRegister2}, nil

}

func (service *AnalogInputsService) GetMinValueForRegisters() ([]uint16, error) {
	var minRegister0 uint16
	var minRegister1 uint16
	var minRegister2 uint16

	if err := database.DB.Model(&models.AnalogInput{}).Select("MIN(register0)").Scan(&minRegister0).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&models.AnalogInput{}).Select("MIN(register1)").Scan(&minRegister1).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&models.AnalogInput{}).Select("MIN(register2)").Scan(&minRegister2).Error; err != nil {
		return nil, err
	}

	return []uint16{minRegister0, minRegister1, minRegister2}, nil

}

func (service *AnalogInputsService) GetAvgValueForRegisters() ([]float64, error) {
	var avgRegister0 float64
	var avgRegister1 float64
	var avgRegister2 float64

	if err := database.DB.Model(&models.AnalogInput{}).Select("AVG(register0)").Scan(&avgRegister0).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&models.AnalogInput{}).Select("AVG(register1)").Scan(&avgRegister1).Error; err != nil {
		return nil, err
	}
	if err := database.DB.Model(&models.AnalogInput{}).Select("AVG(register2)").Scan(&avgRegister2).Error; err != nil {
		return nil, err
	}

	return []float64{avgRegister0, avgRegister1, avgRegister2}, nil

}
