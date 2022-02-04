import { SlashCommandBuilder, SlashCommandSubcommandBuilder, SlashCommandStringOption, SlashCommandUserOption, SlashCommandIntegerOption} from '@discordjs/builders';
import Discord from 'discord.js';

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
            .setDescription('Set the volume scaling, will change modify the volume of all users')
            .addIntegerOption(new SlashCommandIntegerOption()
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(100)
            .setName('scaling')
            .setDescription('The volume scaling, from 1 to 100')
            )
        )
        .addSubcommand(new SlashCommandSubcommandBuilder()
            .setName('setmaxthemelength')
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
            await interaction.reply('');
        }
}
module.exports = Command;