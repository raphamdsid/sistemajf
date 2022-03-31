import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modaljf',
  templateUrl: './modaljf.component.html',
  styleUrls: ['./modaljf.component.scss']
})
export class ModaljfComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  vparcela: Number = 0;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  confirmForm: any;
  operacao: number = 1;
  sloader: number = 0;
  fentradas: any = [];
  totalentrada: any = 0;
  liberadoatd: any;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModaljfComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    text: any,
    paciente: any,
    fiador: any,
    cpfp: any,
    cpff: any,
    docvenda: any,
    valortotal: any,
    valortotaljf: any,
    financiador: any,
    isnotfiador: any,
    qtdparcelas: any,
    valparcela: any,
    fpagparcela: any,
    parcelamento: any,
    valorparcela: any,
    valoravaliacao: any,
    valorfinanciado: any,
    valortabela: any,
    valorcomercial: any,
    desconto: any,
    produtos: any,
    entradas: any,
    valentrada: any,
    warning: any
    funcionario: any,
    user: any,
    unidade: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.dialogRef.close();
      }
    });
    this.confirmForm = new FormGroup({
      check: new FormControl(false)
    });
    console.log(this.data);
    if (this.data.warning.code == 0) {
      this.liberadoatd = 'N';
    }
    if (this.data.warning.code == 1) {
      this.liberadoatd = 'S';
    }
    this.vparcela = Number(this.data.valparcela);
    console.log(this.data.produtos.length);
    console.log(this.data.entradas.length);
  }
  onNoClick() {
    this.dialogRef.close();

  }
  confirmVenda() {
    if (this.data.warning.code == 0 && this.confirmForm.controls["check"].value == false) {
      alert("Confirme que o paciente foi notificado sobre a impossibilidade de iniciar o tratamento");
    }
    else {
      let isfiadortxt;
      let hasparcelatxt;
      let isnotfiador;
      if (this.data.isnotfiador == 0) {
        isfiadortxt = " - CPF: " + this.data.cpfp + ", SEM FIADOR";
        isnotfiador = 0;
      }
      if (this.data.isnotfiador == 1) {
        isfiadortxt = " - CPF do Paciente: " + this.data.cpfp + " - Fiador: " + this.data.fiador + " - CPF do Fiador: " + this.data.cpfp;
        isnotfiador = 1;
      }
      let parcelamentotxt;
      if (this.data.parcelamento == "SJUROS") {
        parcelamentotxt = ' SEM JUROS';
      }
      if (this.data.parcelamento == "CJUROS") {
        parcelamentotxt = ' COM JUROS';
      }
      let fpagparctxt;
      if (this.data.fpagparcela == "BOLETO") {
        fpagparctxt = ' PAGO EM BOLETO';
      }
      if (this.data.fpagparcela == "CHEQUE") {
        fpagparctxt = ' PAGO EM CHEQUE';
      }

      if (this.data.qtdparcelas > 0) {
        hasparcelatxt = " - em " + this.data.qtdparcelas + "X de " + formatCurrency(this.data.valorparcela, 'pt-BR', 'R$') + "" + parcelamentotxt + "" + fpagparctxt
      }
      if (this.data.qtdparcelas == 0) {
        hasparcelatxt = " SEM PARCELAMENTO"
      }

      let descontotxt;
      if (this.data.desconto > 0) {
        descontotxt = " com desconto de " + this.data.desconto + "%";
      }
      if (this.data.desconto == 0) {
        descontotxt = "";
      }

      let auditoperacao = "Cadastro";
      let auditobj = "Venda";
      let audittxt = "Cadastro de venda, DOC ODC: " + this.data.docvenda + " do(a) cliente: " + this.tools.setUpperCase(this.data.paciente) + "" + isfiadortxt + "" + hasparcelatxt + " - Valor Avaliação: " + formatCurrency(this.data.valoravaliacao, 'pt-BR', 'R$') + " - Valor Tabelado: " + formatCurrency(this.data.valortotal, 'pt-BR', 'R$') + " - Valor Comercial: " + formatCurrency(this.data.valorcomercial, 'pt-BR', 'R$') + " - Valor Financiado: " + formatCurrency(this.data.valorfinanciado, 'pt-BR', 'R$') + "" + descontotxt;
      let result = {
        cliente: this.data.paciente,
        fiador: this.data.fiador,
        cpfpaciente: this.data.cpfp,
        cpffiador: this.data.cpff,
        docodc: this.data.docvenda,
        liberadoatd: this.liberadoatd,
        financiador: this.data.financiador,
        parcela: this.data.qtdparcelas,
        isnotfiador: isnotfiador,
        formapagparcela: this.data.fpagparcela,
        tipoparcelamento: this.data.parcelamento,
        valortabela: this.data.valortabela,
        valorparcela: this.data.valorparcela,
        valoravaliacao: this.data.valoravaliacao,
        valorfinanciado: this.data.valorfinanciado,
        valorcomercial: this.data.valorcomercial,
        valortotal: this.data.valortotal,
        valortotaljf: this.data.valortotaljf,
        valentrada: this.data.valentrada,
        desconto: this.data.desconto,
        funcionario: this.data.funcionario,
        produtos: this.data.produtos,
        entradas: this.data.entradas,
        countprodutos: this.data.produtos.length,
        countentradas: this.data.entradas.length,
        unidade: this.data.unidade,
        user: this.data.user,
        auditoperacao: auditoperacao,
        auditobj: auditobj,
        audittxt: audittxt
      }
      this.dialogRef.close(result);
    }
  }
}