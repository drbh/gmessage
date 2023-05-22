package main

import (
	"database/sql"
	"fmt"
)

func InitDb() sql.DB {
	dbPath := home + "/" + DB

	fmt.Println("Database path:", dbPath)

	// connect to the database
	var err error
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		panic(err)
	}

	// create table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS messages (
		id integer PRIMARY KEY AUTOINCREMENT,
		role text NOT NULL,
		content text NOT NULL,
		chat_id integer NOT NULL,
		request_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);`)
	if err != nil {
		panic(err)
	}

	// create a key-value table for storing model configuration
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS cache (
		id integer PRIMARY KEY AUTOINCREMENT,
		key text NOT NULL,
		value text NOT NULL
	);`)

	if err != nil {
		panic(err)
	}

	return *db
}

func GetModelConfigFromDb(db *sql.DB) map[string]string {
	rows, err := db.Query(`SELECT key, value FROM cache WHERE key = 'model_config';`)
	if err != nil {
		panic(err)
	}
	defer rows.Close()

	modelConfig := make(map[string]string)

	for rows.Next() {
		var key string
		var value string
		err = rows.Scan(&key, &value)
		if err != nil {
			panic(err)
		}
		modelConfig[key] = value
	}

	return modelConfig
}

func SetModelConfigToDb(db *sql.DB, modelConfig map[string]string) {
	// delete old model configuration
	_, err := db.Exec(`DELETE FROM cache WHERE key = 'model_config';`)
	if err != nil {
		panic(err)
	}

	// manually convert modelConfig to json
	value := "{"
	for key, val := range modelConfig {
		value += "\"" + key + "\": \"" + val + "\","
	}
	value = value[:len(value)-1] + "}"

	fmt.Println("Setting model configuration to:", value)

	_, err = db.Exec(`INSERT INTO cache (key, value) VALUES ('model_config', ?);`, value)
	if err != nil {
		panic(err)
	}

}
