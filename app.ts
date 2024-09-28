import { Client, GatewayIntentBits, VoiceState, ChannelType, PermissionFlagsBits, GuildMember, VoiceBasedChannel } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config();

const PERMS = {
    joinToCreate: PermissionFlagsBits.PrioritySpeaker,
    temporaryChannel: PermissionFlagsBits.RequestToSpeak
};
  
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates
    ]
});
  
client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    if (oldState.channel !== newState.channel) {
        if (oldState.channel) await handleLeave(oldState);
        if (newState.channel) await handleJoin(newState);
    }
});
  
async function handleJoin(state: VoiceState) {
    const { channel, member, guild } = state;
    if (!channel || !member || !guild) return;

    if (!isJTCChannel(channel)) return;
  
    const newChannel = await guild.channels.create({
        name: `${member.user.displayName}'s Channel`,
        type: ChannelType.GuildVoice,
        parent: channel.parent!!.id,
        permissionOverwrites: [
            ...channel.parent!!.permissionOverwrites.cache.toJSON() || [],
            {
                id: client.user!.id,
                allow: PERMS.temporaryChannel
            }
        ]
    });
  
    await setChannelOwner(newChannel, member);
    await member.voice.setChannel(newChannel);
}
  
async function handleLeave(state: VoiceState) {
    const { channel, member } = state;
    if (!channel || !member) return;

    if (!isTemporaryChannel(channel)) return;

    if (channel.members.size == 0) {
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
  
    const categoryPerms = category.permissionsFor(channel.client.user!);
    if (!categoryPerms?.has([
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.ManageChannels,
        PermissionFlagsBits.ManageRoles,
        PermissionFlagsBits.MoveMembers
    ])) return false;
  
    const channelPerms = channel.permissionOverwrites.cache.get(channel.client.user!.id);
    if (!channelPerms?.allow.has(PERMS.joinToCreate)) return false;

    return true;
}
  
function isTemporaryChannel(channel: VoiceBasedChannel): boolean {
    const category = channel.parent;
    if (!category) return false;
  
    const jtcChannel = category.children.cache
        .filter(ch => ch.type === ChannelType.GuildVoice)
        .find(ch => isJTCChannel(ch as VoiceBasedChannel));
      
    if (!jtcChannel) return false;
  
    const channelPerms = channel.permissionOverwrites.cache.get(channel.client.user!.id);
    if (!channelPerms?.allow.has(PERMS.temporaryChannel)) return false;

    return true;
}
  
async function setChannelOwner(channel: VoiceBasedChannel, member: GuildMember) {
    await channel.permissionOverwrites.edit(member, {
        Connect: true,
        ManageChannels: true,
        CreateInstantInvite: true,
        MoveMembers: true,
    });
}
  
client.login(process.env.DISCORD_TOKEN);