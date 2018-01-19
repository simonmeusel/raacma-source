import { Component } from '@angular/core';
import { SimulatorService } from '../simulator.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent {
  constructor(
    private s: SimulatorService
  ) { }
}
