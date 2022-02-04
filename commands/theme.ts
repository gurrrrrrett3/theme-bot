import {
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandStringOption,
  SlashCommandIntegerOption,
  SlashCommandNumberOption,
} from "@discordjs/builders";
import Discord from "discord.js";
import DataManager from "../modules/dataManager";
import __Client from "..";
import PlayTrack from "../modules/playTrack";
import Util from "../modules/util";

const Command = {
  data: new SlashCommandBuilder()
    .setName("theme")
    .setDescription("Edit your Theme settings")
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("set")
        .setDescription("Set your theme")
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(true)
            .setName("theme")
            .setDescription("A youtube video url")
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(false)
            .setName("type")
            .setDescription("The type of theme you want to set")
            .addChoices([
              ["Enter", "ENTER"],
              ["Exit", "EXIT"],
            ])
        )
    )

    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("volume")
        .setDescription("Set your theme volume")
        .addIntegerOption(
          new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
            .setName("volume")
            .setDescription("The volume of the theme, from 1 to 100")
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(false)
            .setName("type")
            .setDescription("The type of theme you want to set")
            .addChoices([
              ["Enter", "ENTER"],
              ["Exit", "EXIT"],
            ])
        )
    )
    /*
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('starttime')
            .setDescription('Set your theme start time')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(300)
            .setName('starttime')
            .setDescription('The start time of the theme, from 0 to 300 seconds')
            ))
            */
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("playtime")
        .setDescription("Set your theme play time")
        .addNumberOption(
          new SlashCommandNumberOption()
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(300)
            .setName("playtime")
            .setDescription("The play time of the theme, from 0 to 300 seconds")
        )
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(false)
            .setName("type")
            .setDescription("The type of theme you want to set")
            .addChoices([
              ["Enter", "ENTER"],
              ["Exit", "EXIT"],
            ])
        )
    )

    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("remove")
        .setDescription("Remove your theme")
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(false)
            .setName("type")
            .setDescription("The type of theme you want to set")
            .addChoices([
              ["Enter", "ENTER"],
              ["Exit", "EXIT"],
            ])
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("view")
        .setDescription("View your theme")
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(false)
            .setName("type")
            .setDescription("The type of theme you want to set")
            .addChoices([
              ["Enter", "ENTER"],
              ["Exit", "EXIT"],
            ])
        )
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName("play")
        .setDescription("Play your theme")
        .addStringOption(
          new SlashCommandStringOption()
            .setRequired(false)
            .setName("type")
            .setDescription("The type of theme you want to set")
            .addChoices([
              ["Enter", "ENTER"],
              ["Exit", "EXIT"],
            ])
        )
    ),
  async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
    if (!interaction.isCommand()) return;
    if (!interaction.guildId) return;
    const commandOptions = interaction.options;
    const commandData = commandOptions.data;
    const subCommand = commandData[0].name;

    const theme = commandOptions.getString("theme");
    const type = Util.checkType(commandOptions.getString("type") ?? "ENTER");
    const volume = commandOptions.getInteger("volume");
    let playTime = commandOptions.getNumber("playtime");
    const startTime = commandOptions.getNumber("starttime");

    switch (subCommand) {
      case "set":
        if (!theme) return;
        console.log(`Setting theme to ${theme}`);
        await interaction.reply({ ephemeral: true, content: `Setting theme to ${theme}` });
        DataManager.setUserTheme(interaction.guildId, interaction.user.id, type, theme)
          .then(() => {
            interaction.editReply(`${type} Theme set to ${theme}`);
          })
          .catch((err) => {
            interaction.editReply(`Error setting theme: ${err}`);
          });
        break;
      case "volume":
        if (!volume) return;
        console.log(`Setting volume to ${volume}`);
        interaction.reply({ ephemeral: true, content: `Setting volume to ${volume}` });
        DataManager.setUserVolume(interaction.guildId, interaction.user.id, type, volume);
        break;
      case "starttime":
        if (!startTime) return;
        console.log(`Setting start time to ${startTime}`);
        interaction.reply(`Setting start time to ${startTime} seconds`);
        DataManager.setStartTime(interaction.guildId, interaction.user.id, type, startTime * 1000);
        break;
      case "playtime":
        if (!playTime) return;
        if (playTime > DataManager.getGlobal(interaction.guildId, "maxThemeTime") / 1000) {
          interaction.reply({
            ephemeral: true,
            content: `Play time cannot be more than ${
              DataManager.getGlobal(interaction.guildId, "maxThemeTime") / 1000
            } seconds, setting to ${
              DataManager.getGlobal(interaction.guildId, "maxThemeTime") / 1000
            } seconds.`,
          });
          playTime = DataManager.getGlobal(interaction.guildId, "maxThemeTime");
        } else {
          interaction.reply({ ephemeral: true, content: `Setting play time to ${playTime} seconds` });
        }
        console.log(`Setting play time to ${playTime} seconds`);
        DataManager.setPlayTime(interaction.guildId, interaction.user.id, type, (playTime ?? 1) * 1000);
        break;
      case "remove":
        console.log(`Removing theme`);
        interaction.reply({ ephemeral: true, content: `Removed theme` });
        DataManager.setUserTheme(interaction.guildId, interaction.user.id, type, null);
        break;
      case "view":
        console.log(`Viewing theme`);
        const userTheme = DataManager.getUserTheme(interaction.guildId, interaction.user.id, type);
        const userVolume = DataManager.getUserVolume(interaction.guildId, interaction.user.id, type);
        const userPlayTime = DataManager.getUserPlayTime(interaction.guildId, interaction.user.id, type);
        interaction.reply({
          ephemeral: true,
          content: userTheme
            ? `Your ${type.toLowerCase()} theme is ${userTheme}\nIt plays for ${
                userPlayTime / 1000
              } seconds, at ${Math.round(userVolume)}% volume`
            : `You don't have a ${type.toLowerCase()} theme set`,
        });
        break;
      case "play":
        console.log(`Playing theme`);
        const userTheme2 = DataManager.getUserTheme(interaction.guildId, interaction.user.id, type);
        if (!userTheme2) {
          interaction.reply({ ephemeral: true, content: `You don't have a ${type.toLowerCase()} theme set` });
          return;
        }
        let savedChannel: Discord.VoiceChannel | undefined;
        interaction.guild?.channels.cache.forEach((channel) => {
          if (channel.type === "GUILD_VOICE") {
            if (channel.members.get(interaction.user.id) != undefined) {
              savedChannel = channel as Discord.VoiceChannel;
            }
          }
        });
        if (!savedChannel) {
          interaction.reply({ ephemeral: true, content: `You must be in a voice channel to play a theme` });
          return;
        }
        PlayTrack.playFromChannel(savedChannel, interaction.user.id, type);
        interaction.reply({
          ephemeral: true,
          content: `Playing theme: ${DataManager.getUserTheme(
            interaction.guildId,
            interaction.user.id,
            type
          )}`,
        });
        break;
      default:
        interaction.reply({ ephemeral: true, content: `Invalid subcommand` });
        break;
    }
  },
};
module.exports = Command;
