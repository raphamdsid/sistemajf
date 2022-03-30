import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalentradaconf',
  templateUrl: './modalentrada.component.html',
  styleUrls: ['./modalentrada.component.scss']
})
export class ModalentradaconfComponent implements OnInit {
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
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalentradaconfComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
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
    this.delEntForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
    this.newEntForm = new FormGroup({
      nome: new FormControl('', Validators.required)
    });
    this.editEntForm = new FormGroup({
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
    let string = this.tools.trimStr(this.newEntForm.controls["nome"].value);
    string = this.setUpperCase(string);
    this.newEntForm.controls["nome"].setValue(string);
  }
  newEntrada() {
    this.fixString();
    if (this.newEntForm.valid) {
      let auditobj = 'Entrada';
      let auditoperacao = 'Criação';
      let audittxt = "Cadastro de Entrada: " + this.newEntForm.controls["nome"].value;
      let obj = {
        nome: this.newEntForm.controls["nome"].value,
        user: this.data.user,
        auditobj: auditobj,
        auditoperacao: auditoperacao,
        audittxt: audittxt
      };
      let nome = this.newEntForm.controls["nome"].value;
      let result = {
        obj: obj,
        nome: nome
      }
      this.dialogRef.close(result);
    }
    else {
      alert("Preencha o nome da forma de entrada");
    }
  }
  deleteEntrada() {
    let auditobj = 'Entrada';
    let auditoperacao = 'Exclusão';
    let audittxt = "Exclusão de Entrada: " + this.data.nome;
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
