import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { OpenFileComponent } from './open-file/open-file.component';
import { SimulatorService } from '../simulator.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  @ViewChild('a') a: ElementRef;

  deleted = false;

  constructor(
    private data: DataService,
    private modal: NgbModal,
    private s: SimulatorService
  ) { }

  download() {
    const json = this.data.toJson();

    const a = this.a.nativeElement;
    a.href = window.URL.createObjectURL(new Blob([JSON.stringify(json)], { type: 'text/json' }));
    a.download = 'turing.json';
    a.click();
  }

  openOpenFileModal() {
    this.modal.open(OpenFileComponent);
  }

  deleteAllOrUndo() {
    if (this.canUndo()) {
      this.deleted = false;
      this.data.changedForNavbar = false;
      location.reload();
    } else {
      this.download();
      this.deleted = true;
      this.data.changedForNavbar = false;
      this.s.fromEmpty();
    }
  }

  canUndo() {
    return this.deleted && !this.data.changedForNavbar;
  }
}
