import { AudioPlayerStatus } from "@discordjs/voice";
import { bot, db } from "../../..";
import Module from "../../loaders/base/module";
import MusicModule from "../music";

export default class ThemeModule extends Module {
  name = "theme";
  description = "No description provided";

  async onLoad(): Promise<Boolean> {
    bot.client.on("voiceStateUpdate", async (oldState, newState) => {
      console.log("voice state update");

      if (oldState.channelId === newState.channelId) return;
      if (newState.channelId === null && oldState.channelId !== null) {
        // User left a channel

        console.log("user left channel");
        if (!oldState.member || oldState.member.user.bot) return;

        this.playTheme(oldState.guild.id, oldState.member.id, "EXIT");
      } else if (newState.channelId !== null) {
        // User joined a channel or switched channels

        console.log("user joined channel");
        if (!newState.member || newState.member.user.bot) return;

        this.playTheme(newState.guild.id, newState.member.id);
      }
    });

    return true;
  }

  async getThemeData(discordId: string, guildId: string, type: "ENTER" | "EXIT" = "ENTER") {
    return await db.theme.findFirst({
      where: {
        AND: {
          discordId,
          guildId,
          type,
        },
      },
    });
  }

  async getGuildSettings(guildId: string) {
    const guildSettings = await db.guildSettings.findFirst({
      where: {
        guildId,
      },
    });

    if (!guildSettings) {
      return await db.guildSettings.create({
        data: {
          guildId,
        },
      });
    }

    return guildSettings;
  }

  async playTheme(guildId: string, userId: string, type: "ENTER" | "EXIT" = "ENTER") {
    const themeData = await this.getThemeData(userId, guildId, type);
    console.log(themeData);
    if (!themeData) return;
    const voiceChannel = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice.channel;
    if (!voiceChannel) return;

    MusicModule.getMusicModule().mm.addSong(voiceChannel.id, themeData.url, themeData.volume, themeData.endTime);
  }

  static getThemeModule(): ThemeModule {
    return bot.moduleLoader.getModule("theme") as ThemeModule;
  }
}
