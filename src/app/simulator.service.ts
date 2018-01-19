import { Injectable } from '@angular/core';

import { Timeline } from './timeline';
import { Stage } from './stage';
import { DataService } from './data.service';

export type SimulatorState = 'running' | 'finished' | 'failed';

@Injectable()
export class SimulatorService {
  /**
   * Timeline of last simulation
   */
  timeline: Timeline = new Timeline();
  /**
   * Timeline of a currently running simulation
   */
  runningTimeline: Timeline;
  /**
   * All registers used by the simulation
   */
  registers: number[];
  /**
   * Currenty running timeout for simulation
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

  constructor(
    private data: DataService
  ) {
    eval('window.app.simulator = this');

    data.s = this;

    this.fromEmpty();

    data.load();
  }

  fromEmpty() {
    let stage = new Stage();
    this.timeline.stages[0] = stage;
  }
  /**
   * Registers change and runs simulation in timeout
   */
  s() {
    this.data.p();
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.simulate.bind(this), 600);
  }
  /**
   * Simulate and thus generate a new timeline
   */
  simulate() {
    this.timeout = null;

    this.simulationState = 'running';
    this.simulationErrors = [];
    this.registers = [];

    this.runningTimeline = new Timeline();
    //this.runningTimeline.stages.push(this.timeline.stages[0]);
  }
}
