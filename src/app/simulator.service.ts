import { Injectable } from '@angular/core';

import { Timeline } from './timeline';
import { Stage } from './stage';
import { Tape } from './tape';
import { State } from './state';
import { DataService } from './data.service';

export type SimulatorState = 'running' | 'finished' | 'failed';

@Injectable()
export class SimulatorService {
  /**
   * Position in timeline
   */
  private timeValue: number = 0;
  /**
   * Timeline of last simulation
   */
  timeline: Timeline = new Timeline();
  /**
   * Timeline of a currently running simulation
   */
  runningTimeline: Timeline;
  /**
   * Symbol used when tape has to get enlarged
   */
  blankSymbol = '*';
  /**
   * All symbols in order in which they appear in the table
   */
  private symbolsValue = '*|';
  private symbolsArrayValue = ['*'];
  /**
   * All states part of the instructions
   */
  states: State[] = [];
  /**
   * Currenty running timeout for simulation
   */
  timeout;
  /**
   * End state
   */
  endState: State;
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
    this.states = [];

    this.endState = new State(this);
    this.endState.name = 'end';

    const state = new State(this);
    state.name = 'start';
    this.states.push(state);

    let tape = new Tape(this);
    tape.value = '**||||**';
    tape.headPosition = 2;

    let stage = new Stage(this);
    stage.tape = tape;
    stage.state = state;
    this.timeline.stages[0] = stage;

    this.fixSymbols();
  }

  get duration() {
    return this.timeline.stages.length;
  }

  set time(time) {
    this.timeValue = Math.max(0, Math.min(time, this.duration - 1));
  }

  get time() {
    return this.timeValue;
  }

  set symbols(symbols) {
    this.symbolsValue = symbols;
    this.symbolsArrayValue = symbols.split('');
    this.fixSymbols();
  }

  get symbols() {
    return this.symbolsValue;
  }

  get symbolsArray() {
    return this.symbolsArrayValue;
  }
  /**
   * Add missing symbols from tape to symbol list
   *
   * Also removes duplicate symbols
   */
  fixSymbols() {
    let newSymbols = '';

    const mapping = {};

    for (var i = 0; i < this.symbols.length; i++) {
      if (!(this.symbols[i] in mapping)) {
        newSymbols += this.symbols[i];
        mapping[this.symbols[i]] = true;
      }
    }

    const symbolsInTape = this.timeline.stages[0].tape.value.split('');
    for (const symbol of symbolsInTape) {
      if (!newSymbols.includes(symbol)) {
        newSymbols += symbol;
      }
    }

    this.symbolsValue = newSymbols;
    this.symbolsArrayValue = newSymbols.split('');
  }
  /**
   * Gets state with a given name from state list
   * @param name Name of state
   * @returns State with the given name
   */
  getState(name): State | void {
    for (const state of this.states) {
      if (state.name == name) {
        return state;
      }
    }
  }
  /**
   * Checks if a state with the given name is available
   * @param name Name of state
   * @returns Whether state exists
   */
  hasState(name): boolean {
    return this.states.filter((s) => s.name == name).length > 0;
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

    this.runningTimeline = new Timeline();
    this.runningTimeline.stages.push(this.timeline.stages[0]);
    this.runningTimeline.stages[0].state = this.states[0];

    while (true) {
      const stages = this.runningTimeline.stages;
      const l = stages[stages.length - 1];

      const n = new Stage(this);
      n.tape.headPosition = l.tape.headPosition;
      n.tape.value = l.tape.value;
      n.time = l.time + 1;

      const instructions = l.state.instructions;

      const symbolAtHead = n.tape.read();
      const instruction = instructions[symbolAtHead];

      if (!instruction) {
        this.simulationState = 'failed';
        this.simulationErrors.push('Instruction for symbol ' + symbolAtHead + ' not found in state ' + l.state.name + '!');
        return;
      }

      n.tape.write(instruction.newSymbol);

      if (instruction.targetStateName == 'end' || this.runningTimeline.stages.length > 100000) {
        console.info('Successful simulation!');
        n.state = this.endState;
        stages.push(n);
        this.timeline = this.runningTimeline;
        this.runningTimeline = null;
        // Make sure that the time isn't out of the timeline
        this.time = this.time;
        this.simulationState = 'finished';
        return;
      }

      const newState = this.getState(instruction.targetStateName);
      if (newState) {
        n.state = newState;
      } else {
        this.simulationState = 'failed';
        this.simulationErrors.push('Invalid state name at instruction for symbol ' + symbolAtHead + ' of state ' + l.state.name + '!');
        return;
      }

      n.tape.move(instruction.move);

      stages.push(n);
    }
  }

  toJson() {
    return {
      blankSymbol: this.blankSymbol,
      symbols: this.symbols,
      states: this.states.map((s) => s.toJson()),
      tape: this.timeline.stages[0].tape.toJson()
    }
  }

  fromJson(json) {
    this.blankSymbol = json.blankSymbol;
    this.symbols = json.symbols;
    this.states = json.states.map((s) => {
      const state = new State(this);
      state.fromJson(s);
      return state;
    });

    const tape = new Tape(this);
    tape.fromJson(json.tape)

    const stage = new Stage(this);
    stage.tape = tape;
    stage.time = 0;
    stage.state = this.states[0];

    const timeline = new Timeline();
    timeline.stages[0] = stage;
    this.timeline = timeline;
  }
}
