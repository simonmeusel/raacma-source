import { Injectable } from '@angular/core';
import { SimulatorService } from './simulator.service';

@Injectable()
export class DataService {
  s: SimulatorService
  /**
   * Currenty running timeout for save
   */
  timeout;
  /**
   * Indication whether changed (for navbar's delete feature)
   */
  changedForNavbar = false;

  constructor() {
    eval('window.app.data = this');
  }

  /**
   * Preapare for save
   */
  p() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(this.save.bind(this), 500);
  }

  save() {
    this.timeout = null;
    localStorage.setItem('raacma-data', this.toText());
    this.changedForNavbar = true;
  }

  load() {
    const text = localStorage.getItem('raacma-data');
    if (text) {
      this.fromText(text);
    }
  }

  toText(): string {
    return '';
  }

  fromText(text) {

  }
}
