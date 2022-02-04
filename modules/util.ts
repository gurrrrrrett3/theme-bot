import { ThemeType } from "./dataManager"

export default class Util {
    public static checkType(type: string): ThemeType {
        if (!type) return "ENTER"
        if (type.toLowerCase() === "exit") return "EXIT"
        else return "ENTER"
    }
}