import ytdl from "ytdl-core";
import fs from "fs";
import { ThemeType } from "./dataManager";
export default class AudioDownloader {

    public static async download(guildId: string, userId: string, theme: string | null, type: ThemeType) {
        if (!theme) return

        if (!fs.existsSync(`./data/audio/${guildId}/${userId}/`)) {
            fs.mkdirSync(`./data/audio/${guildId}/${userId}/`, { recursive: true });
        }

        return new Promise<void>((resolve, reject) => {
            const file = fs.createWriteStream(`./data/audio/${guildId}/${userId}/${type}.wav`);
            const stream = ytdl(theme, {
                filter: "audioonly",
                quality: "highestaudio",
                highWaterMark: 1 << 25
            });
            stream.on("error", (err) => {
                reject(err);
            });
            stream.on("end", () => {
                resolve();
            });
            stream.pipe(file);
        })
    } 

}