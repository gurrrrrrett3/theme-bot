import {
  ActionRowBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import ThemeModule from "..";
import { bot, db } from "../../../..";
import SlashCommandBuilder from "../../../loaders/objects/customSlashCommandBuilder";

const Command = new SlashCommandBuilder()
  .setName("themeadmin")
  .setDescription("idk, admin stuff")
  .setDMPermission(false)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("editother")
      .setDescription("edit other people's themes")
      .addUserOption((option) => option.setName("user").setDescription("the user to edit").setRequired(true))
      .addStringOption((option) =>
        option.setName("type").setDescription("the type of theme to edit").setRequired(true).setChoices(
          {
            name: "Enter",
            value: "ENTER",
          },
          {
            name: "Exit",
            value: "EXIT",
          }
        )
      )
      .setFunction(async (interaction) => {
        const id = Date.now().toString() + interaction.user.id;
        const type = interaction.options.getString("type", true) as "ENTER" | "EXIT";
        const user = interaction.options.getUser("user", true);

        const themeData = await ThemeModule.getThemeModule().getThemeData(
          user.id,
          interaction.guildId!,
          type
        );

        const modal = new ModalBuilder()
          .setTitle("Edit Theme")
          .setCustomId(id)
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("url")
                .setLabel("URL")
                .setMaxLength(2000)
                .setStyle(TextInputStyle.Short)
                .setValue(themeData?.url || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("length")
                .setLabel("Length (in seconds)")
                .setMaxLength(2)
                .setStyle(TextInputStyle.Short)
                .setValue(themeData?.endTime.toString() || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("volume")
                .setLabel("Volume (0-100)")
                .setMaxLength(3)
                .setStyle(TextInputStyle.Short)
                .setValue(themeData?.volume.toString() || "")
                .setRequired(true)
            )
          );

        bot.modalManager.registerModal(id, async (modal) => {
          const url = modal.fields.getTextInputValue("url");
          const length = modal.fields.getTextInputValue("length");
          const volume = modal.fields.getTextInputValue("volume");

          if (!url || !length || !volume) return;

          if (themeData) {
            await db.theme.update({
              where: {
                id: themeData.id,
              },
              data: {
                url,
                endTime: parseInt(length),
                volume: parseInt(volume),
              },
            });
          } else {
            await db.theme.create({
              data: {
                discordId: interaction.user.id,
                guildId: interaction.guildId!,
                url,
                startTime: 0,
                endTime: parseInt(length),
                volume: parseInt(volume),
                type,
              },
            });
          }

          await modal.reply({
            content: "Theme updated!",
            ephemeral: true,
          });
        });

        await interaction.showModal(modal);
      })
  )
  .addSubcommand((subcommand) =>
    subcommand
      .setName("guildoptions")
      .setDescription("edit guild options")
      .setFunction(async (interaction) => {
        const id = Date.now().toString()
        const guildData = await ThemeModule.getThemeModule().getGuildSettings(interaction.guildId!);

        const modal = new ModalBuilder()
          .setTitle("Edit Guild Options")
          .setCustomId(id)
          .addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("enable")
                .setLabel("Enable Themes (true/false)")
                .setStyle(TextInputStyle.Short)
                .setValue(guildData?.enabled.toString() || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("enter")
                .setLabel("Enable Enter Themes")
                .setStyle(TextInputStyle.Short)
                .setValue(guildData?.enterEnabled.toString() || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("exit")
                .setLabel("Enable Exit Themes")
                .setStyle(TextInputStyle.Short)
                .setValue(guildData?.exitEnabled.toString() || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("maxlength")
                .setLabel("Max Length (in seconds)")
                .setStyle(TextInputStyle.Short)
                .setValue(guildData?.maxLength.toString() || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("maxvolume")
                .setLabel("Max Volume (0-100)")
                .setStyle(TextInputStyle.Short)
                .setValue(guildData?.maxVolume.toString() || "")
                .setRequired(true)
            )
          );

        bot.modalManager.registerModal(id, async (modal) => {
          const enable = modal.fields.getTextInputValue("enable");
          const enter = modal.fields.getTextInputValue("enter");
          const exit = modal.fields.getTextInputValue("exit");
          const maxLength = modal.fields.getTextInputValue("maxlength");
          const maxVolume = modal.fields.getTextInputValue("maxvolume");

          if (!enable || !enter || !exit || !maxLength || !maxVolume)
            return modal.reply({ content: "Invalid input", ephemeral: true });

          if (guildData) {
            await db.guildSettings.update({
              where: {
                id: guildData.id,
              },
              data: {
                enabled: enable === "true",
                enterEnabled: enter === "true",
                exitEnabled: exit === "true",
                maxLength: parseInt(maxLength),
                maxVolume: parseInt(maxVolume),
              },
            });
          } else {
            await db.guildSettings.create({
              data: {
                guildId: interaction.guildId!,
                enabled: enable === "true",
                enterEnabled: enter === "true",
                exitEnabled: exit === "true",
                maxLength: parseInt(maxLength),
                maxVolume: parseInt(maxVolume),
              },
            });
          }

            await modal.reply({
                content: "Guild settings updated!",
                ephemeral: true,
            })

        });

        await interaction.showModal(modal);
      })
  );

export default Command;
