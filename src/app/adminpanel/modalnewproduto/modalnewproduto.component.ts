import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalnewproduto',
  templateUrl: './modalnewproduto.component.html',
  styleUrls: ['./modalnewproduto.component.scss']
})
export class ModalnewprodutoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.key = event.key;
  }
  newProdForm: any;
  operacao: number = 1;
  sloader: number = 0;
  constructor(private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalnewprodutoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    unidade: any,
    unidadetxt: any
    user: any
    // funcionario: any
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
    console.log(this.data.unidade);
  }
  onNoClick() {
    this.dialogRef.close();
  }
  fixProdutoStr() {
    let str = this.newProdForm.controls["produto"].value;
    str = Number(str).toString();
    str = this.tools.setUpperCase(str);
    if (str > 0) {
      let txt: string = String(str).padStart(3, '0'); // '009'
      this.newProdForm.controls["produto"].setValue("" + txt + "");
      console.log(this.newProdForm.controls["produto"].value);
    }
    else {
      this.newProdForm.controls["produto"].setValue('');
    }
  }
  nextStep() {
    console.log(this.newProdForm);
    if (this.newProdForm.valid && this.newProdForm.controls["valor"].value > 0) {
      this.sloader = 1;
      // let produto = String(n).padStart(4, '0'); // '0009'
      let obj = {
        unidade: this.data.unidade,
        produto: this.newProdForm.controls["produto"].value
      };
      obj = JSON.parse(JSON.stringify(obj));
      this.service.getProduto(obj).subscribe(p => {
        console.log(p);
        if (p.length > 0) {
          this.sloader = 0;
          alert("Código do produto já cadastrado no sistema");
        }
        if (p.length == 0) {
          this.sloader = 0;
          this.operacao = 2;
        }
      },
        (error) => {
          console.log(error);
          this.sloader = 0;
          alert("Erro de conexão ao banco de dados");
        });
    }
    else {
      alert("Preencha todos os campos");
    }
    // console.log(this.newProdForm);
  }
  previousStep() {
    this.operacao = 1;
  }
  saveProd() {
    let str = this.newProdForm.controls["nome"].value;
    str = str.trim();
    str = this.tools.setUpperCase(str);
    this.newProdForm.controls["nome"].setValue(str);
    let auditobj = 'Produto';
    let auditoperacao = 'Criação';
    let audittxt = "Cadastro do produto: " + this.newProdForm.controls["nome"].value + " - Valor: " + formatCurrency(this.newProdForm.controls["valor"].value, 'pt-BR', 'R$') + " - Código: " + this.newProdForm.controls["produto"].value + " - Grupo: " + this.newProdForm.controls["grupo"].value + "";
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

}
