# gmessage

gmessage is like imessage but you only talk to your computer.

This is a work in progress and may contain UI bugs and other issues. This app is mainly for my personal use but feel free to use it if you want. PR's are more than welcome 🙏

Status: 🐣 (needs bug fixes and stabilization of core features, most happy path features are working but need to be more robust and user friendly)

## Running the project

```bash
pnpm i
pnpm run dev --port 5190
```

### Why?

There are many UI's and ways to interact with LLM's however they they are a bit too complex for my liking. I wanted something simple, small, familiar and easy to customize.

### Design Goals

- 🐥 Lots of themes!
- 🐣 Search chat history
- 🐣 Create, view multiple chats
- 🐣 Text to speech
- 🐣 Export chat to JSON file
- 🥚 Fork chats at specific message
- 🥚 Rerun chat from specific message
- 🥚 Edit and up/down vote messages
- 🥚 Prompt manager
- 🥚 Webhook manager
- 🥚 Dual factor authentication TOTP

### Stretch Goals
- plugin support (3rd party themes, plugins, etc)
- multi user support
- notes/playground mode
- RLHF QA mode