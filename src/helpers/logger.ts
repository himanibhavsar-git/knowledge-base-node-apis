import { createLogger, format, transports } from "winston";
const {
  combine, timestamp, prettyPrint, colorize,
} = format;

export class Log {

  public static getLogger() {
    return createLogger({
      format: combine(
        timestamp(),
        prettyPrint(),
        colorize()
      ),
      level: "debug",
      transports: [new transports.Console()],
    });
  }
}
