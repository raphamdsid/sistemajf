import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalbanco',
  templateUrl: './modalbanco.component.html',
  styleUrls: ['./modalbanco.component.scss']
})
export class ModalbancoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  delBancoForm: any;
  editBancoForm: any;
  newBancoForm: any;
  operacao: number = 1;
  sloader: number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalbancoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    operacao: any,
    id: any
    nome: any,
    codigo: any,
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
    this.delBancoForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
    this.newBancoForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      codigo: new FormControl('', Validators.required)
    });
    this.editBancoForm = new FormGroup({
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
    let string = this.tools.trimStr(this.newBancoForm.controls["nome"].value);
    string = this.setUpperCase(string);
    this.newBancoForm.controls["nome"].setValue(string);
  }
  newBanco() {
    this.fixString();
    if (this.newBancoForm.valid) {
      let auditobj = 'Banco';
      let auditoperacao = 'Criação';
      let audittxt = "Cadastro de Banco: " + this.newBancoForm.controls["codigo"].value + " - " + this.newBancoForm.controls["nome"].value;
      let obj = {
        nome: this.newBancoForm.controls["nome"].value,
        codigo: this.newBancoForm.controls["codigo"].value,
        user: this.data.user,
        auditobj: auditobj,
        auditoperacao: auditoperacao,
        audittxt: audittxt
      };
      let nome = this.newBancoForm.controls["nome"].value;
      let codigo = this.newBancoForm.controls["codigo"].value;
      let result = {
        obj: obj,
        nome: nome,
        codigo: codigo
      }
      this.dialogRef.close(result);
    }
    else {
      alert("Preencha o nome e o código do banco");
    }
  }
  deleteBanco() {
    let auditobj = 'Banco';
    let auditoperacao = 'Exclusão';
    let audittxt = "Exclusão de Banco: " + this.data.nome;
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
