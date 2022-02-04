import { VoiceChannel, VoiceState } from "discord.js";
import Manager from "./manager";
import Track from "./track";

export default class PlayTrack {
    public static async play(state: VoiceState) {
        if (state.channel?.type != "GUILD_VOICE") return;
        const manager = new Manager(state.channel)
         manager.join()
         const track = await Track.createTrack(state.id).catch(err => {
                console.log(`Could not create track for user: ${state.id}`)
         })
         if (!track) return;
         manager.playAudioResource(track) 
        }

    public static async playFromChannel(channel: VoiceChannel, id: string) {
        const manager = new Manager(channel)
        manager.join()
        const track = await Track.createTrack(id).catch(err => {
            console.log(`Could not create track for user: ${id}`)
        })
        if (!track) return;
        manager.playAudioResource(track)
    }
}