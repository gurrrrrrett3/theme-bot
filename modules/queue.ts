import { AudioResource } from "@discordjs/voice";
import Track from "./track";
export default class Queue {
	private q: AudioResource<Track>[];

	constructor() {
		this.q = [];
	}

	public add(resource: AudioResource<Track>) {
		this.q.push(resource);
	}

	public next() {
		this.q.shift();
	}

	public nowPlaying() {
		return this.q[0];
	}

	public length() {
		return this.q.length;
	}

	public clear() {
		this.q = [];
	}

}
