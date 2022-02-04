import { SlashCommandBuilder } from '@discordjs/builders';
import Discord from 'discord.js';
import Package from '../package.json';

const Command = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('Gives information about the bot'), 
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {

            let dependencies: string[] = []
            Object.keys(Package.dependencies).forEach((dependency, index) => {
                dependencies.push(`${dependency}@${Object.values(Package.dependencies)[index]}`)
            })

            const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Info about ThemeBot')
                .setDescription('ThemeBot is a bot that plays music from youtube videos when you join a Voice Channel.\n\nThemeBot is made by [Gucci Garrett](https://gooch.dev)')
                .addField('Github', Package.repository.url, true)
                .addField('Version', Package.version, true)
                .addField('Node Version', process.version, true)
                .addField('Uptime', (Math.floor(process.uptime() / 60) + ' minutes'), true)
                .addField('Dependencies', dependencies.join('\n'))
                .setFooter({text: `Found a bug? [Report it here](${Package.bugs.url}`, iconURL: 'interaction.client.user?.displayAvatarURL()'})
                .setTimestamp();


            interaction.reply({ephemeral: true, embeds: [embed]});
        }
}
module.exports = Command;