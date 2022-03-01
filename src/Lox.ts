import { readFileSync } from "fs";
import { stdin as input, stdout as output } from "process";
import * as readline from "readline";

import { Scanner } from "./Scanner";

class Lox {
  private hadError = false;
  private promptScanner: readline.Interface;
  constructor() {
    this.promptScanner = readline.createInterface({ input, output });
  }

  private asyncQuestion(prefix: string) {
    return new Promise((resolve: (answer: string) => unknown) => {
      this.promptScanner.question(prefix, resolve);
    });
  }

  private report(line: number, where: string, message: string) {
    console.log(`[line ${line}] Error${where}: ${message}`);
    this.hadError = true;
  }

  private async run(source: string) {
    this.hadError = false;

    const scanner = new Scanner(source, this.report);
    scanner.scanTokens();
    console.log(scanner.tokens);
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
    this.promptScanner.close();
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
