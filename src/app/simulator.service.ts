import { DataService } from './data.service';
import { Injectable } from '@angular/core';
import { Program } from './program';
import { Stage } from './stage';
import { Timeline } from './timeline';

export type SimulatorState = 'running' | 'finished' | 'failed';

@Injectable()
export class SimulatorService {
  /**
   * Timeline of last simulation
   */
  timeline: Timeline = new Timeline();
  /**
   * Currently running timeout for simulation
   */
  timeout;
  /**
   * Current state of the simulation
   */
  simulationState: SimulatorState = 'finished';
  /**
   * Errors while simulating
   */
  simulationErrors: string[] = [];
  /**
   * Program for simulation
   */
  program: Program;
  /**
   * Biggest index of register
   */
  maxRegisters: number = 0;

  constructor(
    private data: DataService
  ) {
    eval('window.app.simulator = this');

    data.s = this;

    data.load();
  }
  /**
   * Registers change and runs simulation in timeout
   */
  s() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.simulate.bind(this), 600);
  }

  /**
   * Simulate and thus generate a new timeline
   */
  simulate() {
    this.simulationState = 'running';
    this.simulationErrors = [];
    let registers = this.program.args;
    this.maxRegisters = registers.length;

    this.timeline.stages = [];
    this.timeline.stages[0] = new Stage(0, 0, registers.slice());

    let i = 1;
    let pointer = 0;
    while (i <= 100000) {
      const line = this.program.instructions[pointer];
      if (!line) {
        this.simulationErrors.push('Line at pointer ' + pointer + ' not found!');
        return;
      }
      let newPointer = pointer;

      if (/^GOTO [0-9]+$/.test(line)) {
        newPointer = Number.parseInt(line.split(' ')[1]);
      } else if (/^STOP$/.test(line)) {
        this.timeline.stages.push(new Stage(i, pointer, registers.slice()));
        return;
      } else {
        this.simulationErrors.push('Line ' + pointer + ' ' + line + ' does not match any command!');
        return;
      }

      this.timeline.stages.push(new Stage(i, pointer, registers.slice()));

      pointer = newPointer + 1;
      i++;
    }

    if (i = 100000) {
      this.simulationErrors.push('Program exceeded 100000 executions (endless loop?)!');
    }
  }
}
