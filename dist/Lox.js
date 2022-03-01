"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const process_1 = require("process");
const readline = __importStar(require("readline"));
class Lox {
    constructor() {
        this.hadError = false;
        this.scanner = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    }
    asyncQuestion(prefix) {
        return new Promise((resolve) => {
            this.scanner.question(prefix, resolve);
        });
    }
    report(line, where, message) {
        console.log(`[line ${line}] Error${where}: ${message}`);
        this.hadError = true;
    }
    error(line, where, message) {
        return this.report(line, "", message);
    }
    async run(source) {
        this.hadError = false;
        const tokens = source.split("");
        console.log(tokens);
    }
    async runPrompt() {
        const runLine = async () => {
            const line = await this.asyncQuestion("> ");
            if (!line)
                return;
            this.run(line);
            return runLine();
        };
        await runLine();
        this.scanner.close();
    }
    runFile(path) {
        const source = (0, fs_1.readFileSync)(path, { encoding: "utf8" });
        return this.run(source);
    }
    async execute(args) {
        if (args.length > 3) {
            console.log('Usage: "yarn lox [path to file]" OR "yarn lox" to open the REPL');
            process.exit(64);
        }
        else if (args.length === 3) {
            return this.runFile(args[1]);
        }
        this.runPrompt();
    }
}
const lox = new Lox();
(async () => lox.execute(process.argv))();
//# sourceMappingURL=Lox.js.map