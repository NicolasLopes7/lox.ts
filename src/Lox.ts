import { readFileSync } from "fs";
import { stdin as input, stdout as output } from "process";
import * as readline from "readline";

class Lox {
  private hadError = false;
  private scanner: readline.Interface;
  constructor() {
    this.scanner = readline.createInterface({ input, output });
  }

  private asyncQuestion(prefix: string) {
    return new Promise((resolve: (answer: string) => unknown) => {
      this.scanner.question(prefix, resolve);
    });
  }

  private report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }

  private error(line: number, where: string, message: string) {
    return this.report(line, "", message);
  }

  private async run(source: string) {
    this.hadError = false;

    const tokens = source.split("");
    console.log(tokens);
  }

  private async runPrompt() {
    const runLine: () => Promise<void> = async () => {
      const line = await this.asyncQuestion("> ");
      if (!line) return;
      this.run(line);
      this.hadError = false;
      return runLine();
    };

    await runLine();
    this.scanner.close();
  }

  private runFile(path: string) {
    const source = readFileSync(path, { encoding: "utf8" });
    this.run(source);

    if (this.hadError) process.exit(65);
  }
  async execute(args: string[]) {
    if (args.length > 3) {
      console.log(
        'Usage: "yarn lox [path to file]" OR "yarn lox" to open the REPL'
      );
      process.exit(64);
    } else if (args.length === 3) {
      return this.runFile(args[1]);
    }
    this.runPrompt();
  }
}

const lox = new Lox();

(async () => lox.execute(process.argv))();
