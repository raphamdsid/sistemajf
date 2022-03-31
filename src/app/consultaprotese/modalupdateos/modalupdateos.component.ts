import { formatDate, TitleCasePipe, DatePipe, formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from 'src/app/auth/auth.service';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';


@Component({
  selector: 'app-modalupdateos',
  templateUrl: './modalupdateos.component.html',
  styleUrls: ['./modalupdateos.component.scss']
})
export class ModalupdateosComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  index: any;
  tipo: any;
  dateForm: any;
  pwdForm: any;
  tipotxt: any;
  enableSubmit: number = 0;
  updatearray: any = [];
  objprod: any = [];
  sloader: number = 0;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  page: number = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private auth: AuthService, private dialogRef: MatDialogRef<ModalupdateosComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    produtos: any,
    user: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    let ps = this.data.produtos;
    // let tobj = [];
    for (let x = 0; x < ps.length; x++) {
      let tobj = {
        createdat: ps[x].createdat,
        createdby: ps[x].createdby,
        data_entrega: ps[x].data_entrega,
        data_recebimento: ps[x].data_recebimento,
        id: ps[x].id,
        idos: ps[x].idos,
        obs: ps[x].obs,
        produto: ps[x].produto,
        qtd: ps[x].qtd,
        valor: ps[x].valor
      }
      this.objprod.push(tobj);
    }
    // this.objprod = ps;
    let thisday = new Date();
    this.dateForm = new FormGroup({
      date: new FormControl(thisday, Validators.required)
    });
    this.pwdForm = new FormGroup({
      pwd: new FormControl('', Validators.required)
    });
    console.log(this.data);
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.onNoClick();
      }
    });
  }
  onNoClick() {
    // let result = {
    //   a: this.data.produtos,
    //   b: this.objprod
    // }
    // this.dialogRef.close(result);
    this.dialogRef.close();

  }
  functionEsc() {
    alert('escape!');
  }
  dummyFunction() {

  }
  goBack() {
    this.page = 0;
    this.index = null;
    this.tipo = null;
  }
  sendData() {
    if (this.pwdForm.valid == true) {
      this.sloader = 1;
      let pwd = this.pwdForm.controls["pwd"].value;
      const username = this.auth.getUser();
      this.service.getUser(username).subscribe(u => {
        // console.log(u);
        if (pwd == u.pwd) {
          let result = {
            data: this.updatearray,
            obj: this.objprod
            // count: this.objprod.length
          }
          this.dialogRef.close(result);
        }
        else {
          alert('Senha inválida');
          this.sloader = 0;
        }
      },
        (error) => {
          alert('Erro ao validar senha');
          this.sloader = 0;
        });
    }
  }
  inputPwd() {
    console.log(this.updatearray);
    console.log(this.objprod);
    console.log(this.data.produtos);
    this.page = 2;
  }
  setDate(index: any, tipo: any) {
    this.index = index;
    if (tipo == 'de') {
      this.tipotxt = 'data de entrega';
    }
    if (tipo == 'dr') {
      this.tipotxt = 'data de recebimento';
    }
    this.tipo = tipo;
    this.page = 1;
    console.log(new Date());
    let date = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.dateForm.controls["date"].setValue(date);
  }
  confirmDate() {
    if (this.dateForm.valid == true) {
      let i = this.index;
      let obj;
      let date = this.dateForm.controls["date"].value;
      console.log(date);
      let dateb = date + ' 00:00';
      let datestr = formatDate(new Date(dateb), 'dd/MM/yyyy', 'en');
      // console.log(tst);
      let id = this.objprod[i].id;
      let tipo: any;
      let auditoperacao: any;
      let audittxt: any;
      if (this.tipo == 'de') {
        this.objprod[i].data_entrega = date;
        tipo = 'data_entrega';
        auditoperacao = 'Definição de data de entrega';
        audittxt = 'Definição de data de entrega do serviço ' + this.objprod[i].produto + ' da ordem de serviço nº ' + id + ' para o dia ' + datestr;
      }
      if (this.tipo == 'dr') {
        this.objprod[i].data_recebimento = date;
        tipo = 'data_recebimento';
        auditoperacao = 'Definição de data de recebimento';
        audittxt = 'Definição de data de recebimento do serviço ' + this.objprod[i].produto + ' da ordem de serviço nº ' + id + ' para o dia ' + datestr;
      }
      let user = this.auth.getUser();
      let auditobj = 'Serviço de prótese externa';

      obj = {
        id: id,
        tipo: tipo,
        date: date,
        user: user,
        audittxt: audittxt,
        auditobj: auditobj,
        auditoperacao: auditoperacao
      }

      this.updatearray.push(obj);
      this.enableSubmit = 1;
      this.goBack();
    }
    else {
      alert("Defina a data");
    }
  }
}