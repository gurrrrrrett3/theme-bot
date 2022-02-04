import Discord from 'discord.js';
import Voice from '@discordjs/voice'
import DataManager from './dataManager';
import Manager from './manager';

export default class PlayTheme {

    public static async play(manager: Manager, user: string) {

        const userData = DataManager.getUser(user);

        if (!userData.theme || userData.muted) return
        
        
    }
}