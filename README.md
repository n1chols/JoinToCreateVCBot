# JoinToCreateVCBot
An extremely simple join-to-create voice channel Discord bot.

## How to use

### Configuring channels
For scalability's sake, this bot stores no data. Instead, any voice channel explicity granting the `Manage Channel` permission to the bot will be enabled as a "Join to Create" channel. The channel must be in a category in which the bot has the required permissions (see below). There is a maximum limit of 5 enabled channels per server.

### Required permissions
- `View Channels`
- `Manage Channels`
- `Manage Permissions`
- `Send Messages`
- `Move Members`

