import Discord from 'discord.js';
export default class VoiceChannelHandler {

    public static async handle(oldState: Discord.VoiceState, newState: Discord.VoiceState) {
        if (oldState.channelId !== newState.channelId) {
            if (newState.channelId) {
                // User joined a voice channel
                await VoiceChannelHandler.handleJoin(newState);
            }
        }
    }   

    private static async handleJoin(state: Discord.VoiceState) {

    }

}