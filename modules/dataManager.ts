import fs from "fs";
import AudioDownloader from "./downloadAudio";
export default class DataManager {
    
    public static newUser(guildId: string, userId: string) {

        const globalData = DataManager.openFile(guildId).global

        const newUser: UserData = {
            theme: null,
            volume: 100,
            startTime: 0,
            playTime: globalData.maxThemeTime,
            muted: false
        }
        const data = DataManager.openFile(guildId);
        data.users[userId] = newUser;
        DataManager.saveFile(guildId, data);
    }

    public static getUser(guildId: string, userId: string): UserData {
        const data = DataManager.openFile(guildId);
        if (data.users[userId]) {
            return data.users[userId];
        } else {
            this.newUser(guildId, userId);
            return data.users[userId];
        }
    }

    public static saveUser(guildId: string, userId: string, data: UserData) {
        const userData = DataManager.openFile(guildId);
        userData.users[userId] = data;
        DataManager.saveFile(guildId, userData);
    }

    public static async setUserTheme(guildId: string, userId: string, theme: string | null): Promise<void> {
        const user = this.getUser(guildId, userId);
        user.theme = theme;
        this.saveUser(guildId, userId, user);

        return AudioDownloader.download(guildId, userId, theme);
    }

    public static setUserVolume(guildId: string, userId: string, volume: number) {
        const user = this.getUser(guildId, userId);
        user.volume = volume;
        this.saveUser(guildId, userId, user);
    }

    public static setStartTime(guildId: string, userId: string, time: number) {
        const user = this.getUser(guildId, userId);
        user.startTime = time;
        this.saveUser(guildId, userId, user);
    }

    public static setPlayTime(guildId: string, userId: string, time: number) {
        const user = this.getUser(guildId, userId);
        user.playTime = time;
        this.saveUser(guildId, userId, user);
    }

    public static setUserMuted(guildId: string, userId: string, muted: boolean) {
        const user = this.getUser(guildId, userId);
        user.muted = muted;
        this.saveUser(guildId, userId, user);
    }

    public static getUserTheme(guildId: string, userId: string): string | null {
        const user = this.getUser(guildId, userId);
        return user.theme;
    }

    public static getUserVolume(guildId: string, userId: string): number {
        const user = this.getUser(guildId, userId);
        return user.volume;
    }

    public static getUserStartTime(guildId: string, userId: string): number {
        const user = this.getUser(guildId, userId);
        return user.startTime;
    }

    public static getUserPlayTime(guildId: string, userId: string): number {
        const user = this.getUser(guildId, userId);
        return user.playTime;
    }

    public static getUserMuted(guildId: string, userId: string): boolean {
        const user = this.getUser(guildId, userId);
        return user.muted;
    }

    public static setGlobal(guildId: string, key: string, value: any) {
        const data = DataManager.openFile(guildId);
        // @ts-expect-error
        data.global[key] = value;
        DataManager.saveFile(guildId, data);
    }

    public static getGlobal(guildId: string, key: string): any {
        const data = DataManager.openFile(guildId);
        // @ts-expect-error
        return data.global[key];
    }

    public static async downloadFile(guildId: string, userId: string, file: string) {
        return new Promise<void>((resolve, reject) => {
          fetch(file).then(res => res.arrayBuffer()).then(buffer => {
            fs.writeFileSync(`./data/audio/${userId}.mp3`, Buffer.from(buffer));
            resolve();
          }).catch(err => {
            reject(err);
          })
        })
    }

    private static openFile(guildId: string): Database {
        this.checkFile(guildId);
        return JSON.parse(fs.readFileSync(`./data/settings/${guildId}.json`, "utf8"));
    }

    private static saveFile(guildId: string, data: Database) {
        this.checkFile(guildId);
        fs.writeFileSync(`./data/settings/${guildId}.json`, JSON.stringify(data, null, 4));
    }

    private static checkFile(guildId: string) {
        if (!fs.existsSync(`./data/settings/${guildId}.json`)) {
            fs.mkdirSync(`./data/settings`, { recursive: true });
            const data: Database = {
                users: {},
                global: {
                    enabled: true,
                    maxThemeTime: 15000,
                    themeVolumeScale: 75
                }
            }
            fs.writeFileSync(`./data/settings/${guildId}.json`, JSON.stringify(data, null, 4));
        }
    }
}

export interface UserData {
    theme: string | null;
    volume: number;
    startTime: number;
    playTime: number;
    muted: boolean;
}

export interface GlobalData {
    enabled: boolean;
    maxThemeTime: number;
    themeVolumeScale: number;
}

export interface Database {
    global: GlobalData;
    users: {
        [userId: string]: UserData;
    }
}
