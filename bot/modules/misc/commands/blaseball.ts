import { EmbedBuilder } from "discord.js";
import SlashCommandBuilder from "../../../loaders/objects/customSlashCommandBuilder";

const Command = new SlashCommandBuilder()
  .setName("blaseball")
  .setDescription("see how many people have signed up for blaseball")
  .setFunction(async (interaction) => {
    const data = await fetch("https://api2.blaseball.com//fall-ball/count").then((res) => res.text());
    await interaction.reply({
        embeds: [
            new EmbedBuilder()
                .setTitle("Blaseball")
                .setDescription(`${data} people have signed up for Blaseball`)
                .setColor("Random")
                .setTimestamp()
        ]
    })
  });

export default Command;