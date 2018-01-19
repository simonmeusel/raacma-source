import { SimulatorService } from './simulator.service';

export class Stage {
  /**
   * Position in timeline
   */
  time: number;
  /**
   * Line of program executed
   */
  line: string[] = [];
}
