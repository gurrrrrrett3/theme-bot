import Client from "./modules/commandClient";
import config from "./config.json";
import DataManager from "./modules/dataManager";
import PlayTrack from "./modules/playTrack";

const __Client = new Client(config.discord.TOKEN);

__Client.on("voiceStateUpdate", async (oldState, newState) => {

    if (oldState.channelId !== newState.channelId) {
        if (newState.channelId) {
            // User joined a voice channel
            if (newState.channel?.type != "GUILD_VOICE") return;
            if (newState.id == config.discord.USER_ID) return;
            if (!DataManager.getGlobal(newState.guild.id, "enabled")) return;
            if (DataManager.getUserTheme(newState.guild.id, newState.id, "ENTER") == null) return;
            
            PlayTrack.play(newState, "ENTER")
        } else {
            // User left a voice channel
            if (oldState.id == config.discord.USER_ID) return;
            if (!DataManager.getGlobal(oldState.guild.id, "enabled")) return;
            if (DataManager.getUserTheme(oldState.guild.id, oldState.id, "EXIT") == null) return;
            
            PlayTrack.play(oldState, "EXIT")
        }
    }

});

export default __Client as Client;