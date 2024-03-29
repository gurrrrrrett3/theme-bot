import Bot from "../../bot";
import { CustomCommandBuilder } from "../loaderTypes";
import fs from "fs"
import path from "path"
import { Client } from "discord.js";
import chalk from "chalk";

export default class Module  {
     name: string = ""
     description: string = ""

    private client?: Client
    private commands: Map<string, CustomCommandBuilder> = new Map();

    constructor(bot: Bot) {
        this.client = bot.client;
        this.client.on("ready", () => {
            console.info(chalk.bgBlue(`[${this.name}]`), `Loaded module ${this.constructor.name}`);
        })
    }

    /**
     * Override this method to run code when the module is loaded
     */
    async onLoad(): Promise<Boolean> {
        console.log(chalk.bgGreen(`[${this.name}]`), `Ready!`);
        return true;
    }

    /**
     * Override this method to run code when the module is unloaded
     */
    async onUnload(): Promise<Boolean> {
        console.log(chalk.bgGreen(`[${this.name}]`), `Succcessfully unloaded!`);
        return true;
    }
         
    public async loadCommands() {
        if (!fs.existsSync(path.resolve(`./dist/bot/modules/${this.name}/commands`))) {
            console.log(chalk.bgYellow(`[${this.name}]`), `No commands found for module, skipping...`)
            return []
        }
        const commandFolder = fs.readdirSync(path.resolve(`./dist/bot/modules/${this.name}/commands`));
        
        let commands: CustomCommandBuilder[] = [];
        this.commands = new Map();

        for (const commandFile of commandFolder) {
            const command = require(path.resolve(`./dist/bot/modules/${this.name}/commands/${commandFile}`)).default as CustomCommandBuilder;
            command.setModule(this.name);            
            commands.push(command);

            this.commands.set(command.getName(), command);
        }

        return commands;
    }
}