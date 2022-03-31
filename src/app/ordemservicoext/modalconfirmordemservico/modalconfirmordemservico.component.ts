import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalconfirmordemservico',
  templateUrl: './modalconfirmordemservico.component.html',
  styleUrls: ['./modalconfirmordemservico.component.scss']
})
export class ModalconfirmordemservicoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  vparcela: Number = 0;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalconfirmordemservicoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    ordem: any;
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.dialogRef.close();
      }
    });
    console.log(this.data);
  }
  sendData() {
    let aud = this.data.ordem;
    let auditobj = "Ordem de Serviço de Prótese Externa";
    let auditoperacao = "Cadastro";
    let audittxt = "Cadastro de Ordem de Serviço de Prótese externa do paciente " + aud.paciente + " - CPF: " + aud.cpf + " no laboratório " + aud.laboratorio + ". Documento ODC nº: " + aud.documento + " - Valor contratado: " + formatCurrency(Number(aud.valor_contratado), 'pt-BR', 'R$') + " - Custo dos materiais: " + formatCurrency(Number(aud.valor_contratado), 'pt-BR', 'R$');

    let obj = {
      documento: this.data.ordem.documento,
      paciente: this.data.ordem.paciente,
      cpf: this.data.ordem.cpf,
      valor_contratado: this.data.ordem.valor_contratado,
      custo_materiais: this.data.ordem.custo_materiais,
      laboratorio: this.data.ordem.laboratorio,
      produtos: this.data.ordem.produtos,
      unidade: this.data.ordem.unidade,
      user: this.data.ordem.user,
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt
    }
    let result = obj;

    this.dialogRef.close(result);
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
}