import { bot } from "../../..";
import Module from "../../loaders/base/module";

export default class MiscModule extends Module {
  name = "misc";
  description = "Misc module";

  getMiscModule(): MiscModule {
    return bot.moduleLoader.getModule("misc") as MiscModule;
  }
}
