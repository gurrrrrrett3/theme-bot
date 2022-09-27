import { VoiceState } from "discord.js";
import { bot, db } from "../../..";
import Module from "../../loaders/base/module";
import MusicModule from "../music";

export default class ThemeModule extends Module {
  name = "theme";
  description = "No description provided";

  async onLoad(): Promise<Boolean> {
    bot.client.on("voiceStateUpdate", async (oldState, newState) => {

      if (oldState.channelId === newState.channelId) return;
      if (newState.channelId === null && oldState.channelId !== null) {
        // User left a channel

        if (!oldState.member || oldState.member.user.bot) return;
        this.playTheme(oldState, "EXIT");
      } else if (newState.channelId !== null) {
        // User joined a channel or switched channels

        if (!newState.member || newState.member.user.bot) return;
        this.playTheme(newState, "ENTER");
      }
    });

    return true;
  }

  async getThemeData(discordId: string, guildId: string, type: "ENTER" | "EXIT") {
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

  async playTheme(state: VoiceState, type: "ENTER" | "EXIT" = "ENTER") {
    if (!state.member || !state.member.user) return;
    const themeData = await this.getThemeData(state.member.user.id, state.guild.id, type);
    console.log(themeData);
    if (!themeData) return;
   const voiceChannel = state.channel!;

    MusicModule.getMusicModule().mm.addSong(voiceChannel.id, themeData.url, themeData.volume, themeData.endTime);
  }

  static getThemeModule(): ThemeModule {
    return bot.moduleLoader.getModule("theme") as ThemeModule;
  }
}
