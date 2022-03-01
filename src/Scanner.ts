import { keywords } from "./keywords";
import { Token } from "./Token";
import { TokenType } from "./TokenType";

export class Scanner {
  private readonly source: string;
  readonly tokens: Token[];

  private start: number;
  private current: number;
  private line: number;
  private reportError: (line: number, where: string, message: string) => void;

  constructor(
    _source: string,
    _reportError: (line: number, where: string, message: string) => void
  ) {
    this.source = _source;
    this.reportError = _reportError;
    this.tokens = [];

    this.start = 0;
    this.current = 0;
    this.line = 1;
  }

  private isAtEnd() {
    return this.current >= this.source.length;
  }

  private advance() {
    return this.source.charAt(this.current++);
  }

  private match(expectedChar: string) {
    if (this.isAtEnd() || this.source.charAt(this.current) !== expectedChar)
      return false;

    this.current++;
    return true;
  }

  private peek() {
    if (this.isAtEnd()) return "\0";
    return this.source.charAt(this.current);
  }

  private string() {
    while (this.peek() !== `"` && !this.isAtEnd()) {
      if (this.peek() === `\n`) this.line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      return this.reportError(this.line, "", "Unterminated string.");
    }

    this.advance();

    const text = this.source.substring(this.start + 1, this.current - 1);

    this.addToken(TokenType.STRING, text);
  }

  private isDigit(c: string) {
    return !!c.match(/[0-9]/g);
  }

  private isAlpha(c: string) {
    return !!c.match(/[a-zA-Z_]/g);
  }

  private isAlphaNumeric(c: string) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  private identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    const text = this.source.substring(
      this.start,
      this.current
    ) as keyof typeof keywords;

    this.addToken(keywords[text] || TokenType.IDENTIFIER);
  }

  private peekNext() {
    if (this.current + 1 >= this.source.length) return "\0";
    return this.source.charAt(this.current + 1);
  }

  private number() {
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      this.advance();

      while (this.isDigit(this.peek())) this.advance();
    }

    this.addToken(
      TokenType.NUMBER,
      parseFloat(this.source.substring(this.start, this.current))
    );
  }

  private addToken(type: TokenType, literal?: unknown) {
    const text = this.source.substring(this.start, this.current);

    this.tokens.push(new Token(type, text, literal || null, this.line));
  }

  private scanToken() {
    const char = this.advance();
    switch (char) {
      case "(":
        this.addToken(TokenType.LEFT_PAREN);
        break;
      case ")":
        this.addToken(TokenType.RIGHT_PAREN);
        break;
      case "{":
        this.addToken(TokenType.LEFT_BRACE);
        break;
      case "}":
        this.addToken(TokenType.RIGHT_BRACE);
        break;
      case ",":
        this.addToken(TokenType.COMMA);
        break;
      case ".":
        this.addToken(TokenType.DOT);
        break;
      case "-":
        this.addToken(TokenType.MINUS);
        break;
      case "+":
        this.addToken(TokenType.PLUS);
        break;
      case ";":
        this.addToken(TokenType.SEMICOLON);
        break;
      case "*":
        this.addToken(TokenType.STAR);
        break;
      case "!":
        this.addToken(this.match("=") ? TokenType.BANG_EQUAL : TokenType.BANG);
        break;
      case "=":
        this.addToken(
          this.match("=") ? TokenType.EQUAL_EQUAL : TokenType.EQUAL
        );
        break;
      case "<":
        this.addToken(this.match("=") ? TokenType.LESS_EQUAL : TokenType.LESS);
        break;
      case ">":
        this.addToken(
          this.match("=") ? TokenType.GREATER_EQUAL : TokenType.GREATER
        );
        break;
      case "/":
        if (this.match("/")) {
          while (this.peek() !== "\n" && !this.isAtEnd()) this.advance();
        } else this.addToken(TokenType.SLASH);
        break;
      case " ":
      case "\r":
      case "\t":
        break;
      case "\n":
        this.line++;
        break;
      case `"`:
        this.string();
        break;
      default:
        if (this.isDigit(char)) {
          this.number();
        } else if (this.isAlpha(char)) {
          this.identifier();
        } else {
          this.reportError(this.line, "", `Unexpected character. "${char}"`);
        }
        break;
    }
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
    return this.tokens;
  }
}
