package migrations

import (
	"back-end/internal/models"
	database "back-end/pkg/db"
	"back-end/pkg/services/logger"
	_ "embed"
)

func ExecuteMigrations() (err error) {
	conf := database.NewDatabaseConfig()
	err = database.Connect(conf)
	if err != nil {
		logger.Error("failed to connect to database")
		return
	}

	// AutoMigrate the models
	if err := database.DB.
		AutoMigrate(
			&models.Coil{},
		); err != nil {
		logger.Error("failed to auto-migrate")
		return err
	}

	logger.Info("Migration ran successfully")

	return nil
}
