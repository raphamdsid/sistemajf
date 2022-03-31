import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';

@Component({
  selector: 'app-modaldelproduto',
  templateUrl: './modaldelproduto.component.html',
  styleUrls: ['./modaldelproduto.component.scss']
})
export class ModaldelprodutoComponent implements OnInit {
  newProdForm: any;
  operacao: number = 1;
  constructor(private dialogRef: MatDialogRef<ModaldelprodutoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    produto: any,
    nome: any,
    valor: any,
    grupo: any,
    unidade: any,
    user: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.newProdForm = new FormGroup({
      produto: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      valor: new FormControl('', Validators.required),
      grupo: new FormControl('', Validators.required)
      //   pwd: new FormControl('', Validators.required)
    });
  }
  onNoClick() {
    this.dialogRef.close();
  }
  nextStep() {
    if (this.newProdForm.valid && this.newProdForm.controls["valor"].value > 0) {
      this.operacao = 2;
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  previousStep() {
    this.operacao = 1;
  }
  delProd() {
    let auditobj = 'Produto';
    let auditoperacao = 'Exclusão';
    let audittxt = "Exclusão do produto: " + this.data.nome + " - Valor: " + formatCurrency(this.data.valor, 'pt-BR', 'R$') + " - Código: " + this.data.produto + " - Grupo: " + this.data.grupo + "";
    let obj = {
      unidade: this.data.unidade,
      produto: this.data.produto,
      user: this.data.user,
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt
    };
    let produto = {
      produto: this.data.produto,
      nome: this.data.nome,
      valor: this.data.valor,
      grupo: this.data.grupo
    }
    let result = {
      obj: obj,
      produto: produto
    }
    this.dialogRef.close(result);
  }

}
