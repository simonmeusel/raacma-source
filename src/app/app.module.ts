import { BrowserModule } from '@angular/platform-browser';
import { ContenteditableDirective } from 'ng-contenteditable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { DataService } from './data.service';
import { SimulatorService } from './simulator.service';


import { AppComponent } from './app.component';
import { ControlsComponent } from './controls/controls.component';
import { InstructionsComponent } from './instructions/instructions.component';
import { OpenFileComponent } from './navbar/open-file/open-file.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TableComponent } from './table/table.component';


eval('window.app = {}');

@NgModule({
  declarations: [
    AppComponent,
    ContenteditableDirective,
    ControlsComponent,
    InstructionsComponent,
    NavbarComponent,
    OpenFileComponent,
    TableComponent
  ],
  entryComponents: [
    OpenFileComponent
  ],
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [
    DataService,
    SimulatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
