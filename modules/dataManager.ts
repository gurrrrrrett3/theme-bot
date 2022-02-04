import fs from "fs";
export default class DataManager {
    
    public static newUser(userId: string) {
        const newUser = {
            theme: null,
            volume: 1,
            muted: false
        }
        const data = JSON.parse(DataManager.openFile());
        data.users[userId] = newUser;
        DataManager.saveFile(data);
    }

    public static getUser(userId: string): {
        theme: string | null;
        volume: number;
        muted: boolean;
    } {
        const data = JSON.parse(DataManager.openFile());
        if (data.users[userId]) {
            return data.users[userId];
        } else {
            this.newUser(userId);
            return data.users[userId];
        }
    }

    public static saveUser(userId: string, data: any) {
        const userData = JSON.parse(DataManager.openFile());
        userData.users[userId] = data;
        DataManager.saveFile(userData);
    }

    public static setUserTheme(userId: string, theme: string | null) {
        const user = this.getUser(userId);
        user.theme = theme;
        this.saveUser(userId, user);
    }

    public static setUserVolume(userId: string, volume: number) {
        const user = this.getUser(userId);
        user.volume = volume;
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

    public static getUserMuted(userId: string): boolean {
        const user = this.getUser(userId);
        return user.muted;
    }


    private static openFile() {
        return fs.readFileSync("./data/settings.json", "utf8");
    }

    private static saveFile(data: Database) {
        fs.writeFileSync("./data/settings.json", JSON.stringify(data, null, 4));
    }
}

export interface UserData {
    theme: string | null;
    volume: number;
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
