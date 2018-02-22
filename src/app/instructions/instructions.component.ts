import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Program } from '../program';
import { SimulatorService } from '../simulator.service';
import { DataService } from '../data.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent {
  @ViewChild('program') programRef: ElementRef;

  constructor(
    private modal: NgbModal,
    private s: SimulatorService,
    private data: DataService
  ) { }

  get ta() {
    return this.programRef.nativeElement;
  }

  onChange(event: KeyboardEvent) {
    let selectionStart = this.ta.selectionStart;
    let selectionEnd = this.ta.selectionEnd;

    if (event && event.keyCode == 13 && !event.shiftKey) {
      const charAtPosition = this.ta.value.charAt(selectionStart);

      if (charAtPosition == '' || charAtPosition == '\n') {
        this.ta.value = this.ta.value.substring(0, selectionStart) + '0 ' + this.ta.value.substring(selectionStart, this.ta.value.length);
        selectionStart += 2;
        selectionEnd += 2;
      }
    }

    this.fixLines(!!event);

    this.s.s();
    this.data.save();

    this.ta.selectionStart = selectionStart;
    this.ta.selectionEnd = selectionEnd;
  }

  fixLines(focused: boolean) {
    let instructions: string[] = [];
    let args: number[] = [];
    let lines: string[] = this.ta.value.split('\n');

    const regExp = /^[0-9]+( |$)/g;
    let lineNumber = 0;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      if (!focused) {
        line = line
          // Remove whitespace at beginning and end
          .trim()
          // Compress multiple whitespaces
          .replace(/  +/g, ' ')
          .replace(/([^ ]):=/, '$1 :=')
          .replace(/:=([^ ])/g, ':= $1')
          .replace(/([^ ])\+/g, '$1 +')
          .replace(/\+([^ ])/g, '+ $1')
          .replace(/([^ ])\-/g, '$1 -')
          .replace(/\-([^ ])/g, '- $1')
          .replace(/([^: ])=/g, '$1 =')
          .replace(/ =([^ ])/g, ' = $1');
      }
      line = line
        // Convert to uppercase
        .toUpperCase();

      if (regExp.test(line)) {
        instructions[lineNumber] = line.replace(regExp, '');
        line = line.replace(regExp, lineNumber + ' ')

        lineNumber++;
      } else if (line.startsWith('ARGS')) {
        let argStrings = line.split(' ');
        argStrings.shift();
        args = argStrings.map(arg => Number.parseInt(arg));
      }

      lines[i] = line;
    }

    this.ta.value = lines.join('\n');

    this.s.program = new Program(args, instructions);
  }
}
