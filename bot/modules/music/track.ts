import { AudioResource, createAudioResource, StreamType } from "@discordjs/voice";
import youtube from "youtube-sr";
import { getInfo } from "ytdl-core";
import ytdl from "ytdl-core-discord";

export interface TrackData {
  url: string;
  title: string;
  duration: number;
}

export class Track {
  public readonly url: string;
  public readonly title: string;
  public readonly duration: number;

  public constructor({ url, title, duration }: TrackData) {
    this.url = url;
    this.title = title;
    this.duration = duration;
  }

  public static async from(url: string = "", duration: number = 15) {
    const videoPattern = /^(https?:\/\/)?(www\.)?(m\.|music\.)?(youtube\.com|youtu\.?be)\/.+$/;
    const isYoutubeUrl = videoPattern.test(url);
    // const isScUrl = scRegex.test(url);

    let TrackInfo;

    if (isYoutubeUrl) {
      TrackInfo = await getInfo(url);

      return new this({
        url: TrackInfo.videoDetails.video_url,
        title: TrackInfo.videoDetails.title,
        duration: duration
      });
    } else {
      const result = await youtube.searchOne("");


      TrackInfo = await getInfo(`https://youtube.com/watch?v=${result.id}`);

      return new this({
        url: TrackInfo.videoDetails.video_url,
        title: TrackInfo.videoDetails.title,
        duration: duration
      });
    }
  }

  public async makeResource(): Promise<AudioResource<Track> | void> {
    let stream;

    let type = this.url.includes("youtube.com") ? StreamType.Opus : StreamType.OggOpus;

    const source = this.url.includes("youtube") ? "youtube" : "soundcloud";

    if (source === "youtube") {
      stream = await ytdl(this.url, { quality: "highestaudio", highWaterMark: 1 << 25 });
    }

    if (!stream) return;

    return createAudioResource(stream, { metadata: this, inputType: type, inlineVolume: true });
  }
}
