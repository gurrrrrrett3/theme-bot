import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  entersState,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionDisconnectReason,
  VoiceConnectionState,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Embed,
  EmbedBuilder,
  GuildMember,
  Message,
  TextChannel,
  User,
} from "discord.js";
import { promisify } from "node:util";
import MusicModule from ".";
import { bot } from "../../..";
import { Track } from "./track";

interface QueueOptions {
  connection: VoiceConnection;
  message?: Message;
}

const canModifyQueue = (member: GuildMember) =>
  member.voice.channelId === member.guild.members.cache.get(member.client.user!.id)!.voice.channelId;

const wait = promisify(setTimeout);

export class MusicQueue {
  public message?: Message;
  public readonly connection: VoiceConnection;
  public readonly player: AudioPlayer;
  public readonly MusicManager = MusicModule.getMusicModule();

  public resource?: AudioResource<Track>;
  public Tracks: Track[] = [];
  public volume = 100;
  public loop = false;
  public muted = false;
  public waitTimeout?: NodeJS.Timeout;
  private queueLock = false;
  private readyLock = false;

  public constructor(options: QueueOptions) {
    this.connection = options.connection;
    this.message = options.message;

    this.player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Play } });
    this.connection?.subscribe(this.player);

    this.connection?.on(
      "stateChange",
      async (oldState: VoiceConnectionState, newState: VoiceConnectionState) => {
        if (newState.status === VoiceConnectionStatus.Disconnected) {
          if (
            newState.reason === VoiceConnectionDisconnectReason.WebSocketClose &&
            newState.closeCode === 4014
          ) {
            try {
              this.stop();
            } catch (e) {
              console.log(e);
              this.stop();
            }
          } else if (this.connection && this.connection.rejoinAttempts < 5) {
            await wait((this.connection.rejoinAttempts + 1) * 5_000);
            this.connection?.rejoin();
          } else {
            this.connection?.destroy();
          }
        } else if (
          !this.readyLock &&
          (newState.status === VoiceConnectionStatus.Connecting ||
            newState.status === VoiceConnectionStatus.Signalling)
        ) {
          this.readyLock = true;
          try {
            if (this.connection) {
              await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
            }
          } catch {
            if (this.connection?.state.status !== VoiceConnectionStatus.Destroyed) {
              try {
                this.connection?.destroy();
              } catch {}
            }
          } finally {
            this.readyLock = false;
          }
        }
      }
    );

    this.player.on("stateChange" as any, async (oldState: AudioPlayerState, newState: AudioPlayerState) => {
      if (oldState.status !== AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Idle) {
        if (this.loop && this.Tracks.length) {
          this.Tracks.push(this.Tracks.shift()!);
        } else {
          this.Tracks.shift();
        }

        if (this.Tracks.length || this.resource) this.processQueue();
      } else if (
        oldState.status === AudioPlayerStatus.Buffering &&
        newState.status === AudioPlayerStatus.Playing
      ) {
        
      }
    });

    this.player.on("error", (error) => {
      console.error(error);
      if (this.loop && this.Tracks.length) {
        this.Tracks.push(this.Tracks.shift()!);
      } else {
        this.Tracks.shift();
      }
      this.processQueue();
    });
  }

  public enqueue(...Tracks: Track[]) {
    if (typeof this.waitTimeout !== "undefined") clearTimeout(this.waitTimeout);
    this.Tracks = this.Tracks.concat(Tracks);
    this.processQueue();
  }

  public stop() {
    this.loop = false;
    this.Tracks = [];
    this.player.stop();
    this.connection.state.status !== VoiceConnectionStatus.Destroyed && this.connection?.destroy();
    this.message && MusicModule.getMusicModule().mm.queues.delete(this.message?.guild!.id);
    this.MusicManager.mm.queues.delete(this.connection.joinConfig.guildId);
  }

  public async processQueue(): Promise<void> {
    if (this.queueLock || this.player.state.status !== AudioPlayerStatus.Idle) {
      return;
    }

    if (!this.Tracks.length) {
      return this.stop();
    }

    this.queueLock = true;

    const next = this.Tracks[0];

    try {
      const resource = await next.makeResource();

      this.resource = resource!;
      this.player.play(this.resource);
      this.resource.volume?.setVolumeLogarithmic(this.volume / 100);

      setTimeout(() => {
        console.log("skipping");
        this.skip()
      }, this.resource.metadata.duration * 1000 ?? 15000);


    } catch (error) {
      console.error(error);

      return this.processQueue();
    } finally {
      this.queueLock = false;
    }
  }

  public async skip() {
      this.player.stop();
  }
}
