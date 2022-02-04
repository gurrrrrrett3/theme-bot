import Client from "./modules/commandClient";
import config from "./config.json";
import { generateDependencyReport } from "@discordjs/voice";
import Manager from "./modules/manager";
import Track from "./modules/track";

console.log(generateDependencyReport())

const __Client = new Client(config.discord.TOKEN);

__Client.on("voiceStateUpdate", async (oldState, newState) => {

    if (oldState.channelId !== newState.channelId) {
        if (newState.channelId) {
            // User joined a voice channel
            if (newState.channel?.type != "GUILD_VOICE") return;
         const manager = new Manager(newState.channel)

         manager.join()
         const track = await Track.createTrack(newState.id).catch(err => {
                console.log(err)
         })
         if (!track) return;
         manager.playAudioResource(track) 
        }
    }

});