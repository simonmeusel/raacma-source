import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-open-file',
  templateUrl: './open-file.component.html',
  styleUrls: ['./open-file.component.css']
})
export class OpenFileComponent {
  constructor(
    private activeModal: NgbActiveModal,
    private data: DataService
  ) { }

  openFile(event) {
    const file = event.srcElement.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const json = JSON.parse(reader.result);
      this.data.fromJson(json);
      this.activeModal.close();
    };

    reader.readAsText(file);
  }
}
