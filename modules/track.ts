import {AudioResource, createAudioResource} from '@discordjs/voice';
import fs from 'fs';
import DataManager, { ThemeType } from './dataManager';
import path from 'path';

export default class Track {
    
    public userID: string
    public guildID: string

    public type: ThemeType = "ENTER"
    public startTime: number = 0
    public playTime: number = 0 
    public volume: number = 100

    constructor(guildId: string, userId:string, type: ThemeType = "ENTER") {
        const userData = DataManager.getUser(guildId, userId)
        if (userData) {
            this.type = type
            this.userID = userId
            this.guildID = guildId

            this.startTime = DataManager.getUserStartTime(guildId, userId, type)
            this.playTime = DataManager.getUserPlayTime(guildId, userId, type)
            this.volume =  DataManager.getUserVolume(guildId, userId, type)
        } else {
        this.type = type
        this.userID = userId
        this.guildID = guildId

        this.startTime = 0
        this.playTime = 0
        this.volume = 100
        }
    }

    public async createAudioResource(): Promise<AudioResource<Track>> {
        return new Promise(async (resolve, reject) => {

            const themeLocation = path.resolve(`./data/audio/${this.guildID}/${this.userID}/${this.type}.wav`);

            if (fs.existsSync(themeLocation)) {

                const res = createAudioResource(fs.createReadStream(themeLocation), {
                    metadata: this,
                    inlineVolume: true,
                })
                resolve(res)
            } else {
                reject(new Error('Theme not found'))
            }
        });
    }

    public static async createTrack(guildId: string, userId: string, type: ThemeType = "ENTER") {
        return await new Track(guildId, userId, type).createAudioResource().catch(err => {
            console.log(err)
        })
    }
}