import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import { formatDate, TitleCasePipe, DatePipe, formatCurrency } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { HttpClient } from '@angular/common/http';


import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";

import { Router } from '@angular/router';
import { validate } from 'gerador-validador-cpf';
import { ModaljfComponent } from './modaljf/modaljf.component';
import { ModalprodlistComponent } from './modalprodlist/modalprodlist.component';
import { ToolsService } from '../services/tools.service';
import { ModalconfirmdescontoComponent } from './modalconfirmdesconto/modalconfirmdesconto.component';
import { ModalbComponent } from '../financeiro/modalb/modalb.component';
import { ModalemergencialComponent } from './modalemergencial/modalemergencial.component';
import { ModalentradaComponent } from './modalentrada/modalentrada.component';
import { ModalcontratojfComponent } from './modalcontratojf/modalcontratojf.component';

@Component({
  selector: 'app-jfvenda',
  templateUrl: './jfvenda.component.html',
  styleUrls: ['./jfvenda.component.scss']
})
export class JfvendaComponent implements OnInit {

  selectedOption: string = '';
  printedOption: string = '';
  plano: string = '';
  valorparcela: number = 0;
  adesao: number = 0;
  priparcela: number = 0;
  descontos: number = 1;
  desconto: number = 100;
  parcelcontrol: number = 0;
  gerentectrl: number = 0;
  valordesconto: number = 0;
  pdfshow: number = 0;
  tipocontrato: number = 0;
  nomeplano: string = '';
  finbaenable: number = 0;
  finbbenable: number = 0;
  dep1: any = '';
  dep2: any = '';
  dep3: any = '';
  dep4: any = '';
  finobj: any = null;
  formobj: any = null;
  buscaclientecpf: String = '';
  objbusca: any = [];
  objbuscav: any = [];
  deletefin: number = 0;
  pwd: any;
  datavencimento = new Date();
  forma_pagamento: number[] = [];
  valor_pago: Number = 0;
  options = [
    { name: "option1", value: 1 },
    { name: "option2", value: 2 }
  ]

  qtdparcelas: number = 0;



  hidedescontos: number = 1;
  depbtnenable: number = 0;
  depbtnincenable: number = 0;
  parcela: number = 1;
  valortot: number = 0;
  depNome: string = '';
  depCpf: string = '';
  depRg: string = '';
  depOrg: string = '';
  depNasc: any = '';
  depGen: string = '';
  dependentesx: any[] = [];
  testpage: string = '';
  titNome: string = '';
  tNome: string = '';
  tabindex: number = 0;
  valorf: Number = 0;
  valorft: Number = 0;
  valorparcelaf: any = 0;
  showcarne: Number = 0;
  enabletitb: number = 1;
  public validtit: number = 0;
  public showdeplist: number = 0;
  public depForm = new FormGroup({
    depnome: new FormControl(''),
    depcpf: new FormControl(''),
    deprg: new FormControl(''),
    deporgao: new FormControl(''),
    depnasc: new FormControl(''),
    depgen: new FormControl(''),
  });
  dependentes: any = [];
  profileForm: any;
  objvenda: any;
  finForm: any;
  pagForm: any;
  tcontrato: number = 0;
  enabletitinc: number = 0;
  opag: any;
  showcartao: number = 0;
  objcliente: any = [];
  objvendedor: any = [];
  objbuscac: any = [];
  avista: number = 0;
  deps: any = [];
  depcount: Number = 0;
  pagamento: any;
  objpagamento: any;
  pagar: Number = 0;
  parcel: Number = 0;
  objupdatepag: any;
  objcomprovante: any;
  showcomprovante: number = 0;
  dtvenci = new Date();
  objpaga: any;
  atraso: number = 0;
  contaatraso: number = 0;
  juros: number = 0;
  role: any;
  user: any;
  venda: any;
  valor_parcela: any;
  valparcela: any;
  unidade: any;
  blckbtnpag: number = 0;
  showcancellabel: number = 0;
  showcancelbtn: number = 0;
  vendaForm: any;
  vendalayout: number = 1;
  total: number = 0;
  objbuscap: any = [];
  teste: number = 0;
  @ViewChild('pacientecpf', { static: false }) pacicpf: any;
  @ViewChild('fiadorcpf', { static: false }) fiadcpf: any;
  objprint: any;
  today: Date = new (Date);
  userForm: FormGroup;
  produtos: any = [];
  discount: number = 0;
  taxas: any;
  arraycjuros: any;
  arraysjuros: any;
  prodemg = 0;
  entradas: any = [];
  fentradas: any = [];
  totalentrada: any = 0;
  totalentradajf: any = 0;
  percdesc: any;
  tipoparcelamento: any = [];
  totalprodutos: number = 0;
  showcontent: number = 0;
  prevavaliacao: any = 0;
  prevdesc: any = 0;
  liberadoatd: any = false;
  sloader: any;
  financiadores: any = [];
  constructor(private router: Router, private auth: AuthService, public datepipe: DatePipe, private formBuilder: FormBuilder, public dialog: MatDialog, private tools: ToolsService, private service: ConsultaService) {
    this.userForm = this.formBuilder.group({

    });

  }

  ngOnInit(): void {
    this.auth.isAuth();
    this.getSessionItem();
    let role = this.auth.getRole();
    console.log(role);
    if (role == 'admin') {
      this.router.navigate(['/home']);
    }
    let testdate = new Date();
    this.today = testdate;
    let myDate = formatDate(new Date(), 'yyyy-MM-dd : HH:mm', 'en');
    console.log(myDate);
    this.service.getFinanciadores().subscribe(f => {
      console.log(f)
      this.financiadores = f;
    });
    this.service.getEntradas().subscribe(f => {
      console.log(f)
      this.entradas = f;
    });
    this.vendaForm = new FormGroup({
      cliente: new FormControl('', Validators.required),
      cpfpaciente: new FormControl('', Validators.required),
      // cpffiador: new FormControl('', Validators.required),
      valoravaliacao: new FormControl(0, Validators.required),
      valorcomercial: new FormControl(0, Validators.required),
      //produto: new FormControl('', Validators.required),
      buscaproduto: new FormControl(''),
      docvenda: new FormControl('', Validators.required),
      desconto: new FormControl(0, Validators.required),
      valorentrada: new FormControl(0),
      valorfinanciado: new FormControl(0, Validators.required),
      //fpagentrada: new FormControl('Crédito na clínica', Validators.required),
      fpagparcela: new FormControl('BOLETO'),
      parcelamento: new FormControl('SJUROS'),
      qtdparcelas: new FormControl('', Validators.required),
      isnotfiador: new FormControl(false)
    });
    this.sloader = 0;
    this.setTaxas();
    // alert("COMPONENTE EM DESENVOLVIMENTO");



    //this.adesao='';
    //this.finForm.value.finnparcelas = 1;
    //this.priparcela = this.valorparcela;

    //  this.tNome='';
    // this.titNome='';


  }
  selectAll(input: any) {
    input.target.select();
  }

  setTaxas() {
    this.service.getTaxas().subscribe(t => {
      // //console.log(t.Valores[0]);
      let temptaxas = t.Valores[0];
      let tjuros2a4 = temptaxas.juros2a4;
      let tjuros5a8 = temptaxas.juros5a8;
      let tjuros9a12 = temptaxas.juros9a12;
      let tjuros13a16 = temptaxas.juros13a16;
      let tjuros17a20 = temptaxas.juros17a20;
      let tjuros21a24 = temptaxas.juros21a24;
      let tjurosboleto = temptaxas.jurosboleto;
      let tjuroscheque = temptaxas.juroscheque;
      let ttaxaadicional = temptaxas.taxaadicional;
      // let tjuros2a4 = (temptaxas.juros2a4 / 100).toFixed(4);
      // let tjuros5a8 = (temptaxas.juros5a8 / 100).toFixed(4);
      // let tjuros9a12 = (temptaxas.juros9a12 / 100).toFixed(4);
      // let tjuros13a16 = (temptaxas.juros13a16 / 100).toFixed(4);
      // let tjuros17a20 = (temptaxas.juros17a20 / 100).toFixed(4);
      // let tjuros21a24 = (temptaxas.juros21a24 / 100).toFixed(4);
      // let tjurosboleto = (temptaxas.jurosboleto / 100).toFixed(4);
      // let tjuroscheque = (temptaxas.juroscheque / 100).toFixed(4);
      // let ttaxaadicional = temptaxas.taxaadicional;
      let objtemp = {
        juros2a4: tjuros2a4,
        juros5a8: tjuros5a8,
        juros9a12: tjuros9a12,
        juros13a16: tjuros13a16,
        juros17a20: tjuros17a20,
        juros21a24: tjuros21a24,
        jurosboleto: tjurosboleto,
        juroscheque: tjuroscheque,
        taxaadicional: ttaxaadicional
      }
      this.taxas = objtemp;
      console.log(this.taxas);
    });

  }
  resetQtdParc() {
    console.log(this.vendaForm.controls["parcelamento"].value);
    this.vendaForm.controls["qtdparcelas"].reset();
  }
  calculateDesconto() {
    let valor = this.vendaForm.controls["desconto"].value;
    let val;
    let prodval = this.sumProdVal();
    let maxpercent;
    let alloweddiscount;
    let modaltxt;
    if (prodval >= 10000) {
      maxpercent = 8;
    }
    else {
      maxpercent = 5;
    }
    if (this.produtos[0] == undefined) {
      this.vendaForm.controls["desconto"].setValue(0);
    }
    else {
      if (this.vendaForm.controls["desconto"].value > 0) {
        console.log(maxpercent);
        console.log(alloweddiscount);
        if ((valor + this.discount) > maxpercent) {
          alloweddiscount = (maxpercent - this.discount)
          // alloweddiscount = this.tools.decimalFix(alloweddiscount);
          if (alloweddiscount < 0) {
            // alert("Desconto não permitido para esta venda");
            modaltxt = 'Desconto não permitido para esta venda'
          }
          else {
            // alert("Desconto máximo permitido para esta venda é de " + alloweddiscount + "%");
            modaltxt = "Desconto máximo para esta venda é de " + maxpercent + "%, desconto permitido vai até " + alloweddiscount + "%"
          }
          const dialogRefa = this.dialog.open(ModalconfirmdescontoComponent, {
            data: {
              modaltxt: modaltxt
            },
            panelClass: 'modalcheckdiscount'
          });
          dialogRefa.afterClosed().subscribe(result => {
            if (result) {
              let modaltxtb = 'Confirme sua senha aplicar o desconto'
              const dialogRefb = this.dialog.open(ModalbComponent, {
                data: {
                  modaltxt: modaltxtb
                },
                panelClass: 'modalcheckdiscount'
              });
              dialogRefb.afterClosed().subscribe(resultb => {
                if (resultb) {
                  const username = this.auth.getUser();
                  this.service.getUser(username).subscribe(u => {
                    let user = u;
                    if (resultb == user.pwd) {
                      console.log('Success');
                      val = (Number(this.vendaForm.controls["desconto"].value) * Number(this.vendaForm.controls["valoravaliacao"].value) / 100)
                      val = Number(this.vendaForm.controls["valoravaliacao"].value) - val;
                      this.vendaForm.controls["valorcomercial"].setValue(val);
                      this.setTotFin();
                      this.prevdesc = this.vendaForm.controls["desconto"].value;
                    }
                    else {
                      this.vendaForm.controls["desconto"].setValue(0);
                      this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
                      this.setTotFin();
                      this.prevdesc = this.vendaForm.controls["desconto"].value;
                      alert("Senha incorreta");
                    }
                  })
                } else {
                  this.vendaForm.controls["desconto"].setValue(0);
                  this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
                  this.setTotFin();
                  this.prevdesc = this.vendaForm.controls["desconto"].value;
                }
              });
            }
            else {
              this.vendaForm.controls["desconto"].setValue(0);
              this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
              this.setTotFin();
              this.prevdesc = this.vendaForm.controls["desconto"].value;
            }
          })
          //  this.vendaForm.controls["desconto"].setValue(0);
        }
        else {
          if (this.vendaForm.controls["desconto"].value > 0) {
            val = (Number(this.vendaForm.controls["desconto"].value) * Number(this.vendaForm.controls["valoravaliacao"].value) / 100)
            val = Number(this.vendaForm.controls["valoravaliacao"].value) - val;
            this.vendaForm.controls["valorcomercial"].setValue(val);
            this.prevdesc = this.vendaForm.controls["desconto"].value;
          }
          if (this.vendaForm.controls["desconto"].value == 0) {
            this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
            this.prevdesc = this.vendaForm.controls["desconto"].value;
          }
          this.setTotFin();
        }
      }
      if (this.vendaForm.controls["desconto"].value == 0) {
        this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
        this.prevdesc = this.vendaForm.controls["desconto"].value;
      }
      this.setTotFin();
    }

  }
  setDesconto() {
    if (this.prevdesc != this.vendaForm.controls["desconto"].value) {
      this.calculateDesconto();
      // this.prevdesc = this.vendaForm.controls["desconto"].value;
    }
  }
  calcDesconto() {
    if (this.produtos[0] == undefined) {
      this.vendaForm.controls["desconto"].setValue(0);
    }
    this.calcMaxDiscount(this.vendaForm.controls["desconto"].value);
    if (this.vendaForm.controls["desconto"].value > 0) {
      let val = (Number(this.vendaForm.controls["desconto"].value) * Number(this.vendaForm.controls["valoravaliacao"].value) / 100)
      val = Number(this.vendaForm.controls["valoravaliacao"].value) - val;
      this.vendaForm.controls["valorcomercial"].setValue(val);
    }
    if (this.vendaForm.controls["desconto"].value == 0) {
      this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
    }
    this.setTotFin();
    console.log(this.vendaForm.controls["desconto"].value);
  }
  calcMaxDiscount(val: any) {
    let prodval = this.sumProdVal();
    let maxpercent;
    let alloweddiscount;
    let modaltxt;
    if (prodval >= 10000) {
      maxpercent = 8;
    }
    else {
      maxpercent = 5;
    }
    if (this.vendaForm.controls["desconto"].value > 0) {
      if ((val + this.discount) > maxpercent) {
        alloweddiscount = (maxpercent - this.discount)
        alloweddiscount = this.tools.decimalFix(alloweddiscount);
        if (alloweddiscount < 0) {
          // alert("Desconto não permitido para esta venda");
          modaltxt = 'Desconto não permitido para esta venda'
        }
        else {
          // alert("Desconto máximo permitido para esta venda é de " + alloweddiscount + "%");
          modaltxt = "Desconto máximo para esta venda é de " + maxpercent + "%, desconto permitido vai até " + alloweddiscount + "%"
        }
        const dialogRefa = this.dialog.open(ModalconfirmdescontoComponent, {
          data: {
            modaltxt: modaltxt
          },
          panelClass: 'modalcheckdiscount'
        });
        dialogRefa.afterClosed().subscribe(result => {
          if (result) {
            let modaltxtb = 'Confirme sua senha aplicar o desconto'
            const dialogRefb = this.dialog.open(ModalbComponent, {
              data: {
                modaltxt: modaltxtb
              }
            });
            dialogRefb.afterClosed().subscribe(resultb => {
              if (resultb) {
                const username = this.auth.getUser();
                this.service.getUser(username).subscribe(u => {
                  let user = u;
                  if (resultb == user.pwd) {
                    console.log('Success');
                    this.prevdesc = this.vendaForm.controls["desconto"].value;
                  }
                  else {
                    this.vendaForm.controls["desconto"].setValue(0);
                    this.prevdesc = this.vendaForm.controls["desconto"].value;
                  }
                })
              } else {
                this.vendaForm.controls["desconto"].setValue(0);
                this.prevdesc = this.vendaForm.controls["desconto"].value;
              }
            });
          }
          else {
            this.vendaForm.controls["desconto"].setValue(0);
            this.prevdesc = this.vendaForm.controls["desconto"].value;
          }
        })
        //  this.vendaForm.controls["desconto"].setValue(0);
      }
    }
    console.log(alloweddiscount);
    console.log(maxpercent);

  }
  calcFin() {

  }
  jurosCompostos(calcbase: any, qtdparc: any) {
    let jurosparc: number = 0;
    if (qtdparc >= 2 && qtdparc <= 4) {
      jurosparc = Number((this.taxas.juros2a4 / 100).toFixed(4));
    }
    if (qtdparc >= 5 && qtdparc <= 8) {
      jurosparc = Number((this.taxas.juros5a8 / 100).toFixed(4));
    }
    if (qtdparc >= 9 && qtdparc <= 12) {
      jurosparc = Number((this.taxas.juros9a12 / 100).toFixed(4));
    }
    if (qtdparc >= 13 && qtdparc <= 16) {
      jurosparc = Number((this.taxas.juros13a16 / 100).toFixed(4));
    }
    if (qtdparc >= 17 && qtdparc <= 20) {
      jurosparc = Number((this.taxas.juros17a20 / 100).toFixed(4));
    }
    if (qtdparc >= 21 && qtdparc <= 24) {
      jurosparc = Number((this.taxas.juros21a24 / 100).toFixed(4));
    }
    let calc1 = 1 + jurosparc;
    let calc2 = Math.pow(calc1, qtdparc);
    let result = calcbase * calc2;
    return result;

  }
  jurosParcelaNoFix(qtdparc: any) {
    let jurosparc: number = 0;
    if (qtdparc >= 2 && qtdparc <= 4) {
      jurosparc = Number((this.taxas.juros2a4 / 100));
    }
    if (qtdparc >= 5 && qtdparc <= 8) {
      jurosparc = Number((this.taxas.juros5a8 / 100));
    }
    if (qtdparc >= 9 && qtdparc <= 12) {
      jurosparc = Number((this.taxas.juros9a12 / 100));
    }
    if (qtdparc >= 13 && qtdparc <= 16) {
      jurosparc = Number((this.taxas.juros13a16 / 100));
    }
    if (qtdparc >= 17 && qtdparc <= 20) {
      jurosparc = Number((this.taxas.juros17a20 / 100));
    }
    if (qtdparc >= 21 && qtdparc <= 24) {
      jurosparc = Number((this.taxas.juros21a24 / 100));
    }

    return jurosparc;

  }
  jurosParcela(qtdparc: any) {
    let jurosparc: number = 0;
    if (qtdparc >= 2 && qtdparc <= 4) {
      jurosparc = Number((this.taxas.juros2a4 / 100).toFixed(4));
    }
    if (qtdparc >= 5 && qtdparc <= 8) {
      jurosparc = Number((this.taxas.juros5a8 / 100).toFixed(4));
    }
    if (qtdparc >= 9 && qtdparc <= 12) {
      jurosparc = Number((this.taxas.juros9a12 / 100).toFixed(4));
    }
    if (qtdparc >= 13 && qtdparc <= 16) {
      jurosparc = Number((this.taxas.juros13a16 / 100).toFixed(4));
    }
    if (qtdparc >= 17 && qtdparc <= 20) {
      jurosparc = Number((this.taxas.juros17a20 / 100).toFixed(4));
    }
    if (qtdparc >= 21 && qtdparc <= 24) {
      jurosparc = Number((this.taxas.juros21a24 / 100).toFixed(4));
    }

    return jurosparc;

  }
  calc() {
    if (this.vendaForm.controls["parcelamento"].value == 'sjuros') {
      this.calc6();
    }
    if (this.vendaForm.controls["parcelamento"].value == 'cjuros') {
      this.calc24();
    }

    //this.calc24();

  }
  calculateParcela(totfinanciado: number, juroscategoria: number, qtdparcelas: number, jurosparcela: number, taxaadicional: number) {
    let valparcelaf = (((totfinanciado + ((totfinanciado * juroscategoria) * qtdparcelas) / 24) * (1 + jurosparcela) ** qtdparcelas) / qtdparcelas) + taxaadicional;
    //let valparcela = Number(valparcelaf.toFixed(2));
    let valparcela = Number(valparcelaf);
    return valparcela;
  }
  calc24Test() {
    let totfinanciado = this.vendaForm.controls["valorfinanciado"].value;
    let qtdparcelas = this.vendaForm.controls["qtdparcelas"].value;
    let juroscategoria;
    if (this.vendaForm.controls["fpagparcela"].value == 'boleto') {
      juroscategoria = ((totfinanciado * this.taxas.jurosboleto) / 100).toFixed(2);
    }
    if (this.vendaForm.controls["fpagparcela"].value == 'cheque') {
      juroscategoria = ((totfinanciado * this.taxas.juroscheque) / 100).toFixed(2);
    }
    console.log(juroscategoria);
    juroscategoria = (Number(juroscategoria).toFixed(4))
    let calcbase = totfinanciado + ((Number(juroscategoria) * 7) / 24)
    calcbase = Number(calcbase.toFixed(2))
    let valcomjuros = this.jurosCompostos(calcbase, qtdparcelas);
    let valparcela = (Number(valcomjuros) / Number(qtdparcelas)) + Number(this.taxas.taxaadicional);
    valparcela = Number((valparcela).toFixed(2));
    let valtotal = Number(valparcela) * Number(qtdparcelas);
    let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    console.log(valshow);
    console.log(valpshow);
  }
  calc24() {
    let totfinanciado = Number(this.vendaForm.controls["valorfinanciado"].value);
    let qtdparcelas = Number(this.vendaForm.controls["qtdparcelas"].value);
    let juroscategoria: number = 0;
    if (this.vendaForm.controls["fpagparcela"].value == 'boleto') {
      let fjuroscategoria = ((this.taxas.jurosboleto) / 100);
      juroscategoria = Number(fjuroscategoria);
    }
    if (this.vendaForm.controls["fpagparcela"].value == 'cheque') {
      let fjuroscategoria = ((this.taxas.juroscheque) / 100);
      juroscategoria = Number(fjuroscategoria);
    }
    let jurosparcela: number = 0;
    if (this.vendaForm.controls["parcelamento"].value == 'sjuros') {
      jurosparcela = 0;
    }
    if (this.vendaForm.controls["parcelamento"].value == 'cjuros') {
      jurosparcela = Number(this.jurosParcelaNoFix(qtdparcelas));
    }
    let taxaadicional = Number(this.taxas.taxaadicional);
    //=(((totfinanciado+((totfinanciado*juroscategoria)*qtdparcelas)/24)*(1+jurosparcela)^qtdparcelas)/qtdparcelas)+taxaadicional
    // let valparcelaf = (((totfinanciado + ((totfinanciado * juroscategoria) * qtdparcelas) / 24) * (1 + jurosparcela) ** qtdparcelas) / qtdparcelas) + taxaadicional;
    let valparcela = this.calculateParcela(totfinanciado, juroscategoria, qtdparcelas, jurosparcela, taxaadicional);
    let valtotal = valparcela * qtdparcelas;
    console.log(totfinanciado);
    console.log(juroscategoria);
    console.log(jurosparcela);
    console.log(taxaadicional);
    console.log(valparcela);
    console.log(valtotal);
    console.log(this.tools.decimalFix(valparcela));
    console.log(this.tools.decimalFix(valtotal));
    valparcela = this.tools.decimalFix(valparcela);
    valtotal = this.tools.decimalFix(valtotal);
    let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    console.log(valshow);
    console.log(valpshow);
  }
  objparcelamento() {
    let totfinanciado = Number(this.vendaForm.controls["valorfinanciado"].value);
    let arraycjuros = [];
    let arraysjuros = [];
    this.tipoparcelamento = [];
    let juroscategoria: number = 0;
    if (this.vendaForm.controls["fpagparcela"].value == 'BOLETO') {
      let fjuroscategoria = ((this.taxas.jurosboleto) / 100);
      juroscategoria = Number(fjuroscategoria);
    }
    if (this.vendaForm.controls["fpagparcela"].value == 'CHEQUE') {
      let fjuroscategoria = ((this.taxas.juroscheque) / 100);
      juroscategoria = Number(fjuroscategoria);
    }
    //let qtdparcelas:number;
    for (let qtdparcelas = 7; qtdparcelas <= 24; qtdparcelas++) {
      let jurosparcela = Number(this.jurosParcelaNoFix(qtdparcelas));
      let taxaadicional = Number(this.taxas.taxaadicional);
      //=(((totfinanciado+((totfinanciado*juroscategoria)*qtdparcelas)/24)*(1+jurosparcela)^qtdparcelas)/qtdparcelas)+taxaadicional
      // let valparcelaf = (((totfinanciado + ((totfinanciado * juroscategoria) * qtdparcelas) / 24) * (1 + jurosparcela) ** qtdparcelas) / qtdparcelas) + taxaadicional;
      let valparcela = this.calculateParcela(totfinanciado, juroscategoria, qtdparcelas, jurosparcela, taxaadicional);
      let valtotal = valparcela * qtdparcelas;
      valparcela = this.tools.decimalFix(valparcela);
      valtotal = this.tools.decimalFix(valtotal);
      let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
      let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
      let desc = "" + qtdparcelas + "x de " + valpshow + "";
      let obj = {
        valparcela: valparcela,
        valtotal: valtotal,
        desc: desc,
        qtdparcelas: qtdparcelas
      }
      if (obj.valparcela >= 100) {
        arraycjuros.push(obj);
      }
      //    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    }
    for (let qtdparcelas = 1; qtdparcelas <= 6; qtdparcelas++) {
      let valparcela = totfinanciado / qtdparcelas;
      let valtotal = valparcela * qtdparcelas;
      valparcela = this.tools.decimalFix(valparcela);
      valtotal = this.tools.decimalFix(valtotal);
      let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
      let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
      let desc = "" + qtdparcelas + "x de " + valpshow + "";
      let obj = {
        valparcela: valparcela,
        valtotal: valtotal,
        desc: desc,
        qtdparcelas: qtdparcelas
      }
      if (obj.valparcela >= 100) {
        arraysjuros.push(obj);
      }
      //    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    }
    if (arraysjuros.length == 0) {
      let valparcela = totfinanciado / 1;
      let valtotal = valparcela * 1;
      valparcela = this.tools.decimalFix(valparcela);
      valtotal = this.tools.decimalFix(valtotal);
      let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
      let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
      let desc = "" + 1 + "x de " + valpshow + "";
      let obj = {
        valparcela: valparcela,
        valtotal: valtotal,
        desc: desc,
        qtdparcelas: 1
      }
      arraysjuros.push(obj);
    }
    console.log(arraysjuros);
    console.log(arraycjuros);
    this.arraycjuros = arraycjuros;
    this.arraysjuros = arraysjuros;
    let array = [];
    if (this.arraysjuros.length > 0) {
      let obj = {
        val: "SJUROS",
        desc: "ATÉ 6X SEM JUROS"
      }
      array.push(obj);
    }
    if (this.arraycjuros.length > 0) {
      let obj = {
        val: "CJUROS",
        desc: "ATÉ 24X"
      }
      array.push(obj);
    }
    this.tipoparcelamento = array;
    this.vendaForm.controls["parcelamento"].setValue('SJUROS');
    this.vendaForm.controls["qtdparcelas"].setValue(this.arraysjuros[0].qtdparcelas);
  }
  calc6Old() {
    let totfinanciado = this.vendaForm.controls["valorfinanciado"].value;
    let qtdparcelas = this.vendaForm.controls["qtdparcelas"].value;
    let juroscategoria: number = 0;
    if (this.vendaForm.controls["fpagparcela"].value == 'boleto') {
      let fjuroscategoria = ((this.taxas.jurosboleto) / 100);
      juroscategoria = Number(fjuroscategoria);
    }
    if (this.vendaForm.controls["fpagparcela"].value == 'cheque') {
      let fjuroscategoria = ((this.taxas.juroscheque) / 100);
      juroscategoria = Number(fjuroscategoria);
    }
    let calcbase = totfinanciado + (totfinanciado * juroscategoria);
    // calcbase = Number(calcbase.toFixed(2))
    let valsemjuros = calcbase;
    let valparcela = (Number(valsemjuros) / Number(qtdparcelas)) + Number(this.taxas.taxaadicional);
    //  valparcela = Number((valparcela).toFixed(2));
    let valtotal = Number(valparcela) * Number(qtdparcelas);
    let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    console.log(valshow);
    console.log(valpshow);
  }
  calc6() {
    let totfinanciado = this.vendaForm.controls["valorfinanciado"].value;
    let qtdparcelas = this.vendaForm.controls["qtdparcelas"].value;
    let valparcela = (Number(totfinanciado) / Number(qtdparcelas));
    //  valparcela = Number((valparcela).toFixed(2));
    let valtotal = Number(valparcela) * Number(qtdparcelas);
    valparcela = this.tools.decimalFix(valparcela);
    valtotal = this.tools.decimalFix(valtotal);
    console.log(valparcela);
    console.log(valtotal);
    let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    console.log(valshow);
    console.log(valpshow);
  }

  fixPercentage() {
    console.log(this.vendaForm.controls["desconto"].value);
    if (this.vendaForm.controls["desconto"].value > 100) {
      this.vendaForm.controls["desconto"].setValue(100);
    }
    if (this.vendaForm.controls["desconto"].value < 0) {
      this.vendaForm.controls["desconto"].setValue(0);
    }
    console.log(this.vendaForm.controls["desconto"].value);
  }
  inputAvaliacao() {
    if (this.prevavaliacao != this.vendaForm.controls["valoravaliacao"].value) {
      this.prevavaliacao = this.vendaForm.controls["valoravaliacao"].value;
      console.log(this.vendaForm.value);
      if (this.vendaForm.controls["valoravaliacao"].value > 0) {
        this.showcontent = 1;
      }
      else {
        this.showcontent = 0;
      }
      //this.vendaForm.controls["valorcomercial"].setValue(0);
      //this.vendaForm.controls["valorfinanciado"].setValue(0);
      this.totalentrada = 0;
      this.fentradas = [];
      this.vendaForm.controls["desconto"].setValue(0);
      this.prevdesc = 0;
      this.vendaForm.controls["valorentrada"].setValue(0);
      this.vendaForm.controls["valorcomercial"].setValue(this.vendaForm.controls["valoravaliacao"].value);
      this.vendaForm.controls["valorfinanciado"].setValue(this.vendaForm.controls["valoravaliacao"].value);
      this.vendaForm.controls["parcelamento"].setValue('SJUROS');
      this.vendaForm.controls["fpagparcela"].setValue('BOLETO');

      let tot = ((this.total - this.vendaForm.controls["valoravaliacao"].value) / this.total) * 100;
      console.log(tot);
      //this.calcDesconto();
      this.fixValues();
      this.setTotFin();
      this.calcPercent();
      this.objparcelamento();
      this.vendaForm.controls["qtdparcelas"].setValue(this.arraysjuros[0].qtdparcelas);
      console.log(this.vendaForm.controls["qtdparcelas"].value);
    }
  }
  // hasChequeCtrl(){
  // //   console.log(this.vendaForm.controls["hascheque"].value);
  //   if(this.vendaForm.controls["hascheque"].value == "s"){
  //     this.vendaForm.addControl("fpagentrada", new FormControl('Crédito na clínica', Validators.required));
  // //     console.log('Control added')
  //   }
  //   if(this.vendaForm.controls["hascheque"].value == "n"){
  //     if (this.vendaForm.controls["fpagentrada"]){
  //       this.vendaForm.removeControl("fpagentrada");
  // //       console.log('Control removed')
  //     }

  //   }
  // }

  setEntrada() {
    this.fixValues();
    this.setTotFin();
  }
  setTotFin() {
    let vcomercial = this.vendaForm.controls["valorcomercial"].value;
    let vfinanciado = vcomercial - this.totalentrada;
    if (vfinanciado < 0) {
      //this.vendaForm.controls["valorfinanciado"].setValue(0);
      this.vendaForm.controls["desconto"].setValue(0);
      this.calculateDesconto();
      alert("Valor de entrada maior que valor comercial");
    }
    else {
      this.vendaForm.controls["valorfinanciado"].setValue(vfinanciado);
    }
    console.log(this.vendaForm.controls["valorcomercial"].value);
    console.log(this.totalentrada);
    if (this.totalentrada > 0) {
      this.vendaForm.controls['valorentrada'].setValue(this.totalentrada);
      let entrada = Number(this.vendaForm.controls['valorentrada'].value);
      let comercial = Number(this.vendaForm.controls['valorcomercial'].value);
      let result = (entrada / comercial) * 100;
      console.log(result);
      // //console.log(result.toFixed(2));
      this.percdesc = this.tools.decimalFixNoRound(result);
      console.log(this.percdesc);
      if (result >= 40) {
        console.log('Maior que 40%');
        this.liberadoatd = true;
      }
      else {
        console.log('Menor que 40%');
        this.liberadoatd = false;
      }
    }
    else {
      this.vendaForm.controls['valorentrada'].setValue(0);
      if (this.vendaForm.controls['valorfinanciado'].value > 0) {
        console.log('Menor que 40%');
        this.liberadoatd = false;
      }
      else {
        console.log('Maior que 40%');
        this.liberadoatd = true;
      }

    }
    this.objparcelamento();
    // if (this.tipoparcelamento.length > 0) {
    //   this.vendaForm.controls["parcelamento"].setValue(this.tipoparcelamento.val);
    // }
  }
  fixValues() {
    let vcom = this.vendaForm.controls["valorcomercial"].value;
    let vent = this.totalentrada;
    if (vcom < vent) {
      alert("Valor da entrada maior que o valor comercial, recadastre a(s) entrada(s)")
      this.totalentrada = 0;
      this.fentradas = [];
    }
  }
  testForm() {
    console.log(this.vendaForm.valid);
    if (this.vendaForm.valid) {
      alert("Its valid");
    }
    else {
      alert("Its invalid");
    }
  }

  showContent() {
    alert("Working!");
  }
  menuNavigate(path: any) {
    if (path == 'venda') {
      this.router.navigate(['/financeiro']);
    }
    if (path == 'consulta') {
      this.router.navigate(['/consulta']);
    }
    if (path == 'jf') {
      this.router.navigate(['/jfvenda']);
    }

  }
  calcPercent() {
    if (this.produtos[0] != undefined) {
      console.log(this.produtos);
      let vala = this.vendaForm.controls["valorcomercial"].value;
      let sum: number = this.sumProdVal();
      let valb = Number(sum);
      let perc = (Number(vala / valb));
      // let value = this.tools.decimalFix(100 - Number(perc));
      // console.log(vala);
      console.log("Valor tabela: " + formatCurrency(valb, 'pt-BR', 'R$'));
      // console.log(valb);
      // console.log(perc);
      let value = 0;
      perc = 1 - perc;
      value = perc * 100;
      value = this.tools.decimalFix(value);
      if (value < 0) {
        value = 0;
      }
      //  this.vendaForm.controls["desconto"].setValue(value);
      this.discount = value;
      this.totalprodutos = sum;
      console.log(value);
      //let result = value + "%";
      // //console.log(result);

    }
  }

  sumProdVal() {
    if (this.produtos[0] != undefined) {
      let sum: number = 0;
      for (let i = 0; i < this.produtos.length; i++) {
        sum = this.tools.decimalFix(Number(sum) + Number(this.produtos[i].valor));
      }
      return sum;
    }
    else return 0;
  }

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
  }
  cpfValid(tipo: any) {
    // validate(cpf);
    if (tipo == 1) {
      const pcpf = this.vendaForm.controls["cpfpaciente"].value;
      if (pcpf.length > 0 && !validate(pcpf)) {
        this.vendaForm.controls["cpfpaciente"].setValue('');
        this.pacicpf.nativeElement.focus();
        alert("CPF do paciente inválido");
      }
    }
    if (tipo == 2) {
      const fcpf = this.vendaForm.controls["cpffiador"].value;
      if (fcpf.length > 0 && !validate(fcpf)) {
        this.vendaForm.controls["cpffiador"].setValue('');
        this.fiadcpf.nativeElement.focus();
        alert("CPF do fiador inválido")
      }
    }
    if (this.vendaForm.controls["isnotfiador"].value == true) {
      if (this.vendaForm.controls["cpfpaciente"].value == this.vendaForm.controls["cpffiador"].value) {
        this.vendaForm.controls["cpffiador"].setValue('');
        this.vendaForm.controls["cpfpaciente"].setValue('');
        this.pacicpf.nativeElement.focus();
        alert("CPF do fiador e paciente não podem ser iguais");
      }
    }
  }
  getUnidadeTable(unidade: any) {
    let result = ''
    if (unidade == 'ODC Nova Iguaçu I (Centro)') {
      result = 'prodni1'
    }
    if (unidade == 'ODC Nova Iguaçu II (Centro)') {
      result = 'prodni2'
    }
    if (unidade == 'ODC Nova Iguaçu III (Centro)') {
      result = 'prodni3'
    }
    if (unidade == 'ODC Nova Iguaçu IV (Centro)') {
      result = 'prodni4'
    }
    if (unidade == 'ODC Belford Roxo (Centro)') {
      result = 'prodbel'
    }
    if (unidade == 'ODC São João de Meriti (Centro)') {
      result = 'prodsjm'
    }
    if (unidade == 'ODC Vilar dos Teles (Centro)') {
      result = 'prodvilar'
    }
    if (unidade == 'ODC Pavuna (Centro)') {
      result = 'prodpav'
    }
    if (unidade == 'Partmed') {
      result = 'prodpartmed'
    }
    return result;
  }
  buscaProduto() {
    if (this.vendaForm.controls["buscaproduto"].value.length >= 3) {
      let unidade = this.getUnidadeTable(this.user.unidade);

      // if (this.user.unidade == 'Partmed'){
      //   unidade = 'prodni1'
      // }
      let search = {
        unidade: unidade,
        busca: this.vendaForm.controls["buscaproduto"].value
      }
      this.service.searchProdutos(search).subscribe(c => {
        console.log(c);
        if (c.Produtos.length > 0) {
          this.objbuscap = c.Produtos;
          console.log(this.objbuscap);
        }
        else {
          this.objbuscap = [];
        }
      },
        (error) => {
          this.objbuscap = [];
        });
    }
    if (this.vendaForm.controls["buscaproduto"].value.length < 3) {
      this.objbuscap = [];
    }
  }
  addProduto(produto: any, index: any) {
    //this.produtos.tipo = 'tbl';
    this.produtos.push(this.objbuscap[index]);
    console.log(this.produtos);
    this.objbuscap = [];
    this.vendaForm.controls["buscaproduto"].setValue('');
    this.vendaForm.controls["desconto"].setValue(0);
    this.inputAvaliacao();
    this.calcPercent();
    // this.calcDesconto();
  }
  excluiProduto(index: any) {
    if (this.produtos[index].produto == 'EMG') {
      this.prodemg = 0;
    }
    this.produtos.splice(index, 1);
    console.log(this.produtos);
    // //    console.log(this.produtos[0]);
    this.vendaForm.controls["desconto"].setValue(0);
    // //console.log(this.produtos[0].valor);
    this.inputAvaliacao();
    this.calcPercent();
    if (this.produtos[0] == undefined) {
      this.discount = 0;
      this.vendaForm.controls["valorcomercial"].setValue(0);
      this.vendaForm.controls["valoravaliacao"].setValue(0);
      this.vendaForm.controls["valorfinanciado"].setValue(0);
      this.vendaForm.controls["desconto"].setValue(0);
      this.fentradas = [];
      this.totalentrada = 0;
    }
  }
  showProdList() {
    let unidade = this.getUnidadeTable(this.user.unidade);
    let obj = {
      unidade: unidade
    };
    this.service.getProdutosByUnidade(obj).subscribe(u => {
      console.log(u);
      let produtos = u.Produtos;
      let modaltxt = "Listagem de Produtos da Unidade " + this.user.unidade;
      const dialogRef = this.dialog.open(ModalprodlistComponent, {
        data: {
          produtos: produtos,
          modaltxt: modaltxt
        },
        panelClass: 'modalprodlist'
      });

    })
  }
  showEntrada() {
    if (this.vendaForm.controls["valorcomercial"].value > 0) {
      let vm = this.vendaForm.controls["valorcomercial"].value;
      const dialogRef = this.dialog.open(ModalentradaComponent, {
        data: {
          entradas: this.entradas,
          financiadores: this.financiadores,
          fentradas: this.fentradas,
          totalentrada: this.totalentrada,
          totalentradajf: this.totalentradajf,
          valorcomercial: vm
        },
        panelClass: 'newprodutomodal'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        this.fentradas = result.entradas;
        this.totalentrada = result.totalentrada;
        this.totalentradajf = result.totalentradajf;
        this.setEntrada();
      });
    }
    else {
      alert("Preencha o valor da avaliação");
    }
  }
  procEmergencialModal() {
    const dialogRef = this.dialog.open(ModalemergencialComponent, {
      data: {

      },
      panelClass: 'newprodutomodal'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.produtos.push(result);
        console.log(this.produtos);
        this.objbuscap = [];
        this.vendaForm.controls["buscaproduto"].setValue('');
        this.vendaForm.controls["desconto"].setValue(0);
        this.inputAvaliacao();
        this.calcPercent();
        this.prodemg = 1;
      }
    })
  }
  clearFormVenda() {
    this.vendaForm.reset();
    this.vendaForm.controls["isnotfiador"].setValue(false);
  }
  resetFiador() {
    const pacientecontrol = this.vendaForm.get("isnotfiador").value;
    console.log(pacientecontrol);
    if (this.vendaForm.controls["isnotfiador"].value == true) {
      this.vendaForm.addControl("cpffiador", new FormControl('', Validators.required));
      this.vendaForm.addControl("fiador", new FormControl('', Validators.required));
    }

    else {
      if (this.vendaForm.controls["cpfpaciente"].value.length > 0 && !validate(this.vendaForm.controls["cpfpaciente"].value)) {
        this.pacicpf.nativeElement.focus();
        this.vendaForm.controls["cpfpaciente"].setValue('');
      }
      this.vendaForm.removeControl("fiador");
      this.vendaForm.removeControl("cpffiador");
    }
  }

  newVenda() {
    this.vendalayout = 1;
  }

  getSessionItem() {
    //let temp: any = sessionStorage.getItem('login');
    //this.user = JSON.parse(temp);
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    this.user = {
      nome: checktoken.nome,
      username: checktoken.username,
      unidade: checktoken.unidade
    }
    this.unidade = checktoken.unidade;
    console.log(this.role);
    console.log(this.user);
    console.log(this.user.nome);
    console.log(token);

  }

  saveVenda() {
    console.log(this.vendaForm);
    // if (this.vendaForm.controls["isnotfiador"].value == false) {
    //   this.vendaForm.controls["cpfpaciente"].setValue(this.vendaForm.controls["cpffiador"].value);
    // }
    let valparcela;
    let qtdparcelas;
    let fpagparcela;
    let parcelamento;

    if (this.vendaForm.valid && this.produtos.length > 0) {
      let cpff = this.vendaForm.controls["cpfpaciente"].value;
      let cpfp = this.vendaForm.controls["cpfpaciente"].value;
      let nomefiad = this.vendaForm.controls["cliente"].value;
      let nomepaci = this.vendaForm.controls["cliente"].value;
      if (this.vendaForm.controls["isnotfiador"].value == true) {
        cpff = this.vendaForm.controls["cpffiador"].value;
        nomefiad = this.vendaForm.controls["fiador"].value;
      }

      let warning;
      console.log(this.liberadoatd);
      if (this.liberadoatd == true) {
        warning = {
          code: 1,
          msg: "Cliente liberado para iniciar o tratamento"
        };
      }
      else {
        warning = {
          code: 0,
          msg: "ATENÇÃO: Cliente só será liberado para iniciar o tratamento mediante ao pagamento de 40% do valor do valor total"
        };
      }
      if (this.vendaForm.controls["valorcomercial"].value > 0 && this.vendaForm.controls["valorfinanciado"].value == 0) {
        valparcela = 0;
        qtdparcelas = 0;
        fpagparcela = '';
        parcelamento = '';

      }
      else {
        let qtdp = this.vendaForm.controls["qtdparcelas"].value;
        let parcindex: any;
        let arrparcela;
        let parc;
        if (this.vendaForm.controls["parcelamento"].value == 'SJUROS') {
          arrparcela = this.arraysjuros;
          parc = 'SJUROS'
          parcindex = qtdp - 1;
        }
        if (this.vendaForm.controls["parcelamento"].value == 'CJUROS') {
          arrparcela = this.arraycjuros;
          parc = 'CJUROS'
          parcindex = qtdp - 7;
        }
        qtdparcelas = qtdp;
        // console.log(parcindex);
        // console.log(arrparcela);
        valparcela = arrparcela[parcindex].valparcela;
        fpagparcela = this.vendaForm.controls["fpagparcela"].value;
        parcelamento = parc;
      }
      // let text = "Confirma os dados abaixo?"
      // let paciente = this.vendaForm.controls["cliente"].value;
      // let cpfp = this.vendaForm.controls["cpfpaciente"].value;
      // let cpff = this.vendaForm.controls["cpffiador"].value;
      // let docf = this.vendaForm.controls["docfinanceiro"].value;
      // let doco = this.vendaForm.controls["docodc"].value;
      // let valortotal = this.vendaForm.controls["valortotal"].value;
      // let financiador = this.vendaForm.controls["tipo"].value;
      // let cpffiador;
      // let cpfpaciente;
      // if (this.vendaForm.controls["isnotfiador"].value == false) {
      //   cpffiador = this.vendaForm.controls["cpffiador"].value;
      //   cpfpaciente = this.vendaForm.controls["cpffiador"].value;
      // }
      // else {
      //   cpffiador = this.vendaForm.controls["cpffiador"].value;
      //   cpfpaciente = this.vendaForm.controls["cpfpaciente"].value;
      // }

      let myDate = new Date();
      let financiado = this.vendaForm.controls["valorfinanciado"].value;
      let valortotaljf = Number(this.totalentradajf) + Number(financiado);
      console.log(this.totalentradajf);
      const dialogRef = this.dialog.open(ModaljfComponent, {
        // panelClass: 'modalA',
        data: {
          text: "Confirme os dados da venda",
          paciente: nomepaci,
          fiador: nomefiad,
          cpfp: cpfp,
          cpff: cpff,
          docvenda: this.vendaForm.controls["docvenda"].value,
          valortotal: valortotaljf,
          valortabela: this.totalprodutos,
          valortotaljf: valortotaljf,
          financiador: 'BANCO JF',
          isnotfiador: this.vendaForm.controls["isnotfiador"].value,
          qtdparcelas: qtdparcelas,
          valorparcela: valparcela,
          fpagparcela: fpagparcela,
          parcelamento: parcelamento,
          valoravaliacao: this.vendaForm.controls["valoravaliacao"].value,
          valorfinanciado: this.vendaForm.controls["valorfinanciado"].value,
          valorcomercial: this.vendaForm.controls["valorcomercial"].value,
          desconto: this.vendaForm.controls["desconto"].value,
          produtos: this.produtos,
          entradas: this.fentradas,
          valentrada: this.totalentrada,
          warning: warning,
          funcionario: this.user.nome,
          user: this.user.username,
          unidade: this.user.unidade
        },
        panelClass: 'newprodutomodal'

      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
        if (result) {
          let obj = JSON.parse(JSON.stringify(result));
          this.sloader = 1;
          this.service.postVendaJfCreate(obj).subscribe(v => {
            console.log(v);
            if (v.stats == "ok") {
              this.sloader = 0;
              this.resetJfVenda();
              let venda = {
                id: v.id,
                cliente: obj.cliente,
                fiador: obj.fiador,
                cpfpaciente: obj.cpfpaciente,
                cpffiador: obj.cpffiador,
                docodc: obj.docodc,
                liberadoatd: obj.liberadoatd,
                financiador: obj.financiador,
                parcela: obj.parcela,
                isnotfiador: obj.isnotfiador,
                formapagparcela: obj.formapagparcela,
                tipoparcelamento: obj.tipoparcelamento,
                valortabela: obj.valortabela,
                valorparcela: obj.valorparcela,
                valoravaliacao: obj.valoravaliacao,
                valorfinanciado: obj.valorfinanciado,
                valorcomercial: obj.valorcomercial,
                valortotal: obj.valortotal,
                valortotaljf: obj.valortotaljf,
                valentrada: obj.valentrada,
                desconto: obj.desconto,
                funcionario: obj.funcionario,
                produtos: obj.produtos,
                entradas: obj.entradas,
                countprodutos: obj.countprodutos,
                countentradas: obj.countentradas,
                unidade: obj.unidade,
                createdat: new Date(),
                createdby: obj.user
              }
              alert("Venda cadastrada com sucesso");
              const dialogRefa = this.dialog.open(ModalcontratojfComponent, {
                data: {
                  venda: venda
                },
                panelClass: 'modalprintreq'
              });
              dialogRefa.afterClosed().subscribe(rescontr => {
                console.log(rescontr);
              });

            }
            else {
              this.sloader = 0;
              alert("Erro ao cadastrar venda");
            }
          },
            (error) => {
              console.log(error);
              this.sloader = 0;
              alert("Erro ao cadastrar venda");
            });
        }
      });
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  resetJfVenda() {
    if (this.vendaForm.controls["isnotfiador"].value == true) {
      this.vendaForm.removeControl("cpffiador");
      this.vendaForm.removeControl("fiador");
    }
    this.vendaForm.controls["isnotfiador"].setValue(false);
    this.vendaForm.controls["cliente"].setValue('');
    this.vendaForm.controls["cpfpaciente"].setValue('');
    this.vendaForm.controls["valoravaliacao"].setValue(0);
    this.vendaForm.controls["valorcomercial"].setValue(0);
    this.vendaForm.controls["buscaproduto"].setValue('');
    this.vendaForm.controls["docvenda"].setValue('');
    this.vendaForm.controls["desconto"].setValue(0);
    this.vendaForm.controls["valorentrada"].setValue(0);
    this.vendaForm.controls["valorfinanciado"].setValue(0);
    this.vendaForm.controls["fpagparcela"].setValue('BOLETO');
    this.vendaForm.controls["parcelamento"].setValue('SJUROS');
    this.vendaForm.controls["qtdparcelas"].setValue('');
    this.vendaForm.controls["isnotfiador"].setValue(false);
    this.produtos = [];
    this.fentradas = [];
    this.totalentrada = 0;
    this.liberadoatd = false;
    this.showcontent = 0;
    this.prevdesc = 0;
    this.prevavaliacao = 0;
    this.prodemg = 0;
  }
  validNome(input: string) {
    let fcontrol = this.vendaForm.controls[input];
    console.log(fcontrol.value);
    let hasnumber = this.tools.stringContainsNumber(fcontrol.value);
    if (hasnumber == true) {
      fcontrol.setValue('');
    }
  }
}








