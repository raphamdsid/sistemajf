import { formatCurrency } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from 'src/app/auth/auth.service';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';
import { ModalprintrequerimentoComponent } from '../modalprintrequerimento/modalprintrequerimento.component';

@Component({
  selector: 'app-modalsolicitaestorno',
  templateUrl: './modalsolicitaestorno.component.html',
  styleUrls: ['./modalsolicitaestorno.component.scss']
})
export class ModalsolicitaestornoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  forma_estornos: any = [];
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  solicitaEstornoForm: any;
  pwdEstornoForm: any;
  valor: Number = 0;
  page = 0;
  sloader = 0;
  constructor(private httpClient: HttpClient, private renderer: Renderer2, private auth: AuthService, private service: ConsultaService, private tools: ToolsService, public dialog: MatDialog, private dialogRef: MatDialogRef<ModalsolicitaestornoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    venda: any,
    id: any,
    waitestorno: any,
    waitestornouser: any,
    user: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.dialogRef.close();
      }
    });
    this.formaEstornoList();
    this.solicitaEstornoForm = new FormGroup({
      valor: new FormControl(0, Validators.required),
      fpag: new FormControl('', Validators.required),
      txt: new FormControl('', Validators.required)
    });
    this.pwdEstornoForm = new FormGroup({
      pwd: new FormControl('', Validators.required)
    });
    if (this.data.venda.financiador != "BANCO JF") {
      this.solicitaEstornoForm.removeControl("fpag");
    }
    console.log(this.data);
    this.valor = this.data.venda.waitestornovalor;
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  modalSubmit() {
    // //  console.log(this.solicitaEstornoForm.valid);
    if (this.solicitaEstornoForm.valid && this.solicitaEstornoForm.controls["valor"].value > 0) {
      if (this.solicitaEstornoForm.controls["valor"].value > this.data.venda.valoratual) {
        alert("Valor solicitado é maior que o valor da venda")
      }
      else {
        let fpag = '';
        if (this.data.venda.financiador == "BANCO JF") {
          fpag = this.solicitaEstornoForm.controls["fpag"].value;
        }
        let auditobj = "Venda";
        let auditoperacao = "Solicitação de estorno";
        let audittxt = "Solicitação de estorno da venda - DOC ODC: " + this.data.venda.docodc + " - Cliente: " + this.data.venda.cliente + ". Valor do estorno: " + formatCurrency(this.solicitaEstornoForm.controls["valor"].value, 'pt-BR', 'R$');
        let result = {
          id: this.data.id,
          waitestornouser: this.data.user,
          waitestorno: 1,
          waitestornovalor: this.solicitaEstornoForm.controls["valor"].value,
          waitestornofpag: fpag,
          waitestornotxt: this.solicitaEstornoForm.controls["txt"].value,
          waitestornodate: "CURRENT_TIMESTAMP",
          auditobj: auditobj,
          auditoperacao: auditoperacao,
          audittxt: audittxt,
          user: this.data.user,
          venda: this.data.venda
        }
        this.dialogRef.close(result);

      }
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  nextPage() {
    this.page = 1;
  }
  returnPage() {
    this.page = 0;
  }
  verifyPwd() {
    if (this.pwdEstornoForm.valid == true) {
      this.sloader = 1;
      let pwd = this.pwdEstornoForm.controls["pwd"].value;
      this.service.getUser(this.data.user).subscribe(u => {
        if (pwd == u.pwd) {
          // this.sloader = 0;
          this.cancelSolic();
        }
        else {
          this.sloader = 0;
          alert("Senha incorreta");
          this.pwdEstornoForm.controls["pwd"].setValue('');
        }
      },
        (error) => {
          console.log(error);
          this.sloader = 0;
          alert("Erro ao validar senha");
        });
    }
    else {
      alert("Preencha sua senha para confirmar")
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
      waitestornofpag: '',
      waitestornotxt: '',
      waitestornodate: "null",
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt,
      user: this.data.user,
      venda: this.data.venda
    }
    this.dialogRef.close(result)
  }
  printProposta() {
    let tempobj = this.data;
    tempobj.venda.waitestornodate = new Date();
    let printobj = tempobj;
    console.log(tempobj);
    const dialogRefa = this.dialog.open(ModalprintrequerimentoComponent, {
      data: {
        obj: printobj,
        tipo: 'normal'
      },
      panelClass: 'modalprintreq'
    });
    dialogRefa.afterClosed().subscribe(result2 => {
      console.log(result2);
    });
  }
  formaEstornoList() {
    this.httpClient.get("assets/vendor/formas_estorno.json").subscribe(data => {
      console.log(data);
      this.forma_estornos = data;
    });
  }
}