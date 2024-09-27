# JoinToCreateVCBot
A simple, commandless join-to-create voice channel Discord bot.

## About

### What is commandless?
This bot has no commands. It only relies on pre-existing Discord functionality.

### How does it work?
This bot not only creates temporary channels for users, but also gives them the appropiate permissions to manage the channel. This allows for a seamless experience for users less familiar with Discord commands.

## How to use

### Configuring channels
For scalability's sake, this bot stores no data. Instead, any voice channel explicity granting the `Manage Channel` permission to the bot user will be enabled as a "Join to Create" channel. The channel must be in a category in which the bot has all the required permissions (see below). There is a maximum limit of 5 enabled channels per server.

### Category required permissions
- `View Channels`
- `Manage Channels`
- `Manage Permissions`
- `Send Messages`
- `Move Members`

