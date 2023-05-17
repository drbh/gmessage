from fastapi import FastAPI
from typing import List, Optional
from gpt4all import GPT4All
from typing_extensions import Annotated
from pydantic import BaseModel
import sqlite3
from sqlite3 import Error
import os
from datetime import datetime, timezone
from fastapi import HTTPException
import random


class ChatCompletionConfig(BaseModel):
    logits_size: Optional[int] = 0
    tokens_size: Optional[int] = 0
    n_past: Optional[int] = 0
    n_ctx: Optional[int] = 0
    n_predict: Optional[int] = 100
    top_k: Optional[int] = 5
    top_p: Optional[float] = 0.9
    temp: Optional[float] = 0.2
    n_batch: Optional[int] = 4
    repeat_penalty: Optional[float] = 1.1
    repeat_last_n: Optional[int] = 64
    context_erase: Optional[float] = 0.0
    verbose: Optional[bool] = False


class ModelConfig(BaseModel):
    model: str
    n_threads: int


class UpdateMessage(BaseModel):
    content: str


class Message(BaseModel):
    id: Optional[str]
    role: str
    content: str
    chat_id: int
    request_timestamp: Optional[str]
    timestamp: Optional[str]


class UserInput(BaseModel):
    message: str
    chat_id: int


class ChatCompletionResponse(BaseModel):
    messages: List[Message]


INIT_MESSAGES = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "Hello there."},
    {"role": "assistant", "content": "Hi, how can I help you?"},
]

MODEL: str = "ggml-mpt-7b-chat.bin"
N_THREADS: int = 10

MODEL_CONFIG: ModelConfig = ModelConfig(model="ggml-mpt-7b-chat.bin", n_threads=10)
CHAT_COMPLETION_CONFIG: ChatCompletionConfig = ChatCompletionConfig()


DATABASE = "chat_history.db"

app = FastAPI()


def create_connection():
    conn = None
    try:
        conn = sqlite3.connect(DATABASE)
        return conn
    except Error as e:
        print(e)
    return conn


def create_table(conn):
    try:
        sql_create_table = """CREATE TABLE IF NOT EXISTS messages (
                                        id integer PRIMARY KEY AUTOINCREMENT,
                                        role text NOT NULL,
                                        content text NOT NULL,
                                        chat_id integer NOT NULL,
                                        request_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                                    ); """
        c = conn.cursor()
        c.execute(sql_create_table)
    except Error as e:
        print(e)


@app.on_event("startup")
async def startup_event():
    global gpt4all_instance
    gpt4all_instance = GPT4All(MODEL_CONFIG.model)

    # if threads are passed, set them
    if MODEL_CONFIG.n_threads != 4:
        # set number of threads
        gpt4all_instance.model.set_thread_count(MODEL_CONFIG.n_threads)

    conn = create_connection()
    if conn is not None:
        create_table(conn)
    else:
        print("Error! Cannot create the database connection.")


@app.put("/model-config", response_model=ModelConfig)
async def update_model_config(config: ModelConfig):
    global MODEL_CONFIG, gpt4all_instance
    MODEL_CONFIG = config

    # Initialize a new instance with the new model
    try:
        new_instance = GPT4All(MODEL_CONFIG.model)

        # if threads are passed, set them
        if MODEL_CONFIG.n_threads != 4:
            # set number of threads
            new_instance.model.set_thread_count(MODEL_CONFIG.n_threads)

        # If there were no errors, replace the global instance
        gpt4all_instance = new_instance
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Failed to load the model: {str(e)}"
        )

    return MODEL_CONFIG


@app.get("/model-config", response_model=ModelConfig)
async def get_model_config():
    return MODEL_CONFIG


@app.get("/supported-models", response_model=List[str])
async def get_supported_models():
    return [
        "ggml-mpt-7b-chat.bin",
        "ggml-gpt4all-j-v1.3-groovy.bin",
    ]


@app.get("/chat-completion-config", response_model=ChatCompletionConfig)
async def get_chat_completion_config():
    print("get_chat_completion_config")
    return CHAT_COMPLETION_CONFIG


@app.put("/chat-completion-config", response_model=ChatCompletionConfig)
async def update_chat_completion_config(config: ChatCompletionConfig):
    global CHAT_COMPLETION_CONFIG
    CHAT_COMPLETION_CONFIG = config
    return CHAT_COMPLETION_CONFIG


@app.post("/message", response_model=ChatCompletionResponse)
async def chat(input: UserInput):
    request_timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
    conn = create_connection()
    cursor = conn.cursor()

    # check if there is any message in the db with the chat id
    is_new_chat = cursor.execute(
        "SELECT * FROM messages WHERE chat_id=?", (input.chat_id,)
    ).fetchone()

    if is_new_chat is None:
        # add all init messages to the db
        for message in INIT_MESSAGES:
            cursor.execute(
                "INSERT INTO messages(role, content, chat_id, request_timestamp) VALUES(?, ?, ?, ?)",
                (message["role"], message["content"], input.chat_id, request_timestamp),
            )
            conn.commit()

    # Insert user's message to the database
    cursor.execute(
        "INSERT INTO messages(role, content, chat_id, request_timestamp) VALUES(?, ?, ?, ?)",
        ("user", input.message, input.chat_id, request_timestamp),
    )
    conn.commit()

    # Fetch all messages for the chat id
    cursor.execute(
        "SELECT id, role, content, chat_id FROM messages WHERE chat_id=?",
        (input.chat_id,),
    )
    MESSAGES = [
        {"role": row[1], "content": row[2], "chat_id": row[3]}
        for row in cursor.fetchall()
    ]

    print(CHAT_COMPLETION_CONFIG.dict())

    # execute chat completion
    full_response = gpt4all_instance.chat_completion(
        MESSAGES,
        **CHAT_COMPLETION_CONFIG.dict(),  # pass all config parameters as kwargs
    )

    # Add assistant's response to the database
    cursor.execute(
        "INSERT INTO messages(role, content, chat_id, request_timestamp) VALUES(?, ?, ?, ?)",
        (
            "assistant",
            full_response.get("choices")[0].get("message").get("content"),
            input.chat_id,
            request_timestamp,
        ),
    )
    conn.commit()

    # Fetch all messages for the chat id
    cursor.execute("SELECT * FROM messages WHERE chat_id=?", (input.chat_id,))
    MESSAGES = [
        {
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]
    conn.close()

    return {"messages": MESSAGES}


@app.get("/messages/{chat_id}", response_model=List[Message])
async def get_messages(chat_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    # Fetch all messages for the chat id
    cursor.execute("SELECT * FROM messages WHERE chat_id=?", (chat_id,))
    MESSAGES = [
        {
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    conn.close()

    return MESSAGES


# List all chat ids and their last message and time timestamp
@app.get("/chats", response_model=List[Message])
async def get_chats():
    conn = create_connection()
    cursor = conn.cursor()

    # Fetch all messages for the chat id
    cursor.execute(
        "SELECT chat_id, role, content, request_timestamp, timestamp, MAX(id) FROM messages GROUP BY chat_id"
    )
    chats = [
        {
            "chat_id": row[0],
            "role": row[1],
            "content": row[2],
            "request_timestamp": row[3],
            # convert timestamp to string
            "timestamp": row[4],
        }
        for row in cursor.fetchall()
    ]
    conn.close()

    return chats


# Search messages for text string
@app.get("/search/{text}", response_model=List[Message])
async def search_messages(text: str):
    conn = create_connection()
    cursor = conn.cursor()

    # Fetch all messages for the chat id
    cursor.execute("SELECT * FROM messages WHERE content LIKE ?", ("%" + text + "%",))
    searchResults = [
        {
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    conn.close()

    return searchResults


@app.put("/edit-message/{message_id}", response_model=Message)
async def update_message(message_id: int, message: UpdateMessage):
    conn = create_connection()
    cursor = conn.cursor()

    # Fetch the message with the given id
    cursor.execute("SELECT * FROM messages WHERE id=?", (message_id,))
    message_info = cursor.fetchone()

    if not message_info:
        raise HTTPException(status_code=404, detail="Message not found")

    # Update the message content
    cursor.execute(
        "UPDATE messages SET content = ? WHERE id = ?", (message.content, message_id)
    )
    conn.commit()

    # Fetch the updated message
    cursor.execute("SELECT * FROM messages WHERE id=?", (message_id,))
    updated_message = cursor.fetchone()

    conn.close()

    return {
        "id": updated_message[0],
        "role": updated_message[1],
        "content": updated_message[2],
        "chat_id": updated_message[3],
        "request_timestamp": updated_message[4],
        "timestamp": updated_message[5],
    }


# allow users to fork a conversation at a given message
@app.post("/fork-conversation/{message_id}", response_model=List[Message])
async def fork_conversation(message_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    # Fetch the message with the given id
    cursor.execute("SELECT * FROM messages WHERE id=?", (message_id,))
    message_info = cursor.fetchone()

    if not message_info:
        raise HTTPException(status_code=404, detail="Message not found")

    # Fetch all messages for the chat id bef
    cursor.execute(
        "SELECT * FROM messages WHERE chat_id=? AND id <= ?",
        (message_info[3], message_id),
    )
    MESSAGES = [
        {
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    # create a new chat id (random number)
    new_chat_id = random.randint(100000, 999999)

    # add each message to the new chat id
    for message in MESSAGES:
        cursor.execute(
            "INSERT INTO messages(role, content, chat_id, request_timestamp) VALUES(?, ?, ?, ?)",
            (
                message["role"],
                message["content"],
                new_chat_id,
                message["request_timestamp"],
            ),
        )
        conn.commit()

    # Fetch all messages for the chat id
    cursor.execute("SELECT * FROM messages WHERE chat_id=?", (new_chat_id,))
    MESSAGES = [
        {
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    conn.close()

    return MESSAGES


# fork, rerun and return the conversation
@app.post("/rerun-conversation/{message_id}", response_model=List[Message])
async def rerun_conversation(message_id: int):
    conn = create_connection()
    cursor = conn.cursor()

    # same as fork, but also do chat completion
    # Fetch the message with the given id
    cursor.execute("SELECT * FROM messages WHERE id=?", (message_id,))
    message_info = cursor.fetchone()

    if not message_info:
        raise HTTPException(status_code=404, detail="Message not found")

    # Fetch all messages for the chat id bef
    cursor.execute(
        "SELECT * FROM messages WHERE chat_id=? AND id <= ?",
        (message_info[3], message_id),
    )
    MESSAGES = [
        {
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    # create a new chat id (random number)
    new_chat_id = random.randint(100000, 999999)

    # add each message to the new chat id
    for message in MESSAGES:
        cursor.execute(
            "INSERT INTO messages(role, content, chat_id, request_timestamp) VALUES(?, ?, ?, ?)",
            (
                message["role"],
                message["content"],
                new_chat_id,
                message["request_timestamp"],
            ),
        )
        conn.commit()

    # Fetch all messages for the chat id
    cursor.execute("SELECT * FROM messages WHERE chat_id=?", (new_chat_id,))
    MESSAGES = [
        {
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    request_timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")

    # execute chat completion
    full_response = gpt4all_instance.chat_completion(
        MESSAGES,
        **CHAT_COMPLETION_CONFIG.dict(),  # pass all config parameters as kwargs
    )

    # Add assistant's response to the database
    cursor.execute(
        "INSERT INTO messages(role, content, chat_id, request_timestamp) VALUES(?, ?, ?, ?)",
        (
            "assistant",
            full_response.get("choices")[0].get("message").get("content"),
            new_chat_id,
            request_timestamp,
        ),
    )
    conn.commit()

    # Fetch all messages for the chat id
    cursor.execute("SELECT * FROM messages WHERE chat_id=?", (new_chat_id,))
    MESSAGES = [
        {
            "id": row[0],
            "role": row[1],
            "content": row[2],
            "chat_id": row[3],
            "request_timestamp": row[4],
            "timestamp": row[5],
        }
        for row in cursor.fetchall()
    ]

    return MESSAGES
