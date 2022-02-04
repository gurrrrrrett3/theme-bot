import Client from "./modules/commandClient";
import config from "./config.json";
import { generateDependencyReport } from "@discordjs/voice";
import DataManager from "./modules/dataManager";
import Manager from "./modules/manager";
import Track from "./modules/track";
import PlayTrack from "./modules/playTrack";

console.log(generateDependencyReport())

const __Client = new Client(config.discord.TOKEN);

__Client.on("voiceStateUpdate", async (oldState, newState) => {

    if (oldState.channelId !== newState.channelId) {
        if (newState.channelId) {
            // User joined a voice channel
            if (newState.channel?.type != "GUILD_VOICE") return;
            if (newState.id == config.discord.USER_ID) return;
            if (!DataManager.getGlobal(newState.guild.id, "enabled")) return;
            if (DataManager.getUserTheme(newState.guild.id, newState.id) == null) return;
            
            PlayTrack.play(newState)
        }   
    }

});

export default __Client as Client;