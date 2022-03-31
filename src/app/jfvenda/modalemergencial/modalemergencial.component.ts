import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';

@Component({
  selector: 'app-modalemergencial',
  templateUrl: './modalemergencial.component.html',
  styleUrls: ['./modalemergencial.component.scss']
})
export class ModalemergencialComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  prodEmgForm: any;
  operacao: number = 1;
  sloader: number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private dialogRef: MatDialogRef<ModalemergencialComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    unidade: any,
    unidadetxt: any
    user: any
    // funcionario: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.dialogRef.close();
      }
    });
    this.prodEmgForm = new FormGroup({
      valor: new FormControl(0, Validators.required),
      descricao: new FormControl('', Validators.required)
      //   pwd: new FormControl('', Validators.required)
    });
    console.log(this.data.unidade);
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  setUpperCase(str: string) {
    return str.toUpperCase();
  }
  saveProd() {
    if (this.prodEmgForm.valid) {
      if (this.prodEmgForm.controls["valor"].value > 0) {
        let string = this.prodEmgForm.controls["descricao"].value;
        let text = this.setUpperCase(string);
        let obj = {
          grupo: 'EMG',
          nome: text,
          produto: 'EMG',
          valor: this.prodEmgForm.controls["valor"].value
        }
        let result = obj;
        this.globalListenFunc();
        this.dialogRef.close(result);
      }
      else {
        alert('Valor da venda não pode ser 0')
      }
    }
    else {
      alert('Preencha todos os campos');
    }
  }
}
