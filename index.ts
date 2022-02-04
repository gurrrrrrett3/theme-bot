import Client from "./modules/commandClient";
import config from "./config.json";

const __Client = new Client(config.discord.TOKEN);