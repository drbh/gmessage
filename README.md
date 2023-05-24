![GMESSAGE](./media/logo.png)

Chatbotting made beautiful with gmessage - a visual treat for local conversations.

gmessage is an easy and lite way to get started with a locally running LLM on your computer.

We are currently in alpha and mainly targeting OSX however the project should work on Linux and Windows as well it just hasn't been tested yet.

Contributions are more than welcome! and bugs are expected please report them [here](issues)

## 🏇 Run

The fastest way is to use the pre-built docker image.

```bash
docker run -p 10999:10999 drbh/gmessage:v0.0.0
```

**This method will run the server and allow you to interact with it via the web app. This deployment is similar to the cloud deployment since it skips the desktop app and only runs the server and web app.

[See more ways to run below](#ways-to-run)

### Features

- ✅ Easy to use
- ✅ Beautiful UI
- ✅ Easy to install
- ✅ Lots of themes
- ✅ Search chat history
- ✅ Create, view multiple chats
- ✅ Text to speech
- ✅ Export chat to JSON file
- ✅ Menubar, Desktop & Web apps built-in
- ✅ View and manage models
- ✅ Locally running LLM server
- ✅ Dockerized
- ✅ Cloud deployment ready
- ☢️ This is experimental software and should not be used in production!
- ☢️ More features to come!

### Menubar
![openapp](./media/openapp.gif) 

## Manage Models

![modelmgmt](./media/modelmgmt.gif)

#### Search 
![search](./media/search.gif)

#### Themes
![themes](./media/themes.gif)

### From Python
Since we respond to and return the same JSON format as the OpenAI API you can use the same python code to interact with gmessage as you would with the OpenAI API.
```python
import openai

openai.api_key = ""
openai.api_base = "http://localhost:10999/api"

response = openai.Completion.create(
  model="gpt4all-mpt-7b",
  messages=[
        {
            "role": "system",
            "content": "You are a helpful assistant."
        },
        {
            "role": "user",
            "content": "Hello there."
        },
        {
            "role": "assistant",
            "content": "Hi, how can I help you?"
        },
        {
            "role": "user",
            "content": "Reverse a list in Python."
        }
    ]
)

print(response.choices[0])
```

### Ways to run


### 💻 Build and run on your computer

This method will build the server and the desktop app on your computer and can be bundled into a single executable for native use.

```bash
make
bin/gmessage
```

### 🐳 Build Docker

You can compile your own docker image and run it locally or on any cloud provider that supports docker. 

```bash
# build it yourself
docker build -t gmessage .
docker run -p 10999:10999 gmessage
```

### ⛅️ Deploy to Cloud via Fly.io

Fly.io provides an easy way to deploy containerized apps to the cloud. Below are a few steps that result in a running gmessage app on the cloud.

```bash
flyctl init
flyctl deploy

fly scale vm shared-cpu-4x
fly scale memory 8192

# at the time of writing;
# the cost of 4 vCPUs and 8GB of RAM is $0.0000165/s ($42.79/mo) 
# check out https://fly.io/docs/about/pricing/ for up to date info
fly scale show

# VM Resources for app: gmessage

# Groups
# NAME	COUNT	KIND  	CPUS	MEMORY 	REGIONS
# app 	1    	shared	4   	8192 MB	bos    	

# now open the app in your browser
open 'https://gmessage.fly.dev/' 


# when you're done you can delete the app
fly destroy gmessage
```


## Limitations

Open source AI is in rapid development and is improving every day. However, these models are still in their infancy and have a long way to go before they can be used in production. They are often slower, and produce less coherent results than their commercial counterparts. Over time `gmesssage` will improve as the underlying models improve but for now it is best used for hacking, experimentation and research.
