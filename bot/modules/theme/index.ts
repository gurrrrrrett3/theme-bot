import { ActivityType, ChannelType, VoiceState } from "discord.js";
import { bot, db } from "../../..";
import Module from "../../loaders/base/module";
import MusicModule from "../music";

export default class ThemeModule extends Module {
  name = "theme";
  description = "No description provided";

  async onLoad(): Promise<Boolean> {
    bot.client.on("voiceStateUpdate", async (oldState, newState) => {
      if (oldState.channelId === newState.channelId) return;

      const settings = await this.getGuildSettings(newState.guild.id);

      if (!settings.enabled) return;

      if (newState.channelId === null && oldState.channelId !== null) {
        // User left a channel

        if (!settings.exitEnabled) return;

        if (!oldState.member || oldState.member.user.bot) return;
        this.playTheme(oldState, "EXIT");
      } else if (newState.channelId !== null) {
        // User joined a channel or switched channels

        if (!settings.enterEnabled) return;

        if (!newState.member || newState.member.user.bot) return;
        this.playTheme(newState, "ENTER");
      }
    });

    let currentStatus = 0;

    const statusInterval = setInterval(async () => {
      const guilds    = bot.client.guilds.cache.size;
      const users     = bot.client.guilds.cache.reduce((a, b) => a + b.memberCount, 0);
      const channels  = bot.client.channels.cache.filter((c) => c.type === ChannelType.GuildVoice).size;
      const themes    = await db.theme.count();

      const statuses = [
        `${users} users in ${guilds} guilds`,
        `${channels} voice channels`,
        `${themes} themes`,
      ];

      bot.client.user?.setActivity(statuses[currentStatus], {
        type: ActivityType.Watching,
      });

      currentStatus++;

      if (currentStatus >= statuses.length) {
        currentStatus = 0;
      }
     
    }, 10000);

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

    MusicModule.getMusicModule().mm.addSong(
      voiceChannel.id,
      themeData.url,
      themeData.volume,
      themeData.endTime
    );
  }

  async playThemeInteraction(guildId: string, userId: string, type: "ENTER" | "EXIT" = "ENTER") {
    const themeData = await this.getThemeData(userId, guildId, type);
    if (!themeData) return "No theme found!";
    const voiceChannel = bot.client.guilds.cache.get(guildId)?.members.cache.get(userId)?.voice.channel;
    if (!voiceChannel) return "You are not in a voice channel!";
    MusicModule.getMusicModule().mm.addSong(
      voiceChannel.id,
      themeData.url,
      themeData.volume,
      themeData.endTime
    );

    return "Playing theme!";
  }

  static getThemeModule(): ThemeModule {
    return bot.moduleLoader.getModule("theme") as ThemeModule;
  }
}
