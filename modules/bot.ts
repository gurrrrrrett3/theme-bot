import { ActivityType, Client } from "discord.js";
/**
 * The main class for the bot. Handles all interactions and storage
 */
export default class Bot {

  /**
   * Creates a new bot.
   */
  constructor(public client: Client) {
   

    client.once("ready", async () => {
     
      //  Status update
      this.setStatus();
      setInterval(() => {
        this.setStatus();
      }, 15000);
    });
  }
  /**
   * Set the bot's status
   */
  public async setStatus() {
    
  }
}
