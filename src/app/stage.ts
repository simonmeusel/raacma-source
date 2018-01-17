import { State } from './state';
import { Tape } from './tape';
import { SimulatorService } from './simulator.service';

export class Stage {
  /**
   * Position in timeline
   */
  time: number;
  /**
   * State of turing machine
   */
  state: State;
  /**
   * Current version of the tape
   */
  tape: Tape;

  constructor(
    private s: SimulatorService
  ) {
    this.tape = new Tape(s);
  }
}
