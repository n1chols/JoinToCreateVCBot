## JoinToCreateVCBot
Lightweight Discord bot enabling join-to-create voice channels

### How it works
##### When a user joins a designated "Join to Create" channel:
1. The bot creates a temporary channel for the user.
2. The joiner gets channel customization permissions.

##### When a user leaves a designated temporary channel:
1. If the voice channel is empty, it's deleted
2. Otherwise, if the user was the creator, the next user inherits channel customization permissions

### Instructions
##### 1. Add a "Join to Create" channel:
Explicitly grant the bot user `Priority Speaker` in the desired voice channel. (This is intentionally arbitrary as to not interfere with server permissions.)

##### 2. Set the required permissions:
Make sure that the channel is synced with the parent category and ensure that the bot has all of the following permissions within the parent category:
- `View Channels`
- `Manage Channels`
- `Manage Permissions`
- `Move Members`
- `Request to Speak`
