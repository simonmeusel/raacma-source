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
    localStorage.setItem('alan-data', JSON.stringify(this.toJson()));
    this.changedForNavbar = true;
  }

  load() {
    const json = JSON.parse(localStorage.getItem('alan-data'));
    if (json) {
      this.fromJson(json);
    }
  }

  toJson() {
    return {
      simulator: this.s.toJson()
    }
  }

  fromJson(json) {
    this.s.fromJson(json.simulator);
    this.s.s();
  }
}
