import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalconfirmwaitestornoex',
  templateUrl: './modalconfirmwaitestornoex.component.html',
  styleUrls: ['./modalconfirmwaitestornoex.component.scss']
})
export class ModalconfirmwaitestornoexComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  pwdForm: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  sloader: number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalconfirmwaitestornoexComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    obj: any,
    pwd: any
    // funcionario: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    console.log(this.data);
    this.pwdForm = new FormGroup({
      pwd: new FormControl('', Validators.required)
    });
this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.onNoClick();
      }
    });
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  sendData() {
    if (this.pwdForm.valid == true) {
      let result = {
        obj: this.data.obj,
        pwd: this.pwdForm.controls["pwd"].value,
      }
      this.globalListenFunc();
      this.dialogRef.close(result);
    }
    else {
      alert("Insira a sua senha para confirmar");
    }
  }
}
