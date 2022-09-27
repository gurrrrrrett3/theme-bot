import { ActionRowBuilder } from "@discordjs/builders";
import { ModalBuilder, PermissionFlagsBits, TextInputBuilder, TextInputStyle } from "discord.js";
import ThemeModule from "..";
import { bot, db } from "../../../..";
import SlashCommandBuilder from "../../../loaders/objects/customSlashCommandBuilder";

const Command = new SlashCommandBuilder()
  .setName("theme")
  .setDescription("Manage your themes")
  .setDefaultMemberPermissions(PermissionFlagsBits.Speak)
  .addSubcommand((subcommand) =>
    subcommand
      .setName("edit")
      .setDescription("Edit your theme")
      .addStringOption((option) =>
        option
          .setName("type")
          .setDescription("The type of theme you want to edit")
          .setRequired(true)
          .addChoices(
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
        const themeData = await ThemeModule.getThemeModule().getThemeData(
          interaction.user.id,
          interaction.guildId!,
          type
        );

        const guildSettings = await ThemeModule.getThemeModule().getGuildSettings(interaction.guildId!);

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
                .setLabel(`Length (in seconds, max ${guildSettings.maxLength})`)
                .setStyle(TextInputStyle.Short)
                .setValue(themeData?.endTime.toString() || "")
                .setRequired(true)
            ),
            new ActionRowBuilder<TextInputBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId("volume")
                .setLabel(`Volume (0-${guildSettings.maxVolume})`)
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

          if (parseFloat(length) > guildSettings.maxLength) {
            await modal.reply({
              content: `The length must be less than ${guildSettings.maxLength} seconds`,
              ephemeral: true,
            });
            return;
          }

          if (parseFloat(volume) > guildSettings.maxVolume) {
            await modal.reply({
              content: `The volume must be less than ${guildSettings.maxVolume}`,
              ephemeral: true,
            });
            return;
          }

          if (themeData) {
            await db.theme.update({
              where: {
                id: themeData.id,
              },
              data: {
                url,
                endTime: parseFloat(length),
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
                endTime: parseFloat(length),
                volume: parseInt(volume),
                type,
              },
            });
          }
        });

        await interaction.showModal(modal);
      })
  );

export default Command;
