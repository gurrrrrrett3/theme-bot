import { bot } from "../../..";
import Bot from "../../bot";
import Module from "../../loaders/base/module";
import MusicManager from "./musicManager";

export default class MusicModule extends  Module {
  name = "Music";
  description = "Music bot, but I ripped it apart for theme bot";

  mm = new MusicManager();

  async init(bot: Bot) {
    // init code here, this is called when the module is loaded
  }

  public static getMusicModule() {
    return bot.moduleLoader.getModule("Music") as MusicModule;
  }
}
