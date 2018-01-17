import { SimulatorService } from "./simulator.service";

export class Tape {
  /**
   * String containing all the symbols on the tape
   *
   * This string does not include the infinitely many blank symbols
   * If space is need needed it gets generated dynamically
   */
  private valueValue = '';
  /**
   * Position of the head relative to the most left symbol on the tape
   */
  headPosition = 0;

  constructor(
    private s: SimulatorService
  ) { }

  get value() {
    return this.valueValue;
  }

  set value(value: string) {
    this.headPosition = Math.min(this.headPosition, value.length - 1);
    this.valueValue = value;
  }

  /**
   * Reads at head's position
   */
  read(): string {
    return this.value.charAt(this.headPosition);
  }
  /**
   * Writes at head's position
   */
  write(symbol) {
    this.value = this.value.substr(0, this.headPosition) + symbol + this.value.substr(this.headPosition + symbol.length);
  }
  /**
   * Moves the head
   */
  move(move: 0 | -1 | 1) {
    if (move == 0) {
      return;
    }
    if (move == -1) {
      if (this.headPosition == 0) {
        this.value = this.s.blankSymbol + this.value;
      } else {
        this.headPosition--;
      }
    } else if (move == 1) {
      if (this.headPosition == this.value.length - 1) {
        this.value += this.s.blankSymbol;
      }
      this.headPosition++;
    }
  }

  toJson() {
    return {
      value: this.value,
      headPosition: this.headPosition
    };
  }

  fromJson(json) {
    this.value = json.value;
    this.headPosition = json.headPosition;
  }
}
