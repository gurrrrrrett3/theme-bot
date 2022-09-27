import { DiscordGatewayAdapterCreator, joinVoiceChannel } from "@discordjs/voice";
import { ChatInputCommandInteraction, Collection, TextBasedChannel, TextChannel, VoiceChannel } from "discord.js";
import { bot } from "../../..";
import { MusicQueue } from "./queue";
import { Track } from "./track";

export default class MusicManager {
  public queues = new Collection<string, MusicQueue>();

  constructor() {}

  public getQueue(guildId: string) {
    return this.queues.get(guildId);
  }

  public addQueue(guildId: string, queue: MusicQueue) {
    this.queues.set(guildId, queue);
  }

  public async addSong(voiceChannel: string, url: string, volume: number, duration: number) {
    
    const channel = bot.client.channels.cache.get(voiceChannel) as VoiceChannel
    const queue = this.getQueue(channel.guildId);
    

    let song;

    try {
      song = await Track.from(url, duration);
    } catch (error) {
      console.error(error);
      return;
    }


    if (queue) {
      queue.volume = volume;
      queue.enqueue(song);
    } else {

        const vc = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator as DiscordGatewayAdapterCreator,
          })

          vc.on("stateChange", (oldState, newState) => {
            console.log(oldState.status, newState.status);
            
          });

      const newQueue = new MusicQueue({
        connection: vc,
      });

      this.addQueue(channel.guildId, newQueue);
      newQueue.volume = volume;
      newQueue.enqueue(song);
    }
  }
  
  public async skip(guildId: string) {
    const queue = this.getQueue(guildId);
    if (queue) {
      queue.skip();
    }
  }
  
}
