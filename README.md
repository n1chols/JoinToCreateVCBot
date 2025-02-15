## JoinToCreateVCBot - [Invite me!](https://discord.com/oauth2/authorize?client_id=1289098871909384202)
Simple Discord bot enabling join-to-create voice channels.

No dangerous global permissions required!

### How it works
##### When a user joins a designated "Join to Create" channel:
1. The bot creates a new temporary channel for the user.
2. The user is given customization permissions for that channel.
3. The user is moved into the new temporary channel.

##### When a user leaves a designated temporary channel:
1. If the channel is now empty, it's deleted.
2. Otherwise, if they were the owner, a new user will inherit channel customization permissions.

### Instructions
##### 1. Add a "Join to Create" channel:
Explicitly grant the bot user `Priority Speaker` in the desired voice channel. (This is intentionally arbitrary as to not interfere with server permissions.)

##### 2. Set the required permissions:
Make sure the voice channel is synced with a parent category and ensure the bot has each of the following permissions in the parent category:
- `View Channels`
- `Manage Channels`
- `Manage Permissions`
- `Move Members`
- `Request to Speak`
