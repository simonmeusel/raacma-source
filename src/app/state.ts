import { Instruction } from './instruction';
import { SimulatorService } from './simulator.service';

export interface InstructionList { [key: string]: Instruction }

export class State {
  /**
   * Name of this state
   */
  name: string = '';
  /**
   * Map mapping symbols to instructions
   */
  private instructionsValue: InstructionList = {};
  private oldSymbols: string = '';

  constructor(
    private s: SimulatorService
  ) {
    this.instructions = {};
  }

  get instructions() {
    if (this.s.symbols != this.oldSymbols) {
      this.oldSymbols = this.s.symbols;
      this.fillInstructions();
    }
    return this.instructionsValue;
  }

  set instructions(instructions: InstructionList) {
    this.instructionsValue = instructions;
    this.fillInstructions();
  }

  private fillInstructions() {
    for (const symbol of this.s.symbolsArray) {
      if (!this.instructionsValue.hasOwnProperty(symbol)) {
        const instruction = new Instruction(this.s, symbol);
        this.instructionsValue[symbol] = instruction;
      }
    }
  }

  static isValidStateName(name: string, s: SimulatorService): boolean {
    return (
      name != '' &&
      !s.hasState(name) &&
      !name.includes(' ')
    );
  }

  toJson() {
    const instructionsArray = [];
    for (const instructionSymbol in this.instructions) {
      instructionsArray.push(this.instructions[instructionSymbol].toJson());
    }
    return {
      name: this.name,
      oldSymbols: this.oldSymbols,
      instructionsArray: instructionsArray
    }
  }

  fromJson(json) {
    this.name = json.name;
    this.oldSymbols = json.oldSymbols;
    this.instructions = {};
    for (let instructionJson of json.instructionsArray) {
      const instruction = new Instruction(this.s, instructionJson.symbol);
      instruction.fromJson(instructionJson);
      this.instructions[instruction.symbol] = instruction;
    }
  }
}
