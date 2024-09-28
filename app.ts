import { 
    Client, 
    GatewayIntentBits, 
    VoiceState, 
    ChannelType, 
    PermissionFlagsBits,
    VoiceBasedChannel,
    GuildMember
} from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const channelMarkers = {
    JOIN_TO_CONNECT: "PrioritySpeaker",
    TEMPORARY: "RequestToSpeak"
} as const

const requiredPermissions = [
    PermissionFlagsBits.ViewChannel,
    PermissionFlagsBits.Connect,
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageRoles,
    PermissionFlagsBits.MoveMembers,
    PermissionFlagsBits[channelMarkers.TEMPORARY]
]

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    if (oldState.channelId === newState.channelId) return;
    if (oldState.channel) await handleLeave(oldState);
    if (newState.channel) await handleJoin(newState);
});

async function handleJoin(state: VoiceState): Promise<void> {
    const { channel, member, guild } = state;
    if (!channel || !member || !guild) return;

    if (!isJTCChannel(channel)) return;

    const newChannel = await guild.channels.create({
        name: `${member.user.displayName}'s Channel`,
        type: ChannelType.GuildVoice,
        parent: channel.parent?.id
    });

    await newChannel.permissionOverwrites.edit(
        client.user!.id,
        {
            [channelMarkers.TEMPORARY]: true
        }
    );

    await setChannelOwner(newChannel, member);
    await member.voice.setChannel(newChannel);
}

async function handleLeave(state: VoiceState): Promise<void> {
    const { channel, member } = state;
    if (!channel || !member) return;

    if (!isTemporaryChannel(channel)) return;

    if (channel.members.size === 0) {
        await channel.delete();
    } else {
        await channel.permissionOverwrites.delete(member.id);
        const nextOwner = channel.members.first();
        if (nextOwner) await setChannelOwner(channel, nextOwner);
    }
}

function isJTCChannel(channel: VoiceBasedChannel): boolean {
    const category = channel.parent;
    if (!category) return false;

    const categoryPerms = category.permissionsFor(client.user!);
    if (!categoryPerms?.has(requiredPermissions)) return false;

    const channelPerms = channel.permissionOverwrites.cache.get(channel.client.user!.id);
    return channelPerms?.allow.has(PermissionFlagsBits[channelMarkers.JOIN_TO_CONNECT]) ?? false;
}

function isTemporaryChannel(channel: VoiceBasedChannel): boolean {
    const category = channel.parent;
    if (!category) return false;

    const jtcChannel = category.children.cache
        .filter(ch => ch.type === ChannelType.GuildVoice)
        .find(ch => isJTCChannel(ch as VoiceBasedChannel));
    
    if (!jtcChannel) return false;

    const channelPerms = channel.permissionOverwrites.cache.get(channel.client.user!.id);
    return (
        channelPerms?.allow.has(PermissionFlagsBits[channelMarkers.TEMPORARY]) &&
        !channelPerms?.allow.has(PermissionFlagsBits[channelMarkers.JOIN_TO_CONNECT])
    ) ?? false;
}

async function setChannelOwner(channel: VoiceBasedChannel, member: GuildMember) {
    await channel.permissionOverwrites.edit(member, {
        Connect: true,
        ManageChannels: true,
        MoveMembers: true,
    });
}

client.login(process.env.DISCORD_TOKEN);
