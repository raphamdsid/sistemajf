import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalconfirmwaitestornoespecial',
  templateUrl: './modalconfirmwaitestornoespecial.component.html',
  styleUrls: ['./modalconfirmwaitestornoespecial.component.scss']
})
export class ModalconfirmwaitestornoespecialComponent implements OnInit {
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
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalconfirmwaitestornoespecialComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    obj: any,
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
      valor: new FormControl(this.data.obj.valorestorno, Validators.required)
    });
    console.log(this.data);
    this.valor = this.data.obj.valorestorno;

  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  modalSubmit() {
    // //  console.log(this.confirmEstornoForm.valid);
    if (this.confirmEstornoForm.valid && this.confirmEstornoForm.controls["valor"].value > 0) {
      if (this.confirmEstornoForm.controls["valor"].value > this.data.obj.valortotal) {
        alert("Valor solicitado é maior que o valor total da obj")
      }
      else {
        let auditobj = "Estorno Especial";
        let auditoperacao = '';
        let audittxt = '';
        let result = {
          id: this.data.id,
          waitestornouser: this.data.user,
          waitestorno: 1,
          valorestorno: this.confirmEstornoForm.controls["valor"].value,
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
    if (this.confirmEstornoForm.controls["valor"].value > this.data.obj.valorestorno) {
      this.confirmEstornoForm.controls["valor"].setValue(this.data.obj.valorestorno);
    }
  }
  cancelSolic() {
    let auditobj = "obj";
    let auditoperacao = "Cancel. solicitação de estorno";
    let audittxt = "Cancelamento de solicitação de estorno da obj - DOC ODC: " + this.data.obj.docodc + " - Cliente: " + this.data.obj.cliente + ". Valor da solicitação: " + formatCurrency(this.data.obj.valorestorno, 'pt-BR', 'R$') + " - Solicitante: " + this.data.obj.waitestornouser;
    let result = {
      id: this.data.id,
      waitestornouser: '',
      waitestorno: 0,
      valorestorno: 0,
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
    console.log(Number(this.data.obj.valoratual));
    console.log('Valor solicitado:');
    console.log(Number(this.data.obj.valorestorno));

    if (this.confirmEstornoForm.valid && Number(this.confirmEstornoForm.controls["valor"].value) > 0) {
      if (Number(this.confirmEstornoForm.controls["valor"].value) > Number(this.data.obj.valorestorno)) {
        alert("Valor solicitado é maior que o valor total solicitado")
      }
      else {
        this.valor = Number(this.confirmEstornoForm.controls["valor"].value);
        if (Number(this.valor) < Number(this.data.obj.valorestorno)) {
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
      let pwd = this.pwdForm.controls["pwd"].value;
      let gerente = this.data.obj.createdby;
      let unidade = this.data.obj.unidade;
      let valorcompra = Number(this.data.obj.valorcompra);
      let valorsolicitado = Number(this.data.obj.valorestorno);
      let valorestorno = Number(this.valor);
      let docodc = this.data.obj.docodc;
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
      let solicitante = this.data.obj.nome;
      let cpfcnpj = this.data.obj.cpfcnpj;
      let responsavel = this.data.user;
      let id = this.data.obj.id;

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
      let obj = {
        id: id,
        gerente: gerente,
        unidade: unidade,
        financiador: null,
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
        pwd: pwd
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
      let pwd = this.pwdForm.controls["pwd"].value;
      let gerente = this.data.obj.createdby;
      let unidade = this.data.obj.unidade;
      let valorcompra = Number(this.data.obj.valorcompra);
      let valorsolicitado = Number(this.data.obj.valorestorno);
      let valorestorno = Number(0);
      let docodc = this.data.obj.docodc;
      let situacao = 'Rejeitado'
      let motivo = this.pwdForm.controls["motivo"].value;
      let solicitante = this.data.obj.nome;
      let cpfcnpj = this.data.obj.cpfcnpj;
      let responsavel = this.data.user;
      let id = this.data.obj.id;
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
      let result = {
        obj: obj,
        pwd: pwd
      }
      this.dialogRef.close(result);
    }
    else {
      alert("Preencha o motivo e digite sua senha para confirmar");
    }
  }
}