import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SimulatorService } from '../simulator.service';
import { State } from '../state';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent {
  constructor(
    private modal: NgbModal,
    private s: SimulatorService
  ) { }
}
