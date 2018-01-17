import { State } from './state';
import { SimulatorService } from './simulator.service';

export class Instruction {
  /**
   * Symbol triggering this instruction
   */
  symbol: string = '';
  /**
   * Next state's name
   */
  targetStateName: string = 'q';
  /**
   * Direction to move the head on the tape
   *
   * A positive number means to move to the right
   * A negative number means to move to the left
   * 0 will not move the head at all
   */
  move: 0 | -1 | 1 = 0;
  /**
   * Symbol replacing the symbol currently at the head
   */
  newSymbol: string = '';

  constructor(
    private s: SimulatorService,
    symbol: string
  ) {
    this.symbol = symbol;
    this.newSymbol = this.s.blankSymbol;
  }

  getMoveString(): string {
    if (this.move == 0) {
      return 'N';
    } else if (this.move == -1) {
      return 'L';
    } else if (this.move == 1) {
      return 'R';
    } else {
      return '' + this.move;
    }
  }

  get summary() {
    return this.newSymbol + ' ' + this.getMoveString() + ' ' + this.targetStateName;
  }

  set summary(summary) {
    const parts = summary.split(' ');
    if (parts.length != 3) {
      this.newSymbol = '';
      this.move = 0;
      this.targetStateName = '';
    }
    this.newSymbol = parts[0];

    const moveString = parts[1].toLocaleUpperCase();
    switch (moveString) {
      case 'N':
        this.move = 0;
        break;
      case 'L':
        this.move = -1;
        break;
      case 'R':
        this.move = 1;
        break;
      default:
        this.move = 0;
        break;
    }

    this.targetStateName = parts[2];
  }

  get valid() {
    return (
      this.newSymbol.length == 1 &&
      this.symbol.length == 1 &&
      this.s.hasState(this.targetStateName)
    );
  }

  toJson() {
    return {
      symbol: this.symbol,
      targetStateName: this.targetStateName,
      move: this.move,
      newSymbol: this.newSymbol
    };
  }

  fromJson(json) {
    this.symbol = json.symbol;
    this.targetStateName = json.targetStateName;
    this.move = json.move;
    this.newSymbol = json.newSymbol;
  }
}
