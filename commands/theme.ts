import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandIntegerOption } from '@discordjs/builders';
import Discord from 'discord.js';
import DataManager from '../modules/dataManager';

const Command = {
    data: new SlashCommandBuilder()
        .setName('theme')
        .setDescription('Edit your Theme settings')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('set')
            .setDescription('Set your theme')
            .addStringOption(new SlashCommandStringOption()
            .setRequired(true)
            .setName('theme')
            .setDescription('A youtube video url')
            ))
            
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('volume')
            .setDescription('Set your theme volume')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
            .setName('volume')
            .setDescription('The volume of the theme, from 1 to 100')
            )) 
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
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('playtime')
            .setDescription('Set your theme play time')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(0)
            .setMaxValue(300)
            .setName('playtime')
            .setDescription('The play time of the theme, from 0 to 300 seconds')
            ))
            
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('remove')
            .setDescription('Remove your theme')
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('view')
            .setDescription('View your theme')
        )
        ,
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            if (!interaction.isCommand()) return
            const commandOptions = interaction.options
            const commandData = commandOptions.data
            const subCommand = commandData[0].name

            switch (subCommand) {
                case 'set':
                    const theme = commandOptions.getString('theme')
                    if (!theme) return
                    console.log(`Setting theme to ${theme}`)
                    await interaction.reply({ephemeral: true, content: `Setting theme to ${theme}`})
                    DataManager.setUserTheme(interaction.user.id, theme).then(() => {
                            interaction.editReply(`Theme set to ${theme}`)
                    }).catch(err => {
                            interaction.editReply(`Error setting theme: ${err}`)  
                    })
                    break
                case 'volume':
                    const volume = commandOptions.getInteger('volume')
                    if (!volume) return
                    console.log(`Setting volume to ${volume}`)
                    interaction.reply({ephemeral: true, content: `Setting volume to ${volume}`})
                    DataManager.setUserVolume(interaction.user.id, volume)
                    break
                case 'starttime':
                    const startTime = commandOptions.getInteger('starttime')
                    if (!startTime) return
                    console.log(`Setting start time to ${startTime}`)
                    interaction.reply(`Setting start time to ${startTime} seconds`)
                    DataManager.setStartTime(interaction.user.id, startTime * 1000)
                    break
                case 'playtime':
                    let playTime = commandOptions.getInteger('playtime')
                    if (!playTime) return
                    if (playTime > DataManager.getGlobal("maxThemeTime") / 1000) {
                        interaction.reply({ephemeral: true, content: `Play time cannot be more than ${DataManager.getGlobal("maxThemeTime") / 1000} seconds, setting to ${DataManager.getGlobal("maxThemeTime") / 10000} seconds.`})
                        playTime = DataManager.getGlobal("maxThemeTime")
                    } else {
                        interaction.reply({ephemeral: true, content: `Setting play time to ${playTime} seconds`})
                    }
                    
                    console.log(`Setting play time to ${playTime} seconds`)
                    DataManager.setPlayTime(interaction.user.id, (playTime ?? 1) * 1000)
                    break
                case 'remove':
                    console.log(`Removing theme`)
                    interaction.reply({ephemeral: true, content: `Removed theme`})
                    DataManager.setUserTheme(interaction.user.id, null)
                    break
                case 'view':
                    console.log(`Viewing theme`)
                    const userTheme = DataManager.getUserTheme(interaction.user.id)
                    const userVolume = DataManager.getUserVolume(interaction.user.id)
                    const userPlayTime = DataManager.getUserPlayTime(interaction.user.id)
                    interaction.reply({ephemeral: true, content: userTheme ? `Your theme is ${userTheme}\nIt plays for ${userPlayTime / 1000} seconds, at ${Math.round(userVolume * 100)}% volume` : `You don't have a theme set`})
                    break
                default:
                    interaction.reply({ephemeral: true, content: `Invalid subcommand`})
                    break
            }
        }
}
module.exports = Command;