import { Component } from '@angular/core';
import { SimulatorService } from './simulator.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(
    private s: SimulatorService
  ) { }
}
