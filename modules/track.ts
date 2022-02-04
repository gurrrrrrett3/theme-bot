import {AudioResource, createAudioResource} from '@discordjs/voice';
import fs from 'fs';
import DataManager from './dataManager';
import path from 'path';

export default class Track {
    
    public userID: string
    public guildID: string

    public startTime: number = 0
    public playTime: number = 0 
    public volume: number = 100

    constructor(guildId: string, userId:string) {
        const userData = DataManager.getUser(guildId, userId)
        if (userData) {
            this.userID = userId
            this.guildID = guildId
            
            this.startTime = userData.startTime
            this.playTime = userData.playTime
            this.volume = userData.volume
        } else {
        this.userID = userId
        this.guildID = guildId

        this.startTime = 0
        this.playTime = 0
        this.volume = 100
        }
    }

    public async createAudioResource(): Promise<AudioResource<Track>> {
        return new Promise(async (resolve, reject) => {

            const themeLocation = path.resolve(`./data/audio/${this.guildID}/${this.userID}.mp3`);
            console.log(themeLocation)

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

    public static async createTrack(guildId: string, userId: string) {
        return await new Track(guildId, userId).createAudioResource().catch(err => {
            console.log(err)
        })
    }
}