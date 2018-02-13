import { Injectable } from '@angular/core';
import { SimulatorService } from './simulator.service';

@Injectable()
export class DataService {
  s: SimulatorService
  /**
   * Indication whether changed (for navbar's delete feature)
   */
  public changedForNavbar = false;
  /**
   * Contents of program editor
   */
  public text = 'ARGS 0\n\n0 STOP';

  constructor() {
    eval('window.app.data = this');
  }

  save() {
    localStorage.setItem('raacma-data', this.text);
    this.changedForNavbar = true;
  }

  load() {
    if (!localStorage.hasOwnProperty('raacma-data')) {
      return;
    }
    const text = localStorage.getItem('raacma-data');
    if (typeof text == 'string') {
      this.text = text;
    }
  }
}
