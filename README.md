## JoinToCreateVCBot
Lightweight Discord bot enabling join-to-create voice channels

### How it works
When a user joins a designated "Join to Create" channel:
1. The bot creates a temporary channel for the user.
2. The joiner gets channel customization permissions.
3. Permissions transfer if joiner leaves; channel deletes when empty.

### Instructions
##### 1. Add a "Join to Create" channel:
Explicitly grant the bot user `Priority Speaker` in the desired voice channel. (This is intentionally arbitrary as to not interfere with server permissions.)

##### 2. Set the required permissions:
Ensure the bot has these permissions within the parent category:
- `View Channels`
- `Manage Channels`
- `Manage Permissions`
- `Move Members`
