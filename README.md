# gmessage

gmessage is like imessage but you only talk to your computer.

This is a work in progress and may contain UI bugs and other issues. This app is mainly for my personal use but feel free to use it if you want. PR's are more than welcome 🙏

Status: 🐣 (needs bug fixes and stabilization of core features, most happy path features are working but need to be more robust and user friendly)

## Running the project

```bash
# run the command to do the following
make
# start web app makefile
#   install pnpm
#   install dependencies
#   build the web app
#
# start sever makefile
#   get git dependencies
#   build gpt4all dependencies
#   download llm model
#   build server

# star the standalone server + app
server/gmessage
```

### Why?

There are many UI's and ways to interact with LLM's however they they are a bit too complex for my liking. I wanted something simple, small, familiar and easy to customize.

### Design Goals

- 🐥 Lots of themes!
- 🐥 Python server
- 🐥 Search chat history
- 🐥 Create, view multiple chats
- 🐥 Text to speech
- 🐥 Export chat to JSON file
- 🐣 Fork chats at specific message
- 🐣 Rerun chat from specific message
- 🐣 Configure mode and chat settings
- 🥚 Edit and up/down vote messages
- 🥚 Prompt manager
- 🥚 Webhook manager
- 🥚 Dual factor authentication TOTP

### Stretch Goals
- plugin support (3rd party themes, plugins, etc)
- multi user support
- notes/playground mode
- RLHF QA mode


### Examples

Choose your favorite theme, or add a new one to [./src/themes.ts](src/themes.ts).

![themes](https://github.com/drbh/gmessage/assets/9896130/6083db08-b6dd-463d-925b-0066e4a3cf43)

Search your message history as you type!

![search-messages](https://github.com/drbh/gmessage/assets/9896130/ae150a05-d0f3-4ea2-b2b2-7003f0e58f7c)

Ask the AI questions 100% offline.

![first-chat](https://github.com/drbh/gmessage/assets/9896130/a082d705-a38c-454b-ac67-b94a5c326033)
