import { Client, Colors, TextChannel } from "discord.js";
import ModuleLoader from "./loaders/moduleLoader";
import CommandLoader from "./loaders/commandLoader";
import ButtonManager from "./loaders/managers/buttonManager";
import SelectMenuManager from "./loaders/managers/selectMenuManager";
import ModalManager from "./loaders/managers/modalManager";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import { db } from "..";

export default class Bot {

    commandLoader: CommandLoader
    moduleLoader: ModuleLoader

    buttonManager: ButtonManager
    selectMenuManager: SelectMenuManager
    modalManager: ModalManager
  
  constructor(public client: Client) {
    this.client
      .on("ready", () => {
        console.info(chalk.bgBlue(`[Discord]`) ,`Logged in as ${chalk.green(this.client.user?.tag)}`);

        console.info(chalk.bgBlue(`[Discord]`), `Loaded ${client.guilds.cache.size} guilds`);
        
        fs.readFileSync(path.resolve("announcement.txt") , "utf-8").replace(/\\n/, "\n").split("\n").forEach(async (line) => {
          if (line.startsWith("//") || line.length < 2) return;
        
          client.guilds.cache.forEach(async (guild) => {
            let guildData = await db.guildSettings.findFirst({
              where: {
                guildId: guild.id
              }}
            ) 

            if (!guildData) {
              guildData = await db.guildSettings.create({
                data: {
                  guildId: guild.id,
                  enabled: true,
                  maxLength: 60,
                  announcementsChannelId: null,
                  announcementsEnabled: true,
                  maxVolume: 100,
                  enterEnabled: true,
                  exitEnabled: true
                }
              })  
            }

            console.log(guildData)

            if (!guildData.announcementsEnabled) return;

            let genChannel = guildData.announcementsChannelId ? guild.channels.cache.get(guildData?.announcementsChannelId as string) as TextChannel : guild.channels.cache.find((channel) => channel.name.includes("general") && !channel.name.includes("health")) as TextChannel ?? guild.systemChannel ?? guild.channels.cache.first() as TextChannel; 
            await genChannel.send({
              embeds: [{
                title: "ThemeBot Announcement",
                description: line,
                color: Colors.Blue,
                footer: {
                  text: "To change where these announcements are sent, or disable them, use the themeadmin command."
                }
              }]
            }).catch(() => {
              console.error(chalk.bgRed(`[Discord]`), `Failed to send announcement to ${guild.name}`);
            }).finally(() => {         
            console.info(chalk.bgBlue(`[Discord]`) ,`Sent announcement to ${chalk.green(guild.name)}`);
            });
          })
        
          const newLine = `//${line}`
          fs.writeFileSync(path.resolve("announcement.txt"), fs.readFileSync(path.resolve("announcement.txt"), "utf-8").replace(line, newLine));      
        })
      })
      
    this.commandLoader = new CommandLoader(this.client);
    this.moduleLoader = new ModuleLoader(this);
    
    this.buttonManager = new ButtonManager(this.client);
    this.selectMenuManager = new SelectMenuManager(this.client);
    this.modalManager = new ModalManager(this.client);
  }
}
