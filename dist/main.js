"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const run = (source) => {
    let hadError = false;
    const report = (line, where, message) => {
        hadError = true;
    };
    const error = (line, message) => report(line, "", message);
    const tokens = source.split("");
    console.log(tokens);
};
const runFile = (path) => {
    const source = (0, fs_1.readFileSync)(path, { encoding: "utf8" });
    return run(source);
};
const runPrompt = async () => {
    const asyncQuestion = (prefix) => new Promise((resolve) => {
        scanner.question(prefix, resolve);
    });
    const runLine = async () => {
        const line = await asyncQuestion("> ");
        if (!line)
            return;
        run(line);
        return runLine();
    };
    await runLine();
    scanner.close();
};
//# sourceMappingURL=main.js.map