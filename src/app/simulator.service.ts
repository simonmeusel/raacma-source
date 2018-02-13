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

    const f = a => a ? a : 0;

    let i = 1;
    let pointer = 0;
    while (i <= 1000) {
      const line = this.program.instructions[pointer];
      if (!line) {
        this.simulationState = 'failed';
        this.simulationErrors.push('Line at pointer ' + pointer + ' not found!');
        return;
      }
      let newPointer = pointer;

      if (/^R[0-9]+ := [0-9]+$/.test(line)) {
        // n Ri := k
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        const k = Number.parseInt(regEx.exec(line)[0]);
        registers[i] = k;
        if (i > this.maxRegisters) {
          this.maxRegisters = i + 1;
        }
      } else if (/^R[0-9]+ := R[0-9]+$/.test(line)) {
        // n Ri := Rj
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        const j = Number.parseInt(regEx.exec(line)[0]);
        registers[i] = f(registers[j]);
        if (i > this.maxRegisters) {
          this.maxRegisters = i + 1;
        }
      } else if (/^RR[0-9]+ := R[0-9]+$/.test(line)) {
        // n RRi := Rj
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        const j = Number.parseInt(regEx.exec(line)[0]);
        registers[registers[i]] = f(registers[j]);
        if (i > this.maxRegisters) {
          this.maxRegisters = i + 1;
        }
      } else if (/^R[0-9]+ := RR[0-9]+$/.test(line)) {
        // n Ri := RRj
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        const j = Number.parseInt(regEx.exec(line)[0]);
        registers[i] = f(registers[f(registers[j])]);
        if (i > this.maxRegisters) {
          this.maxRegisters = i + 1;
        }
      } else if (/^R[0-9]+ := R[0-9]+ \+ R[0-9]+$/.test(line)) {
        // n Ri := Rj + Rk
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        const j = Number.parseInt(regEx.exec(line)[0]);
        const k = Number.parseInt(regEx.exec(line)[0]);
        registers[i] = f(registers[j]) + f(registers[k]);
        if (i > this.maxRegisters) {
          this.maxRegisters = i + 1;
        }
      } else if (/^R[0-9]+ := R[0-9]+ \- R[0-9]+$/.test(line)) {
        // n Ri := Rj - Rk
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        const j = Number.parseInt(regEx.exec(line)[0]);
        const k = Number.parseInt(regEx.exec(line)[0]);
        registers[i] = Math.max(f(registers[j]) - f(registers[k]), 0);
        if (i > this.maxRegisters) {
          this.maxRegisters = i + 1;
        }
      } else if (/^GOTO [0-9]+$/.test(line)) {
        // n GOTO m
        const regEx = /[0-9]+/g;
        newPointer = Number.parseInt(regEx.exec(line)[0]) - 1;
      } else if (/^IF R[0-9]+ = 0 GOTO [0-9]+$/.test(line)) {
        // n IF Ri = 0 GOTO m
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        regEx.exec(line)[0];
        const m = Number.parseInt(regEx.exec(line)[0]);

        if (f(registers[i]) == 0) {
          newPointer = m - 1;
        }
      } else if (/^IF R[0-9]+ > 0 GOTO [0-9]+$/.test(line)) {
        // n IF Ri > 0 GOTO m
        const regEx = /[0-9]+/g;
        const i = Number.parseInt(regEx.exec(line)[0]);
        regEx.exec(line)[0];
        const m = Number.parseInt(regEx.exec(line)[0]);

        if (f(registers[i]) > 0) {
          newPointer = m - 1;
        }
      } else if (/^STOP$/.test(line)) {
        // n STOP
        this.simulationState = 'finished';
        this.timeline.stages.push(new Stage(i, pointer, registers.slice()));
        return;
      } else {
        this.simulationState = 'failed';
        this.simulationErrors.push('Line ' + pointer + ' ' + line + ' does not match any command!');
        return;
      }

      this.timeline.stages.push(new Stage(i, pointer, registers.slice()));

      pointer = newPointer + 1;
      i++;
    }

    this.simulationState = 'failed';
    this.simulationErrors.push('Program exceeded 10000 executions (endless loop?)!');
  }
}
