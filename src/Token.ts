import { TokenType } from "./TokenType";

export class Token {
  readonly type: TokenType;
  readonly lexeme: string;
  readonly literal: unknown;
  readonly line: number;

  constructor(
    _type: TokenType,
    _lexeme: string,
    _literal: unknown,
    _line: number
  ) {
    this.type = _type;
    this.lexeme = _lexeme;
    this.literal = _literal;
    this.line = _line;
  }

  toString() {
    return `${this.type} ${this.lexeme} ${this.literal}`;
  }
}
