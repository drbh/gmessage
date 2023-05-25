package main

import (
	"database/sql"
	"fmt"
)

// Datastore represents the DAL interface
type Datastore interface {
	SearchMessages(text string) ([]Message, error)
	GetChats() ([]Message, error)
	EditMessage(messageID string, update UpdateMessage) error
	GetMessages(chatID string) ([]Message, error)
	InsertMessage(message Message) error
	ChatExists(chatID string) (bool, error)
}

func InitDb() *sql.DB {
	dbPath := home + "/" + DB_PATH

	fmt.Println("Database path:", dbPath)

	// connect to the database
	var err error
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		panic(err)
	}

	// Set the connection pool limits
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(25)

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

	return db
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

// SearchMessages searches for messages in the database that contain the given text
func (db *DB) SearchMessages(text string) ([]Message, error) {
	query := `SELECT * FROM messages WHERE content LIKE ?`
	rows, err := db.Query(query, fmt.Sprintf("%%%s%%", text))
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var messages []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(&message.ID, &message.Role, &message.Content, &message.ChatID, &message.RequestTimestamp, &message.Timestamp); err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return messages, nil
}

// GetChats gets all chat messages from the database
func (db *DB) GetChats() ([]Chat, error) {
	query := `SELECT MAX(id), role, content, chat_id, request_timestamp, timestamp FROM messages GROUP BY chat_id`
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var chats []Chat
	for rows.Next() {
		var chat Chat
		if err := rows.Scan(
			&chat.ID,
			&chat.Role,
			&chat.Content,
			&chat.ChatID,
			&chat.RequestTimestamp,
			&chat.Timestamp,
		); err != nil {
			return nil, err
		}
		chats = append(chats, chat)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return chats, nil
}

// EditMessage updates a message in the database
func (db *DB) EditMessage(messageID string, update UpdateMessage) error {
	query := `UPDATE messages SET content = ? WHERE id = ?`
	result, err := db.Exec(query, update.Content, messageID)
	if err != nil {
		return err
	}
	// Check if any rows were updated
	if rowsAffected, err := result.RowsAffected(); err != nil {
		return err
	} else if rowsAffected == 0 {
		return fmt.Errorf("no rows affected")
	}
	return nil
}

// GetMessages gets all messages for a given chatID
func (db *DB) GetMessages(chatID string) ([]Message, error) {
	query := `SELECT * FROM messages WHERE chat_id = ?`
	rows, err := db.Query(query, chatID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var messages []Message
	for rows.Next() {
		var message Message
		if err := rows.Scan(&message.ID, &message.Role, &message.Content, &message.ChatID, &message.RequestTimestamp, &message.Timestamp); err != nil {
			return nil, err
		}
		messages = append(messages, message)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return messages, nil
}

// InsertMessage inserts a message into the database
func (db *DB) InsertMessage(message Message) error {
	query := `INSERT INTO messages (role, content, chat_id, request_timestamp) VALUES (?, ?, ?, ?)`
	result, err := db.Exec(query, message.Role, message.Content, message.ChatID, message.RequestTimestamp)
	if err != nil {
		return err
	}
	if _, err := result.RowsAffected(); err != nil {
		return err
	}
	return nil
}

// ChatExists checks if a chat exists in the database
func (db *DB) ChatExists(chatId string) bool {
	// check if there are any rows in the database with the given chatId
	chatExists := false
	err := db.QueryRow("SELECT EXISTS(SELECT 1 FROM messages WHERE chat_id = ?)", chatId).Scan(&chatExists)
	if err != nil {
		fmt.Println(err)
	}
	return chatExists
}
