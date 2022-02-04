import fs from "fs";
import AudioDownloader from "./downloadAudio";
export default class DataManager {
    
    public static newUser(userId: string) {

        const globalData = DataManager.openFile().global

        const newUser: UserData = {
            theme: null,
            volume: 100,
            startTime: 0,
            playTime: globalData.maxThemeTime,
            muted: false
        }
        const data = DataManager.openFile();
        data.users[userId] = newUser;
        DataManager.saveFile(data);
    }

    public static getUser(userId: string): UserData {
        const data = DataManager.openFile();
        if (data.users[userId]) {
            return data.users[userId];
        } else {
            this.newUser(userId);
            return data.users[userId];
        }
    }

    public static saveUser(userId: string, data: UserData) {
        const userData = DataManager.openFile();
        userData.users[userId] = data;
        DataManager.saveFile(userData);
    }

    public static async setUserTheme(userId: string, theme: string | null): Promise<void> {
        const user = this.getUser(userId);
        user.theme = theme;
        this.saveUser(userId, user);

        return AudioDownloader.download(userId, theme);
    }

    public static setUserVolume(userId: string, volume: number) {
        const user = this.getUser(userId);
        user.volume = volume;
        this.saveUser(userId, user);
    }

    public static setStartTime(userId: string, time: number) {
        const user = this.getUser(userId);
        user.startTime = time;
        this.saveUser(userId, user);
    }

    public static setPlayTime(userId: string, time: number) {
        const user = this.getUser(userId);
        user.playTime = time;
        this.saveUser(userId, user);
    }

    public static setUserMuted(userId: string, muted: boolean) {
        const user = this.getUser(userId);
        user.muted = muted;
        this.saveUser(userId, user);
    }

    public static getUserTheme(userId: string): string | null {
        const user = this.getUser(userId);
        return user.theme;
    }

    public static getUserVolume(userId: string): number {
        const user = this.getUser(userId);
        return user.volume;
    }

    public static getUserStartTime(userId: string): number {
        const user = this.getUser(userId);
        return user.startTime;
    }

    public static getUserPlayTime(userId: string): number {
        const user = this.getUser(userId);
        return user.playTime;
    }

    public static getUserMuted(userId: string): boolean {
        const user = this.getUser(userId);
        return user.muted;
    }

    public static setGlobal(key: string, value: any) {
        const data = DataManager.openFile();
        // @ts-expect-error
        data.global[key] = value;
        DataManager.saveFile(data);
    }

    public static getGlobal(key: string): any {
        const data = DataManager.openFile();
        // @ts-expect-error
        return data.global[key];
    }

    public static async downloadFile(userId: string, file: string) {
        return new Promise<void>((resolve, reject) => {
          fetch(file).then(res => res.arrayBuffer()).then(buffer => {
            fs.writeFileSync(`./data/audio/${userId}.mp3`, Buffer.from(buffer));
            resolve();
          }).catch(err => {
            reject(err);
          })
        })
    }

    private static openFile(): Database {
        return JSON.parse(fs.readFileSync("./data/settings.json", "utf8"));
    }

    private static saveFile(data: Database) {
        fs.writeFileSync("./data/settings.json", JSON.stringify(data, null, 4));
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
    maxThemeTime: number;
    themeVolumeScale: number;
}

export interface Database {
    global: GlobalData;
    users: {
        [userId: string]: UserData;
    }
}
