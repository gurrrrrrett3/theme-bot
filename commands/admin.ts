import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandUserOption, SlashCommandIntegerOption} from '@discordjs/builders';
import Discord from 'discord.js';
import DataManager from '../modules/dataManager';

const Command = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin commands')
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('setusertheme')
            .setDescription('Set a user\'s theme')
            .addUserOption(new SlashCommandUserOption()
            .setRequired(true)
            .setName('user')
            .setDescription('The user to set the theme for')
            )
            .addStringOption(new SlashCommandStringOption()
            .setRequired(true)
            .setName('theme')
            .setDescription('A youtube video url')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('setuservolume')
            .setDescription('Set a user\'s volume')
            .addUserOption(new SlashCommandUserOption()
            .setRequired(true)
            .setName('user')
            .setDescription('The user to set the volume for')
            )
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
            .setName('volume')
            .setDescription('The volume of the theme, from 1 to 100')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('removeusertheme')
            .setDescription('Remove a user\'s theme')
            .addUserOption(new SlashCommandUserOption()
            .setRequired(true)
            .setName('user')
            .setDescription('The user to remove the theme for')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('muteuser')
            .setDescription('Mute a user, disabling their theme')
            .addUserOption(new SlashCommandUserOption()
            .setRequired(true)
            .setName('user')
            .setDescription('The user to mute')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('unmuteuser')
            .setDescription('Unmute a user, enabling their theme')
            .addUserOption(new SlashCommandUserOption()
            .setRequired(true)
            .setName('user')
            .setDescription('The user to unmute')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('setvolumescaling')
            .setDescription('Set the volume scaling, will modify the volume of all users')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
            .setName('scaling')
            .setDescription('The volume scaling, from 1 to 100')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('setmaxplaytime')
            .setDescription('Set the maximum length of themes')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(300)
            .setName('length')
            .setDescription('The maximum length of themes, in seconds')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('enable')
            .setDescription('Enable playing of themes')
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('disable')
            .setDescription('Disable playing of themes')
        )
        ,
        async execute(interaction: Discord.CommandInteraction, ...args: any[]) {
            if (!interaction.isCommand()) return
            const commandOptions = interaction.options
            const commandData = commandOptions.data
            const subCommand = commandData[0].name

            if (!interaction.memberPermissions?.has('ADMINISTRATOR')) {
                interaction.reply({ephemeral: true, content: 'You do not have permission to use this command'})
                return
            }
            
            switch (subCommand) {
                case 'setusertheme':
                    const user = commandOptions.getUser('user')
                    const theme = commandOptions.getString('theme')
                    if (!user || !theme) {
                        interaction.reply({ephemeral: true, content: 'You must provide a user and a theme'})
                        return
                    }
                    DataManager.setUserTheme(user.id, theme)
                    interaction.reply({ephemeral: true, content: `Set ${user.username}'s theme to ${theme}`})
                    break
                case 'setuservolume':
                    const user2 = commandOptions.getUser('user')
                    const volume = commandOptions.getInteger('volume')
                    if (!user2 || !volume) {
                        interaction.reply({ephemeral: true, content: 'You must provide a user and a volume'})
                        return
                    }
                    DataManager.setUserVolume(user2.id, volume)
                    interaction.reply({ephemeral: true, content: `Set ${user2.username}'s volume to ${volume}`})
                    break
                case 'removeusertheme':
                    const user3 = commandOptions.getUser('user')
                    if (!user3) {
                        interaction.reply({ephemeral: true, content: 'You must provide a user'})
                        return
                    }
                    DataManager.setUserTheme(user3.id, null)
                    interaction.reply({ephemeral: true, content: `Removed ${user3.username}'s theme`})
                    break
                case 'muteuser':
                    const user4 = commandOptions.getUser('user')
                    if (!user4) {
                        interaction.reply({ephemeral: true, content: 'You must provide a user'})
                        return
                    }
                    DataManager.setUserMuted(user4.id, true)
                    interaction.reply({ephemeral: true, content: `Muted ${user4.username}'s theme`})
                    break
                case 'unmuteuser':
                    const user5 = commandOptions.getUser('user')
                    if (!user5) {
                        interaction.reply({ephemeral: true, content: 'You must provide a user'})
                        return
                    }
                    DataManager.setUserMuted(user5.id, false)
                    interaction.reply({ephemeral: true, content: `Unmuted ${user5.username}`})
                    break
                case 'setvolumescaling':
                    const scaling = commandOptions.getInteger('scaling')
                    if (!scaling) {
                        interaction.reply({ephemeral: true, content: 'You must provide a volume scaling value'})
                        return
                    }
                    DataManager.setGlobal("maxThemeVolume", scaling)
                    interaction.reply({ephemeral: true, content: `Set volume scaling to ${scaling}`})
                    break
                case 'setmaxthemelength':
                    const length = commandOptions.getInteger('length')
                    if (!length) {
                        interaction.reply({ephemeral: true, content: 'You must provide a length value'})
                        return
                    }
                    DataManager.setGlobal("maxThemeTime", length * 1000)
                    interaction.reply({ephemeral: true, content: `Set max theme length to ${length} seconds`})
                    break
                case 'enable':
                    DataManager.setGlobal("enabled", true)
                    interaction.reply({ephemeral: true, content: 'Enabled playing of themes'})
                    break
                case 'disable':
                    DataManager.setGlobal("enabled", false)
                    interaction.reply({ephemeral: true, content: 'Disabled playing of themes'})
                    break
                default:
                    interaction.reply({ephemeral: true, content: 'Invalid subcommand'})
                    break
            }
        }
}
module.exports = Command;