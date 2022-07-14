import { formatCurrency, formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2, EventEmitter } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from 'src/app/auth/auth.service';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';
import jwt_decode from "jwt-decode";



@Component({
  selector: 'app-contatomodal',
  templateUrl: './contatomodal.component.html',
  styleUrls: ['./contatomodal.component.scss']
})
export class ContatomodalComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  forma_estornos: any = [];
  remainlength: number = 1000;
  role: any;
  user: any;
  phonemask = '(00)0000-0000';

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  contatoForm: any;
  pwdEstornoForm: any;
  valor: Number = 0;
  page: Number = 0;
  sloader = 0;
  debitos: any = [];

  textChanges: EventEmitter<any> = new EventEmitter();
  constructor(private httpClient: HttpClient, private renderer: Renderer2, private auth: AuthService, private service: ConsultaService, private tools: ToolsService, public dialog: MatDialog, private dialogRef: MatDialogRef<ContatomodalComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    obj: any
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    // sessionStorage.setItem('token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InJhcGhhbWRzIiwibm9tZSI6IlJhcGhhZWwgTWFpYSIsInRpcG8iOiJhZG1pbiIsInVuaWRhZGUiOiIifQ.eZPLIc8qE6wk3f3hJpzpuLaDBiRkVjpmBYVzJmtYo90');
    // console.log('ATENÇÃO: Token inserido manualmente, retirar para após colocar o componente na rota');
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.dialogRef.close();
      }
    });

    this.contatoForm = new FormGroup({
      tel: new FormControl(''),
      status: new FormControl('contato_ok', Validators.required),
      recontato: new FormControl(false),
      dtpagstats: new FormControl(false),
      obs: new FormControl('', Validators.required)
    });
    this.pwdEstornoForm = new FormGroup({
      pwd: new FormControl('', Validators.required)
    });
    this.getSessionItem();
    this.getDebitos();
  }
  getSessionItem() {
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    this.user = {
      nome: checktoken.nome,
      username: checktoken.username,
      unidade: checktoken.unidade
    }
    console.log(this.role);
    console.log(this.user.nome);
    // console.log(this.user);
    // console.log(token);
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  recChange(type: any) {
    if (type == 1) {
      console.log(this.contatoForm.controls["recontato"].value);
      if (this.contatoForm.controls["recontato"].value == true) {
        console.log(new Date());
        // let date = new Date();
        let date = formatDate(new Date(), 'yyyy-MM-dd', 'pt-BR');
        // console.log(date);
        this.contatoForm.addControl("data_rec", new FormControl(date, Validators.required));
        // console.log(this.contatoForm.controls["data_rec"].value);
      }
      if (this.contatoForm.controls["recontato"].value == false) {
        this.contatoForm.removeControl("data_rec");
      }
    }
    if (type == 2) {
      console.log(this.contatoForm.controls["dtpagstats"].value);
      if (this.contatoForm.controls["dtpagstats"].value == true) {
        console.log(new Date());
        // let date = new Date();
        let date = formatDate(new Date(), 'yyyy-MM-dd', 'pt-BR');
        // console.log(date);
        this.contatoForm.addControl("data_pag", new FormControl(date, Validators.required));
        // console.log(this.contatoForm.controls["data_pag"].value);
      }
      if (this.contatoForm.controls["dtpagstats"].value == false) {
        this.contatoForm.removeControl("data_pag");
      }
    }
  }
  getDebitos() {
    let date = formatDate(new Date(), 'yyyy-MM-dd', 'pt-BR');
    let obj = {
      cpf: this.data.obj.cpf,
      unidade: this.data.obj.unidade,
      dt: date,
    }
    this.service.getCrcDebitosPaciente(obj).subscribe(d => {
      console.log(d);
      if (d.status == 'ok') {
        this.debitos.array = d.result;
        this.debitos.status = d.status;
        console.log(this.debitos);
        let tot = 0;
        for (let x = 0; x < this.debitos.array.length; x++) {
          console.log(Number(this.debitos.array[x].VALOR_ATUAL));
          tot = Number(this.debitos.array[x].VALOR_ATUAL) + tot;
        }
        this.debitos.total = tot;
      }
      else {
        this.debitos.status = d.status;
      }
    },
      (error) => {
        console.log(error);
        this.debitos.status = 'erro';
      });
  }
  changeStats() {
    this.contatoForm.controls["recontato"].setValue(null);
    this.contatoForm.controls["dtpagstats"].setValue(null);
  }
  checkDate(type: any) {
    // console.log('Works!');
    let date = this.contatoForm.controls[type].value;
    let curdate = formatDate(new Date(), 'yyyy-MM-dd', 'pt-BR');
    if (date < curdate) {
      // console.log('Bad!');
      this.contatoForm.controls[type].setValue(curdate);
    }
    if (date >= curdate) {
      // console.log('Good!');
    }
  }
  saveCont() {
    alert("Salvo!");
  }
  phoneMask() {
    let phone = this.contatoForm.controls["tel"].value.trim();
    this.contatoForm.controls["tel"].setValue(phone);
  }
  checkPhone() {
    console.log('Phone');
    console.log(this.contatoForm.controls["tel"].value);
    console.log(this.contatoForm.controls["tel"].value.length);
    let length = this.contatoForm.controls["tel"].value.length;
    if (length > 0 && length < 10) {
      this.contatoForm.controls["tel"].setValue('');
    }
  }
  nextPage() {
    this.page = 1;
    let curdate = formatDate(new Date(), 'yyyy-MM-dd', 'pt-BR');
    let dt_recontato;
    let dt_pagamento;
    let situacao;
    situacao = this.contatoForm.controls["status"].value;
    let tel = this.contatoForm.controls["tel"].value;
    if (tel.length == 0) {
      tel = null;
    }
    if (this.contatoForm.controls["recontato"].value == true) {
      dt_recontato = this.contatoForm.controls["data_rec"].value;
    }
    if (this.contatoForm.controls["recontato"].value == false) {
      dt_recontato = null;
    }
    if (this.contatoForm.controls["dtpagstats"].value == true) {
      dt_pagamento = this.contatoForm.controls["data_pag"].value;
    }
    if (this.contatoForm.controls["dtpagstats"].value == false) {
      dt_pagamento = null;
    }
    let tempobj = {
      cpf: this.data.obj.cpf,
      unidade: this.data.obj.unidade,
      tipo: this.data.obj.tipo,
      obs: this.contatoForm.controls["obs"].value,
      tel: tel,
      dt_contato: curdate,
      dt_recontato: dt_recontato,
      dt_pagamento: dt_pagamento,
      situacao: situacao,
      usuario: this.user.username
    }
    console.log(tempobj);
  }
  prevPage() {
    this.page = 0;
  }
  // calcMaxLength() {
  //   let textlength = this.contatoForm.controls["obs"].value.length;
  //   this.remainlength = 1000 - textlength;
  //   console.log(this.remainlength)
  // }


}