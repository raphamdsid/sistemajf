import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import jwt_decode from "jwt-decode";
import { formatCurrency, TitleCasePipe } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { BuscaCepService } from '../services/buscacep.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { formatDate } from '@angular/common';
import { ModalbComponent } from '../financeiro/modalb/modalb.component';
import { ModalcontratojfComponent } from '../jfvenda/modalcontratojf/modalcontratojf.component';
import { ModaldetailsosComponent } from '../consultaprotese/modaldetailsos/modaldetailsos.component';
import { ToolsService } from '../services/tools.service';
import { ContatomodalComponent } from './contatomodal/contatomodal.component';

@Component({
  selector: 'app-crc',
  templateUrl: './crc.component.html',
  styleUrls: ['./crc.component.scss']
})
export class CrcComponent implements OnInit {

  contasForm: any;
  manutForm: any;
  today: any;
  unidades: any = [];
  sloader = 0;
  contas: any = [];
  tabindex: number = 0;
  manut: any = [];
  contshowa: any;
  constructor(private tools: ToolsService, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService, private http: HttpClient,
    private cepService: BuscaCepService, private auth: AuthService) { }

  ngOnInit(): void {
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.today = today;
    let unid: any = [];
    this.tools.unidList().subscribe(data => {
      for (let x = 0; x < data.length; x++) {
        if (data[x].ativo == 1) {
          this.unidades.push(data[x]);
        }
      }
      console.log(this.unidades);
    });
    this.contasForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      unidade: new FormControl('NI1', Validators.required)
    });
    this.manutForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      unidade: new FormControl('NI1', Validators.required)
    });
  }
  getContas() {
    if (this.contasForm.valid == true) {
      this.contas = [];
      this.contshowa = null;
      this.sloader = 1;
      let obj = {
        dta: this.contasForm.controls["dtinicio"].value,
        dtb: this.contasForm.controls["dtfim"].value,
        unidade: this.contasForm.controls["unidade"].value
      }
      this.service.getContasReceber(obj).subscribe(c => {
        if (c.status = 'ok') {
          this.sloader = 0;
          let temparray = c.result;
          for (let x = 0; x < temparray.length; x++) {
            temparray[x].showcont = false;
            temparray[x].unidade = obj.unidade;
            temparray[x].tipo = "Clinico";
            temparray[x].contatos = temparray[x][0].contatos;
            temparray[x].cpf = temparray[x][0].CPF;
            temparray[x].nome = temparray[x][0].NOME;
            temparray[x].tel1 = temparray[x][0].TELEFONE_1;
            temparray[x].tel2 = temparray[x][0].TELEFONE_2;
            temparray[x].fax = temparray[x][0].FAX;

            let total = 0;
            for (let y = 0; y < temparray[x].length; y++) {
              temparray[x][y].showloader = 0;
              delete temparray[x][y].contatos;
              delete temparray[x][y].CPF;
              delete temparray[x][y].NOME;
              delete temparray[x][y].TELEFONE_1;
              delete temparray[x][y].TELEFONE_2;
              delete temparray[x][y].FAX;
              temparray[x][y].prods = [];
              total = Number(temparray[x][y].VALOR_ATUAL) + total;
            }
            temparray[x].totaldeb = total;
          }
          // console.log(c);
          this.contas = temparray;
          console.log(this.contas);
        }
        else {
          this.sloader = 0;
          alert(c.Message);
        }
      },
        (error) => {
          this.sloader = 0;
          alert('Erro ao buscar dados');
          console.log(error);
        })
    }
    else {
      alert('Preencha todos os campos');
    }

  }
  delProdlist(index1: any, index2: any) {
    this.contas[index1][index2].prods = [];
  }
  getProdDoc(doc: any, unidade: any, index1: any, index2: any) {
    // console.log(index1 + ' - ' + index2);
    // console.log(this.contas[index1]);
    // console.log(this.contas[index1][index2]);
    // console.log('Length: ' + this.contas[index1].length);
    this.contas[index1][index2].showloader = 1;
    let obj = {
      doc: doc,
      unidade: unidade
    }
    this.service.getProdDocs(obj).subscribe(p => {
      console.log(p);
      this.contas[index1][index2].showloader = 0;
      if (p.status == 'ok') {
        this.contas[index1][index2].prods = p.result;
        this.contas[index1][index2].prods.fl = this.contas[index1].length;
      }
      else {
        this.contas[index1][index2].showloader = 2;
      }

    },
      (error) => {
        this.contas[index1][index2].showloader = 2;
        console.log(error);
      });
  }
  getManutInad() {
    if (this.manutForm.valid == true) {
      this.manut = [];
      this.sloader = 1;
      let obj = {
        dta: this.manutForm.controls["dtinicio"].value,
        dtb: this.manutForm.controls["dtfim"].value,
        unidade: this.manutForm.controls["unidade"].value
      }
      this.service.getManutInad(obj).subscribe(c => {
        if (c.status = 'ok') {
          this.sloader = 0;
          let temparray = c.result;
          for (let x = 0; x < temparray.length; x++) {
            temparray[x].contatos = temparray[x][0].contatos;
            temparray[x].cpf = temparray[x][0].CPF;
            temparray[x].nome = temparray[x][0].NOME;
            temparray[x].tel1 = temparray[x][0].TELEFONE_1;
            temparray[x].tel2 = temparray[x][0].TELEFONE_2;

            let total = 0;
            for (let y = 0; y < temparray[x].length; y++) {

              total = Number(temparray[x][y].VALOR_PARCELA) + total;
            }
            temparray[x].totaldeb = total;
          }
          // console.log(c);
          this.manut = temparray;
          console.log(this.manut);
        }
        else {
          this.sloader = 0;
          alert(c.Message);
        }
      },
        (error) => {
          this.sloader = 0;
          alert('Erro ao buscar dados');
          console.log(error);
        })
    }
    else {
      alert('Preencha todos os campos');
    }

  }
  whatsappChat(tel: string) {
    console.log(this.tools.getNumbersFromString(tel));
    let ftel = this.tools.getNumbersFromString(tel);
    let url = 'https://web.whatsapp.com/send?phone=55' + ftel;
    window.open(url, "_blank");
  }

  showCont(type: any, index: any) {
    if (type == 0) {
      console.log(index);
      this.contas[index].showcont = true;
    }
  }
  hideCont(type: any, index: any) {
    if (type == 0) {
      console.log(index);
      this.contas[index].showcont = false;
    }
  }
  openContatoModal(object: any, index: any) {
    console.log(object);
    console.log(index);
    const dialogRef = this.dialog.open(ContatomodalComponent, {
      data: {
        obj: object
      },
      panelClass: 'modalcontato'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
