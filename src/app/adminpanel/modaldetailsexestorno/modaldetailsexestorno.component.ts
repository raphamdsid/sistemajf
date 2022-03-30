import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ModalprintrequerimentoComponent } from 'src/app/consulta/modalprintrequerimento/modalprintrequerimento.component';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modaldetailsexestorno',
  templateUrl: './modaldetailsexestorno.component.html',
  styleUrls: ['./modaldetailsexestorno.component.scss']
})
export class ModaldetailsexestornoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  pwdForm: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  sloader: number = 0;
  operacao: any = 1;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModaldetailsexestornoComponent>, public dialog: MatDialog, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    obj: any,
    // pwd: any
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
  returnPage(){
    this.pwdForm.controls["pwd"].setValue('');
    this.operacao = 1;
  }
  printRequerimento() {
    const dialogRefb = this.dialog.open(ModalprintrequerimentoComponent, {
      data: {
        obj: this.data.obj,
        tipo: 'especial'
      },
      panelClass: 'modalprintreq'
    });
  }
  cancelSolic() {
    this.operacao = 2;
    let id = this.data.obj.id;
    console.log(id);
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
