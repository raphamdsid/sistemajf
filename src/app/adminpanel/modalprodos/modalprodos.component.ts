import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ModalosprodutosComponent } from 'src/app/ordemservicoext/modalosprodutos/modalosprodutos.component';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalprodos',
  templateUrl: './modalprodos.component.html',
  styleUrls: ['./modalprodos.component.scss']
})
export class ModalprodosComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  delProdosForm: any;
  editProdosForm: any;
  newProdosForm: any;
  operacao: number = 1;
  sloader: number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalosprodutosComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    operacao: any,
    id: any
    nome: any,
    valor: any,
    user: any
    // funcionario: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.onNoClick();
      }
    });
    this.delProdosForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
    this.newProdosForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      valor: new FormControl(0, Validators.required)
    });
    this.editProdosForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  setUpperCase(str: string) {
    return str.toUpperCase();
  }
  fixString() {
    let string = this.tools.trimStr(this.newProdosForm.controls["nome"].value);
    string = this.setUpperCase(string);
    this.newProdosForm.controls["nome"].setValue(string);
  }
  newProdos() {
    this.fixString();
    if (this.newProdosForm.valid && this.newProdosForm.controls["valor"].value > 0) {
      let auditobj = 'Produto de ordem de serviço';
      let auditoperacao = 'Criação';
      let nvalue = Number(this.newProdosForm.controls["valor"].value);
      let audittxt = "Cadastro do Produto de ordem de serviço: " + this.newProdosForm.controls["nome"].value + ", valor: " + formatCurrency(nvalue, 'pt-BR', 'R$');
      let obj = {
        nome: this.newProdosForm.controls["nome"].value,
        valor: this.newProdosForm.controls["valor"].value,
        user: this.data.user,
        auditobj: auditobj,
        auditoperacao: auditoperacao,
        audittxt: audittxt
      };
      let nome = this.newProdosForm.controls["nome"].value;
      let valor = this.newProdosForm.controls["valor"].value;
      let result = {
        obj: obj,
        valor: valor,
        nome: nome
      }
      this.dialogRef.close(result);
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  deleteProdos() {
    let auditobj = 'Produto de ordem de serviço';
    let auditoperacao = 'Exclusão';
    let audittxt = "Exclusão do Produto de ordem de serviço: " + this.data.nome;
    let obj = {
      id: this.data.id,
      user: this.data.user,
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt
    };
    let result = {
      obj: obj
    }
    this.dialogRef.close(result);
  }
}
