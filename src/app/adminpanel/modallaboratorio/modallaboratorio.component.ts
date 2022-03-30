import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modallaboratorio',
  templateUrl: './modallaboratorio.component.html',
  styleUrls: ['./modallaboratorio.component.scss']
})
export class ModallaboratorioComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  delLabForm: any;
  editLabForm: any;
  newLabForm: any;
  operacao: number = 1;
  sloader: number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModallaboratorioComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    operacao: any,
    id: any
    nome: any,
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
    this.delLabForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
    this.newLabForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
    this.editLabForm = new FormGroup({
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
    let string = this.tools.trimStr(this.newLabForm.controls["nome"].value);
    string = this.setUpperCase(string);
    this.newLabForm.controls["nome"].setValue(string);
  }
  newLaboratorio() {
    this.fixString();
    if (this.newLabForm.valid) {
      let auditobj = 'Laboratório';
      let auditoperacao = 'Criação';
      let audittxt = "Cadastro do Laboratório: " + this.newLabForm.controls["nome"].value;
      let obj = {
        nome: this.newLabForm.controls["nome"].value,
        user: this.data.user,
        auditobj: auditobj,
        auditoperacao: auditoperacao,
        audittxt: audittxt
      };
      let nome = this.newLabForm.controls["nome"].value;
      let result = {
        obj: obj,
        nome: nome
      }
      this.dialogRef.close(result);
    }
    else {
      alert("Preencha o nome do laboratório");
    }
  }
  deleteLaboratorio() {
    let auditobj = 'Laboratório';
    let auditoperacao = 'Exclusão';
    let audittxt = "Exclusão do Laboratório: " + this.data.nome;
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
