import { SimulatorService } from './simulator.service';

export class Stage {
  constructor(
    /**
     * Position in timeline
     */
    public time: number,
    /**
     * Pointer registers content
     */
    public pointer: number,
    /**
     * Contents of registers
     */
    public registers: number[]
  ) { }
}
