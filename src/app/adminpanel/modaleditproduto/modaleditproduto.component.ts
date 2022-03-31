import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modaleditproduto',
  templateUrl: './modaleditproduto.component.html',
  styleUrls: ['./modaleditproduto.component.scss']
})
export class ModaleditprodutoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.key = event.key;
  }
  newProdForm: any;
  operacao: number = 1;
  editobj: any;
  constructor(private dialogRef: MatDialogRef<ModaleditprodutoComponent>, private tools: ToolsService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    produto: any,
    nome: any,
    valor: any,
    grupo: any,
    unidade: any,
    user: any
    //unidadetxt: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.newProdForm = new FormGroup({
      produto: new FormControl(this.data.produto, Validators.required),
      nome: new FormControl(this.data.nome, Validators.required),
      valor: new FormControl(this.data.valor, Validators.required),
      grupo: new FormControl(this.data.grupo, Validators.required)
      //  pwd: new FormControl('', Validators.required)
    });
  }
  checkIfEqual(a: any, b: any) {
    if (a.produto == b.produto && a.nome == b.nome && a.valor == b.valor && a.grupo == b.grupo) {
      return false;
    }
    else {
      return true;
    }
  }

  onNoClick() {
    this.dialogRef.close();
  }
  sendData() {

  }
  saveProd() {
    let str = this.newProdForm.controls["nome"].value;
    str = str.trim();
    str = this.tools.setUpperCase(str);
    this.newProdForm.controls["nome"].setValue(str);
    let auditobj = 'Produto';
    let auditoperacao = 'Edição';
    let editnome;
    if (this.data.nome != this.newProdForm.controls["nome"].value) {
      editnome = " / Nome: " + this.data.nome + " → " + this.newProdForm.controls["nome"].value;
    }
    else {
      editnome = '';
    }
    let editvalor;
    if (this.data.valor != this.newProdForm.controls["valor"].value) {
      editvalor = " / Valor: " + formatCurrency(this.data.valor, 'pt-BR', 'R$') + " → " + formatCurrency(this.newProdForm.controls["valor"].value, 'pt-BR', 'R$');
    }
    else {
      editvalor = '';
    }
    let editgrupo;
    if (this.data.grupo != this.newProdForm.controls["grupo"].value) {
      editgrupo = " / Grupo: " + this.data.grupo + " → " + this.newProdForm.controls["grupo"].value;
    }
    else {
      editgrupo = '';
    }
    let audittxt = "Edição do produto " + this.data.nome + ":" + editnome + "" + editvalor + "" + editgrupo + "";
    let obj = {
      unidade: this.data.unidade,
      produto: this.newProdForm.controls["produto"].value,
      nome: this.newProdForm.controls["nome"].value,
      valor: this.newProdForm.controls["valor"].value,
      grupo: this.newProdForm.controls["grupo"].value,
      user: this.data.user,
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt
    };
    let produto = {
      produto: this.newProdForm.controls["produto"].value,
      nome: this.newProdForm.controls["nome"].value,
      valor: this.newProdForm.controls["valor"].value,
      grupo: this.newProdForm.controls["grupo"].value
    }
    let result = {
      obj: obj,
      produto: produto
    }
    this.dialogRef.close(result);
  }
  nextStep() {
    let str = this.newProdForm.controls["nome"].value;
    str = this.tools.setUpperCase(str);
    str = str.trim();
    this.newProdForm.controls["nome"].setValue(str);
    let object = {
      produto: this.newProdForm.controls["produto"].value,
      nome: this.newProdForm.controls["nome"].value,
      valor: this.newProdForm.controls["valor"].value,
      grupo: this.newProdForm.controls["grupo"].value
    }
    if (this.newProdForm.valid && this.newProdForm.controls["valor"].value > 0) {
      if (this.checkIfEqual(this.data, object)) {
        this.operacao = 2;
        let editobj = {
          produto: this.newProdForm.controls["produto"].value,
          nome: this.newProdForm.controls["nome"].value,
          valor: this.newProdForm.controls["valor"].value,
          grupo: this.newProdForm.controls["grupo"].value
        }
        this.editobj = editobj;
      }
      else {
        alert("Faça alguma alteração para prosseguir")
      }
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  previousStep() {
    this.operacao = 1;
  }
}
