import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ModalComponent } from 'src/app/modal/modal.component';
import { ConsultaService } from 'src/app/services/consulta.service';

@Component({
  selector: 'app-delven',
  templateUrl: './delven.component.html',
  styleUrls: ['./delven.component.scss']
})
export class DelvenComponent implements OnInit {
  @Input() objeto: any
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  constructor(private renderer: Renderer2, private service: ConsultaService, private dialogRef: MatDialogRef<ModalComponent>, private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
  }
  ngOnInit(): void {
    console.log(this.objeto);
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.onNoClick();
      }
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  confirm(){
    this.dialogRef.close(true);
  }
  functionEsc() {
    alert('escape!');
  }
}
