import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalfpag',
  templateUrl: './modalfpag.component.html',
  styleUrls: ['./modalfpag.component.scss']
})
export class ModalfpagComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  delEntForm: any;
  editEntForm: any;
  newEntForm: any;
  operacao: number = 1;
  sloader: number = 0;
  fentradas: any = [];
  totalentrada: any = 0;
  totalentradajf: any = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalfpagComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    entradas: any,
    financiadores: any,
    fentradas: any,
    totalentrada: any,
    valorcomercial: any
    // funcionario: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.onNoClick();
      }
    });
    this.newEntForm = new FormGroup({
      tipo: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
      doc: new FormControl('')
    });
    this.fentradas = this.data.fentradas;
    this.totalentrada = this.data.totalentrada;
    console.log(this.data);
  }
  calcTotal() {
    let total = 0;
    let entradajf = 0
    if (this.fentradas.length > 0) {
      for (let x = 0; x < this.fentradas.length; x++) {
        total = total + this.fentradas[x].valor;
        if (this.fentradas[x].tipo == 'naofinanciado') {
          entradajf = entradajf + this.fentradas[x].valor;
        }
      }
      this.totalentrada = total;
      this.totalentradajf = entradajf;
    }
    else {
      this.totalentrada = 0;
      this.fentradas = [];
    }

  }
  calcTotalTemp(array: any) {
    let totalentrada = 0;

    for (let x = 0; x < array.length; x++) {
      totalentrada = totalentrada + array[x].valor;
    }

    return totalentrada;
  }
  onNoClick() {
    let result = {
      entradas: this.fentradas,
      totalentradajf: this.totalentradajf,
      totalentrada: this.totalentrada
    }
    this.globalListenFunc();
    this.dialogRef.close(result);
  }
  setUpperCase(str: string) {
    return str.toUpperCase();
  }
  fixString() {
    let string = this.tools.trimStr(this.newEntForm.controls["nome"].value);
    string = this.setUpperCase(string);
    this.newEntForm.controls["nome"].setValue(string);
  }
  fixDocString() {
    let string = this.tools.trimStr(this.newEntForm.controls["doc"].value);
    string = this.setUpperCase(string);
    this.newEntForm.controls["doc"].setValue(string);
  }
  newEntrada() {
    this.newEntForm.controls["doc"].setValue(this.newEntForm.controls["doc"].value.trim());
    if (this.newEntForm.controls["nome"].valid && this.newEntForm.controls["valor"].value > 0) {
      if (this.newEntForm.controls["tipo"].value == 'financiado') {
        if (this.newEntForm.controls["doc"].value.length == 0) {
          alert("Prencha todos os campos");
        }
        else {
          this.fixString();
          let obj = {
            tipo: this.newEntForm.controls["tipo"].value,
            nome: this.newEntForm.controls["nome"].value,
            valor: this.newEntForm.controls["valor"].value,
            cododc: this.newEntForm.controls["doc"].value
          }
          let vala = this.totalentrada + obj.valor;
          let valb = this.data.valorcomercial
          if (vala <= valb) {
            this.fentradas.push(obj);
            this.calcTotal();
            this.newEntForm.reset();
            this.newEntForm.controls["valor"].setValue(0);
            this.newEntForm.controls["doc"].setValue('');
          }
          else {
            alert("Valor da entrada ultrapassou o valor comercial")
          }
        }
      }
      if (this.newEntForm.controls["tipo"].value == 'naofinanciado') {
        if (this.newEntForm.controls["nome"].value == 'CRÉDITO NA CLÍNICA' && this.newEntForm.controls["doc"].value.length == 0) {
          alert("Prencha todos os campos");
        }
        else {
          this.fixString();
          let obj = {
            tipo: this.newEntForm.controls["tipo"].value,
            nome: this.newEntForm.controls["nome"].value,
            valor: this.newEntForm.controls["valor"].value,
            cododc: this.newEntForm.controls["doc"].value
          }
          if (obj.nome != 'CRÉDITO NA CLÍNICA') {
            obj.cododc = null;
          }

          let vala = this.totalentrada + obj.valor;
          let valb = this.data.valorcomercial

          if (vala <= valb) {
            this.fentradas.push(obj);
            this.calcTotal();
            this.newEntForm.reset();
            this.newEntForm.controls["valor"].setValue(0);
            this.newEntForm.controls["doc"].setValue('');
          }
          else {
            alert("Valor da entrada ultrapassou o valor comercial")
          }
        }
      }
    }
    else {
      alert("Preencha todos os campos")
    }
    console.log(this.fentradas);
  }
  deleteEntrada(index: any) {
    this.fentradas.splice(index, 1);
    this.calcTotal();
  }
  resetForm() {
    this.newEntForm.controls["nome"].setValue('');
    this.newEntForm.controls["valor"].setValue(0);
    this.newEntForm.controls["doc"].setValue('');
  }
}
