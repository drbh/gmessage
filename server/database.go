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

	return *db
}
