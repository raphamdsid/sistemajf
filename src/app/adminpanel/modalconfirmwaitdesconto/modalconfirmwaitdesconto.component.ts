import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalconfirmwaitdesconto',
  templateUrl: './modalconfirmwaitdesconto.component.html',
  styleUrls: ['./modalconfirmwaitdesconto.component.scss']
})
export class ModalconfirmwaitdescontoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  confirmEstornoForm: any;
  pwdForm: any;
  valor: any;
  operacao: Number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalconfirmwaitdescontoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    venda: any,
    id: any,
    user: any,
    username: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.onNoClick();
      }
    });
    this.pwdForm = new FormGroup({
      pwd: new FormControl('', Validators.required)
    });
    this.confirmEstornoForm = new FormGroup({
      valor: new FormControl(this.data.venda.waitestornovalor, Validators.required)
    });
    console.log(this.data);
    this.valor = this.data.venda.waitestornovalor;

  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  modalSubmit() {
    // //  console.log(this.confirmEstornoForm.valid);
    if (this.confirmEstornoForm.valid && this.confirmEstornoForm.controls["valor"].value > 0) {
      if (this.confirmEstornoForm.controls["valor"].value > this.data.venda.valortotal) {
        alert("Valor solicitado é maior que o valor total da venda")
      }
      else {
        let auditobj = "Venda";
        let auditoperacao = "Solicitação de estorno";
        let audittxt = "Solicitação de estorno da venda - DOC ODC: " + this.data.venda.docodc + " - Cliente: " + this.data.venda.cliente + ". Valor do estorno: " + formatCurrency(this.confirmEstornoForm.controls["valor"].value, 'pt-BR', 'R$');
        let result = {
          id: this.data.id,
          waitestornouser: this.data.user,
          waitestorno: 1,
          waitestornovalor: this.confirmEstornoForm.controls["valor"].value,
          waitestornotxt: this.confirmEstornoForm.controls["txt"].value,
          waitestornodate: "CURRENT_TIMESTAMP",
          auditobj: auditobj,
          auditoperacao: auditoperacao,
          audittxt: audittxt,
          user: this.data.user
        }
        this.dialogRef.close(result);

      }
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  fixValue() {
    if (this.confirmEstornoForm.controls["valor"].value > this.data.venda.waitestornovalor) {
      this.confirmEstornoForm.controls["valor"].setValue(this.data.venda.waitestornovalor);
    }
  }
  cancelSolic() {
    let auditobj = "Venda";
    let auditoperacao = "Cancel. solicitação de estorno";
    let audittxt = "Cancelamento de solicitação de estorno da venda - DOC ODC: " + this.data.venda.docodc + " - Cliente: " + this.data.venda.cliente + ". Valor da solicitação: " + formatCurrency(this.data.venda.waitestornovalor, 'pt-BR', 'R$') + " - Solicitante: " + this.data.venda.waitestornouser;
    let result = {
      id: this.data.id,
      waitestornouser: '',
      waitestorno: 0,
      waitestornovalor: 0,
      waitestornotxt: '',
      waitestornodate: "null",
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt,
      user: this.data.user
    }
    this.dialogRef.close(result)
  }
  confirmEstorno() {

    console.log('Form:');
    console.log(Number(this.confirmEstornoForm.controls["valor"].value));
    console.log('Valor atual:');
    console.log(Number(this.data.venda.valoratual));
    console.log('Valor solicitado:');
    console.log(Number(this.data.venda.waitestornovalor));
    
    if (this.confirmEstornoForm.valid && this.confirmEstornoForm.controls["valor"].value > 0) {
      if (Number(this.confirmEstornoForm.controls["valor"].value) > Number(this.data.venda.waitestornovalor)) {
        alert("Valor solicitado é maior que o valor total solicitado")
      }
      else {
        this.valor = Number(this.confirmEstornoForm.controls["valor"].value);
        if (Number(this.valor) < Number(this.data.venda.waitestornovalor)) {
          this.pwdForm.addControl("motivo", new FormControl('', Validators.required));
        }
        this.operacao = 1;
      }
    }
    else {
      alert("Digite o valor do estorno");
    }
  }

  rejectEstorno() {
    this.pwdForm.addControl("motivo", new FormControl('', Validators.required));
    this.operacao = 2;
  }

  returnPage() {
    this.valor = 0;
    this.operacao = 0;
    this.pwdForm.controls["pwd"].setValue('');
    if (this.pwdForm.controls["motivo"]) {
      console.log(this.pwdForm.controls["motivo"])
      this.pwdForm.removeControl("motivo");
    }
  }

  sendDataConfirm() {
    if (this.pwdForm.valid == true) {
      let response = 'aceito';
      let pwd = this.pwdForm.controls["pwd"].value;
      let gerente = this.data.venda.waitestornouser;
      let unidade = this.data.venda.unidade;
      let valorcompra = Number(this.data.venda.valortotal);
      let valorsolicitado = Number(this.data.venda.waitestornovalor);
      let valorestorno = Number(this.valor);
      let docodc = this.data.venda.docodc;
      let situacao;
      if (valorestorno == valorsolicitado) {
        situacao = 'Estorno total';
      }
      if (valorestorno < valorsolicitado && valorestorno > 0) {
        situacao = 'Estorno parcial';
      }
      let motivo = ''
      if (this.pwdForm.controls["motivo"]) {
        motivo = this.pwdForm.controls["motivo"].value;
      }
      let solicitante = this.data.venda.fiador;
      let cpfcnpj = this.data.venda.cpffiador;
      let responsavel = this.data.user;
      let id = this.data.venda.id;

      let valoratual = Number(this.data.venda.valoratual);
      let valorestornovenda = Number(this.data.venda.valorestorno);
      let newvaloratual = valoratual - valorestorno;
      let newvalorestorno = valorestorno + valorestornovenda;
      let vendastats;
      if (newvaloratual < valorcompra && newvaloratual > 0) {
        vendastats = "estorno parcial";
      }
      if (newvaloratual <= 0) {
        vendastats = "estorno";
        newvaloratual = 0;
      }

      let iscpfcnpj;
      if (cpfcnpj.length == 11) {
        iscpfcnpj = 'CPF';
      }
      if (cpfcnpj.length == 14) {
        iscpfcnpj = 'CNPJ';
      }
      let motivotxt = ''
      if (motivo.length > 0) {
        motivotxt = ". Motivo: " + motivo;
      }
      let audittxt = "Estorno de valor relativo à solicitação realizada pelo(a) solicitante " + solicitante + " - " + iscpfcnpj + ": " + cpfcnpj + " - DOC ODC: " + docodc + ". Valor solicitado: " + formatCurrency(valorsolicitado, 'pt-BR', 'R$') + " - Valor estornado: " + formatCurrency(valorestorno, 'pt-BR', 'R$') + motivotxt;
      let auditobj = "Estorno";
      let auditoperacao = "Estorno de valor";
      let user = this.data.username;
      let financiador = this.data.venda.financiador;
      let obj = {
        id: id,
        gerente: gerente,
        unidade: unidade,
        financiador: financiador,
        valorcompra: valorcompra,
        valorsolicitado: valorsolicitado,
        valorestorno: valorestorno,
        docodc: docodc,
        situacao: situacao,
        motivo: motivo,
        solicitante: solicitante,
        cpfcnpj: cpfcnpj,
        responsavel: responsavel,
        newvaloratual: newvaloratual,
        newvalorestorno: newvalorestorno,
        vendastats: vendastats,
        audittxt: audittxt,
        auditoperacao: auditoperacao,
        auditobj: auditobj,
        user: user
      }
      // console.log(obj);
      let result = {
        obj: obj,
        pwd: pwd,
        response: response
      }
      this.dialogRef.close(result);
    }
    else {
      if (this.pwdForm.controls["motivo"]) {
        alert("Preencha o motivo e digite sua senha para confirmar");
      }
      else {
        alert("Digite sua senha para confirmar");
      }
    }
  }
  sendDataReject() {
    if (this.pwdForm.valid == true) {
      let response = 'rejeitado';
      let pwd = this.pwdForm.controls["pwd"].value;
      let gerente = this.data.venda.waitestornouser;
      let unidade = this.data.venda.unidade;
      let valorcompra = Number(this.data.venda.valortotal);
      let valorsolicitado = Number(this.data.venda.waitestornovalor);
      let valorestorno = Number(0);
      let docodc = this.data.venda.docodc;
      let situacao = 'Rejeitado'
      let motivo = this.pwdForm.controls["motivo"].value;
      let solicitante = this.data.venda.fiador;
      let cpfcnpj = this.data.venda.cpffiador;
      let responsavel = this.data.user;
      let id = this.data.venda.id;
      let iscpfcnpj;
      if (cpfcnpj.length == 11) {
        iscpfcnpj = 'CPF';
      }
      if (cpfcnpj.length == 14) {
        iscpfcnpj = 'CNPJ';
      }
      let motivotxt = "Motivo: " + motivo;
      let audittxt = "Rejeição à solicitação de estorno realizada pelo(a) solicitante " + solicitante + " - " + iscpfcnpj + ": " + cpfcnpj + " - DOC ODC: " + docodc + ". Valor solicitado: " + formatCurrency(valorsolicitado, 'pt-BR', 'R$') + ". Motivo: " + motivo;
      let auditobj = "Estorno";
      let auditoperacao = "Rejeição de solicitação";
      let user = this.data.username;

      let obj = {
        id: id,
        gerente: gerente,
        unidade: unidade,
        valorcompra: valorcompra,
        valorsolicitado: valorsolicitado,
        valorestorno: valorestorno,
        docodc: docodc,
        situacao: situacao,
        motivo: motivo,
        solicitante: solicitante,
        cpfcnpj: cpfcnpj,
        responsavel: responsavel,
        audittxt: audittxt,
        auditoperacao: auditoperacao,
        auditobj: auditobj,
        user: user
      }
      // console.log(obj);
      let result = {
        obj: obj,
        pwd: pwd,
        response: response
      }
      this.dialogRef.close(result);
    }
    else {
      alert("Preencha o motivo e digite sua senha para confirmar");
    }
  }
}