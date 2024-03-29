import chalk from "chalk";
import fs from "fs";
import path from "path";
import Bot from "../bot";
import Module from "./base/module";
import { CustomCommandBuilder } from "./loaderTypes";

export default class ModuleLoader {
  public modules: Map<string, Module> = new Map();

  constructor(private bot: Bot) {
    this.loadModules();
  }

  public addModule(module: Module) {
    this.modules.set(module.name, module);
  }

  public getModule(name: string): any {
    return this.modules.get(name);
  }

  public loadModules() {
    const modulesPath = path.join(__dirname, "../modules");
    const modules = fs.readdirSync(modulesPath);
    for (const mod of modules) {
      const modulePath = path.join(modulesPath, mod);
      const moduleFile = require(modulePath);
      const m = new moduleFile.default(this.bot);
      this.addModule(m);
    }

    console.log(chalk.bgBlue("[ModuleLoader]"), "Found", this.modules.size, `module${this.modules.size === 1 ? "" : "s"}`);

    //load commands on ready

    this.bot.client.once("ready", async () => {
      const promises: Promise<CustomCommandBuilder[]>[] = [];
      this.modules.forEach(async (module) => {
        promises.push(
          new Promise(async (resolve) => {
            const moduleCommands = await module.loadCommands();
            await module.onLoad();
            resolve(moduleCommands);
          })
        );
      });

      const commands: CustomCommandBuilder[] = [];
      (await Promise.all(promises)).forEach((moduleCommands) => {
        commands.push(...moduleCommands);
      });

      this.bot.commandLoader.load(commands);
    });
  }

  public getAllModules(): Module[] {
    const modulesPath = path.join(__dirname, "../modules");
    const modules = fs.readdirSync(modulesPath);

    const moduleObjects: Module[] = [];
    for (const mod of modules) {
      const modulePath = path.join(modulesPath, mod);
      const moduleFile = require(modulePath);
      const m = new moduleFile.default(this.bot);

      moduleObjects.push(m);
    }
    return moduleObjects;
  }

  public getLoadedModules(): Module[] {
    return Array.from(this.modules.values());
  }

  public getUnloadedModules(): Module[] {
    const loadedModules = this.getLoadedModules();
    const allModules = this.getAllModules();

    const unloadedModules: Module[] = [];
    allModules.forEach((module) => {
      if (!loadedModules.includes(module)) unloadedModules.push(module);
    });

    return unloadedModules;
  }

  public getModuleCommands(moduleName: string): CustomCommandBuilder[] {
    return Array.from(this.bot.commandLoader.commands.filter((command) => command.getModule() === moduleName).values())
  }

  public isModuleLoaded(moduleName: string): boolean {
    return this.modules.has(moduleName);
  }

  public async loadModule(moduleName: string): Promise<boolean> {
    if (this.isModuleLoaded(moduleName)) return false;

    const modulePath = path.join(__dirname, "../modules", moduleName);
    const moduleFile = require(modulePath);
    const m = new moduleFile.default(this.bot);
    this.addModule(m);

    const moduleCommands = await m.loadCommands();
    this.bot.commandLoader.load(moduleCommands);

    return true;
  }

  public async unloadModule(moduleName: string): Promise<boolean> {
    if (!this.isModuleLoaded(moduleName)) return false;

    const module = this.getModule(moduleName);
    if (!module) return false;

    const moduleCommands = this.getModuleCommands(moduleName);
    this.bot.commandLoader.unload(moduleCommands);

    this.modules.delete(moduleName);

    return true;
  }
}
