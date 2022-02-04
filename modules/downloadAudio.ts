import ytdl from "ytdl-core";
import fs from "fs";
export default class AudioDownloader {

    public static async download(guildId: string, userId: string, theme: string | null) {
        if (!theme) return

        return new Promise<void>((resolve, reject) => {
            if (fs.existsSync(`./data/audio/${guildId}/`)) {
                fs.mkdirSync(`./data/audio/${guildId}/`, { recursive: true });
            }
            const file = fs.createWriteStream(`./data/audio/${guildId}/${userId}.mp3`);
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