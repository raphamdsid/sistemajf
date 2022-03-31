import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import { TitleCasePipe } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';
import jwt_decode from "jwt-decode";
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToolsService } from '../services/tools.service';

@Component({
  selector: 'app-comunicados',
  templateUrl: './comunicados.component.html',
  styleUrls: ['./comunicados.component.scss']
})
export class ComunicadosComponent implements OnInit {
  userForm: FormGroup;
  comunicaForm: any;
  role: any;
  user: any;
  sloader: number = 0;
  comunicacount: any;
  comunicado: any;
  newcomlayout: any;
  viewlog: any = [];
  @ViewChild('texto', { static: false }) texta: any;
  constructor(private router: Router, private auth: AuthService, public datepipe: DatePipe, private formBuilder: FormBuilder, public dialog: MatDialog, private tools: ToolsService, private service: ConsultaService) {
    this.userForm = this.formBuilder.group({
    });

  }

  ngOnInit(): void {
    this.getSessionItem();
    this.service.getNewestComunicado().subscribe(c => {
      console.log(c);
      this.comunicacount = c.count;
      this.comunicado = c.comunica[0];
      if (c.count == 0) {
        this.newcomlayout = 0;
      }
      if (c.count == 1) {
        this.newcomlayout = 1;
        this.comunicaForm.controls["titulo"].setValue(this.comunicado.titulo);
        this.comunicaForm.controls["texto"].setValue(this.comunicado.texto);
        console.log(this.comunicaForm.value);
        if (this.role == 'gerente') {
          let user = this.user.username;
          let funcionario = this.user.nome;
          let unidade = this.user.unidade;
          let role = this.role;
          let id = this.comunicado.id;
          let obj = {
            id: id,
            funcionario: funcionario,
            user: user,
            unidade: unidade,
            role: role
          }
          this.service.postViewlogComunicado(obj).subscribe(v => {
            console.log(v);
            this.resizeTxtArea();
          });
        }
        if (this.role == 'admin') {
          let obj = {
            id: this.comunicado.id
          }
          this.service.getViewlogComunicado(obj).subscribe(v => {
            console.log(v);
            this.viewlog = v.views;
            console.log(this.viewlog);
          });
        }
      }
    });
    this.comunicaForm = new FormGroup({
      titulo: new FormControl('', Validators.required),
      texto: new FormControl('', Validators.required)
    });

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
    console.log(this.user);
    console.log(this.user.nome);
    console.log(token);
  }
  publicar() {
    if (this.comunicaForm.valid == true) {
      this.sloader = 1;
      let audittxt = "Publicação do comunicado '" + this.comunicaForm.controls["titulo"].value + "'."
      let auditobj = "Comunicado";
      let auditoperacao = "Criação";
      let obj = {
        titulo: this.comunicaForm.controls["titulo"].value,
        texto: this.comunicaForm.controls["texto"].value,
        createdby: this.user.nome,
        user: this.user.username,
        audittxt: audittxt,
        auditobj: auditobj,
        auditoperacao: auditoperacao
      }
      this.service.postNewComunicado(obj).subscribe(c => {
        console.log(c);
        if (c.status == 'ok') {
          this.sloader = 0;
          alert("Comunicado postado!");
          this.newcomlayout = 1;
        }
        if (c.status == 'error') {
          this.sloader = 0;
          alert("Erro ao postar comunicado");
        }
      },
        (error) => {
          console.log(error);
          alert("Erro ao postar comunicado");
          this.sloader = 0;
        });
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  retiraComunica() {
    console.log(this.comunicado.id);
    this.sloader = 1;
    let auditobj = "Comunicado";
    let auditoperacao = "Retirada";
    let audittxt = "Retirada do comunicado '" + this.comunicado.titulo + "'";
    let funcionario = this.user.nome;
    let unidade = this.user.unidade;
    let role = this.role;
    let obj = {
      id: this.comunicado.id,
      user: this.user.username,
      auditobj: auditobj,
      auditoperacao: auditoperacao,
      audittxt: audittxt
    }
    this.service.postDelComunicado(obj).subscribe(c => {
      console.log(c)
      if (c.status == 'ok') {
        this.sloader = 0;
        alert("Comunicado retirado!");
        this.newcomlayout = 0;
        this.comunicado = [];
        this.viewlog = [];
        this.comunicaForm.controls["titulo"].setValue('');
        this.comunicaForm.controls["texto"].setValue('');
      }
      if (c.status == 'error') {
        this.sloader = 0;
        alert("Erro ao retirar comunicado");
      }
    },
      (error) => {
        console.log(error);
        this.sloader = 0;
        alert("Erro ao retirar comunicado");
      });

  }
  viewLog() {
    let user = this.user.user;
    let funcionario = this.user.nome;
    let unidade = this.user.unidade;
    let role = this.role;
    let id = this.comunicado.id;
    let obj = {
      id: id,
      funcionario: funcionario,
      user: user,
      unidade: unidade,
      role: role
    }
    this.service.postViewlogComunicado(obj).subscribe(v => {
      console.log(v);
      
    });
  }
  resizeTxtArea() {
    this.texta.nativeElement.style.height = 'auto';
    this.texta.nativeElement.style.height = `${this.texta.nativeElement.scrollHeight}px`;
  }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printarea')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Comunicado</title>
          <script>
          
          </script>
          <style>
            .no-print{
              visibility: hidden;
            }
        
            .nomargl {
              margin-left: 0px;
              margin-right: 0px;
            }
            #container {
              width: 270mm;
            }
            row {
              margin-left: 0px !important;
              margin-right: 0px !important;
            }
            body {
              width: 100%;
              margin: auto;
              overflow-x: hidden;
            }
            li {
              overflow: hidden; 
              text-overflow: ellipsis;
              white-space: nowrap;
            }

          </style>
          <style media="print">
          </style>
          <link rel="stylesheet" href="styles.css">
          <body onload="window.print();window.close();">${printContents}
          </body>
      </html>`
    );
    // <body onload="window.print();window.close();">${printContents}
    popupWin!.document.close();
  }
}
function autosize(arg0: NodeListOf<Element>) {
  throw new Error('Function not implemented.');
}

