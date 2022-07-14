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
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.scss']
})

export class RelatoriosComponent implements OnInit {
  userForm: FormGroup;
  relatorioForm: any;
  relatorioPlanoForm: any;
  relatorioAtrasadosForm: any;
  relatorioCaixaDiarioForm: any;
  relatorioPagamentosReceberForm: any;
  itemvenda: any;
  vendalist: any = [];
  atrasadoslist: any;
  caixalist: any;
  areceberlist: any = [];
  areceberpaglist: any = [];
  totcaixa: any;
  totareceber: any;
  objbuscav: any;
  objvendedor: any;
  operacao: Number = 1;
  totalvendas: number = 0;
  totalvalor: number = 0;
  dataa: any;
  datab: any;
  tabindex: number = 0;
  role: any;
  user: any;
  qtdatrasos: any;
  today: any;
  arraypag: any;
  unidade: any;
  thisday: any;
  caixadetails: any = [];
  caixapagamentos: any;
  cobrancadtinicio: any;
  cobrancadtfim: any;
  caixadiariodtinicio: any;
  caixadiariodtfim: any;
  contasreceberdtinicio: any;
  contasreceberdtfim: any;
  fpcredito: any = [];
  fpdebito: any = [];
  fpdinheiro: any = [];
  fprecorrente: any = [];
  fppaypal: any = [];
  fppicpay: any = [];
  fpcredz: any = [];
  fppix: any = [];
  showlancamentos: any = false;
  recebtot: any;
  caixaestornos: any = [];
  showrelatorioestorno: number = 0;
  totestorno: number = 0;
  buscaForm: any;
  dta: any;
  dtb: any;
  valtotvendas: number = 0;
  countvendas: number = 0;
  sloader: any = 0;
  @ViewChild('printarea', { static: false }) printarea!: ElementRef;
  printpath: any;
  financiadores: any = [];
  prodoslist: any = [];
  showlabinput: number = 0;
  buscaProteseExtForm: any;
  countprotex: number = 0;
  totalprotex: number = 0;
  laboratorios: any = [];
  unidlist: any = [];

  constructor(private tools: ToolsService, private auth: AuthService, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService,
    private router: Router) {

    this.userForm = this.formBuilder.group({

    });


  }

  ngOnInit(): void {
    this.auth.isAuth();
    this.getSessionItem();
    let role = this.auth.getRole();
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.today = today;
    let thisday = new Date();
    this.thisday = thisday;
    console.log(today);
    console.log(this.today);
    let test = 456.327;
    this.tools.unidList().subscribe(data => {
      for (let x = 0; x < data.length; x++) {
        if (data[x].ativo == 1) {
          this.unidlist.push(data[x]);
        }
      }
    });
    this.service.getFinanciadores().subscribe(f => {
      console.log(f)
      this.financiadores = f;
    });
    this.service.getLaboratorios().subscribe(f => {
      console.log(f)
      this.laboratorios = f;
    });
    let ctest = (Math.round(test * 100) / 100).toFixed(2);
    console.log("VALUE: " + ctest);
    this.printpath = window.location.origin + '/imprimir';
    this.buscaForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      valinicio: new FormControl(''),
      valfim: new FormControl(''),
      cpf: new FormControl(''),
      unidade: new FormControl('todas'),
      financiador: new FormControl('todos'),
      isvendedor: new FormControl(false),
      buscavendedor: new FormControl('', Validators.required)
    });

    this.relatorioForm = new FormGroup({
      dtinicio: new FormControl('', Validators.required),
      dtfim: new FormControl('', Validators.required),
      isvendedor: new FormControl(false),
      buscavendedor: new FormControl('', Validators.required)
    });
    this.relatorioPlanoForm = new FormGroup({
      dtinicio: new FormControl('', Validators.required),
      dtfim: new FormControl('', Validators.required),
      buscaplano: new FormControl('PRAMELHOR', Validators.required)
    })
    this.relatorioAtrasadosForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
    });
    this.relatorioCaixaDiarioForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
    });
    this.relatorioPagamentosReceberForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
    });
    this.buscaProteseExtForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      laboratorio: new FormControl('todos'),
      tipodata: new FormControl('data_entrega'),
      labinput: new FormControl(''),
      unidade: new FormControl('todas')
    });

    console.log(today);
    this.relatorioPlanoForm.controls["dtinicio"].setValue(today);
    this.relatorioPlanoForm.controls["dtfim"].setValue(today);
    this.relatorioForm.controls["dtinicio"].setValue(today);
    this.relatorioForm.controls["dtfim"].setValue(today);
    this.relatorioForm.controls["buscavendedor"].disable();
    this.objvendedor = [];
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

  decimalFix(val: any) {
    let value = Number((Math.round(val * 100) / 100).toFixed(2));
    return value;
  }

  resetRelatorios() {
    this.totalvendas = 0;
    this.totalvalor = 0;
    this.vendalist = [];
  }
  download() {
    let fileName = 'relatório.csv';
    let columnNames = ["id", "cliente", "cpf_paciente", "possui_fiador", "fiador", "cpf_fiador", "parcelas", "valor_total", "valor_atual", "valor_estornado", "data_venda", "doc_financeiro", "doc_odc", "financiador", "usuario", "unidade", "situacao"];
    let header = columnNames.join(';');

    let csv = header;
    csv += '\r\n';

    this.vendalist.map((c: { [x: string]: any; }) => {
      csv += [c["id"], c["cliente"], c["cpfpaciente"], c["isnotfiador"], c["fiador"], c["cpffiador"], c["parcela"], c["valortotal"], c["valoratual"], c["valorestorno"], c["createdat"], c["docfinanceiro"], c["docodc"], c["financiador"], c["createdby"], c["unidade"], c["stats"]].join(';');
      csv += '\r\n';
    })

    var blob = new Blob([csv], { type: "data:text/csv;charset=utf-8" });

    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  searchParams() {
    let vala;
    let valb;
    let dta = this.buscaForm.controls["dtinicio"].value;
    let dtb = this.buscaForm.controls["dtfim"].value;
    let cpf;
    let unidade;
    let financiador;

    if (this.buscaForm.controls["valinicio"].value != '' && this.buscaForm.controls["valinicio"].value != 0 && this.buscaForm.controls["valinicio"].value != null) {
      vala = this.buscaForm.controls["valinicio"].value;
    }
    else {
      vala = null;
    }
    if (this.buscaForm.controls["valfim"].value != '' && this.buscaForm.controls["valfim"].value != 0 && this.buscaForm.controls["valfim"].value != null) {
      valb = this.buscaForm.controls["valfim"].value;
    }
    else {
      valb = null;
    }
    if (this.buscaForm.controls["cpf"].value != '' && this.buscaForm.controls["cpf"].value != null) {
      cpf = this.buscaForm.controls["cpf"].value;
    }
    else {
      cpf = null;
    }
    if (this.buscaForm.controls["unidade"].value != '' && this.buscaForm.controls["unidade"].value != null && this.buscaForm.controls["unidade"].value != "todas") {
      unidade = this.buscaForm.controls["unidade"].value;
    }
    else {
      unidade = null;
    }
    if (this.buscaForm.controls["financiador"].value != '' && this.buscaForm.controls["financiador"].value != null && this.buscaForm.controls["financiador"].value != "todos") {
      financiador = this.buscaForm.controls["financiador"].value;
    }
    else {
      financiador = null;
    }

    let params = {
      dta: dta,
      dtb: dtb,
      vala: vala,
      valb: valb,
      cpf: cpf,
      unidade: unidade,
      financiador: financiador
    }
    return params;
  }
  //   printDiv(divName: any) {
  //     var printContents = document.getElementById(divName).innerHTML;
  //     var originalContents = document.body.innerHTML;

  //     document.body.innerHTML = printContents;

  //     window.print();

  //     document.body.innerHTML = originalContents;
  // }
  // **WORKS**
  //  printpage()
  //     {
  // //       console.log('working');
  //          var originalContents = document.body.innerHTML;
  //          var printReport= document.getElementById('printarea')!.innerHTML;
  //          document.body.innerHTML = printReport;
  //          window.print();
  //          this.ngOnInit();
  //          document.body.innerHTML = originalContents;
  //      }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printarea')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Relatório</title>
          <style>
            .no-print {
              visibility: hidden;
            }
            .table {
              font-size:12px;
            }
            .pad {
              padding: 0.25rem !important;
            }
            .lfont{
              font-size: 8px;
            }
            .pa {
              font-size:15px;
              margin-left:2px;
              position:absolute;
            }
          </style>
          <link rel="stylesheet" href="styles.css">
        </head>
    <body onload="window.print();window.close()">${printContents}
    </body>
      </html>`
    );
    popupWin!.document.close();
  }
  printNew(): void {
    let printContents = document.getElementById('printarea')!.innerHTML;
    const data = {
      html: printContents,
    };

    this.router.navigate(['relatorios/imprimir', { data: printContents }, '_blank']);
  }
  printNewb(): void {
    let rota: any = 'relatorios/imprimir';
    let printContents = document.getElementById('printarea')!.innerHTML;
    const data = {
      html: printContents,
    };

    const rotas = this.router.navigate(['relatorios/imprimir', { data: printContents }]);
    //  const link = this.router.serializeUrl(this.router.createUrlTree('relatorios/imprimir',{data}));

    //  window.open(link, '_blank');
  }
  printpage() {

    ///var originalContents = document.body.innerHTML;
    console.log(window.location.href);
    console.log(this.router.url);
    let printroute = window.location.href + '/imprimir'
    console.log(printroute);
    console.log(this.printarea);
    // console.log(document.getElementById('printarea')!.innerHTML);
    var printReport = document.getElementById('printarea')!.innerHTML;

    var w = window.open(printroute, '_blank');
    w!.document.body.innerHTML = printReport;
    // var newWindow = window.open(printReport);
    w!.focus();
    w!.print();
    w!.close();

    //document.body.innerHTML = originalContents;
  }
  getVendas() {
    this.sloader = 1;
    this.vendalist = [];
    const obj = this.searchParams();
    this.dta = obj.dta;
    this.dtb = obj.dtb;
    this.valtotvendas = 0;
    this.countvendas = 0;
    let json = JSON.stringify(obj);
    this.service.getVendaList(json).subscribe(v => {
      this.sloader = 0;
      console.log(v);
      this.vendalist = v.Vendas;
      console.log(this.vendalist);
      this.vendalist = v.Vendas;
      let valtotal = 0;
      let countvendas = 0;
      for (let i = 0; i < this.vendalist.length; i++) {
        countvendas++;
        valtotal = Number(this.vendalist[i].valoratual) + Number(valtotal);
        valtotal = this.decimalFix(valtotal);
        if (this.vendalist[i].financiador == "BANCO JF") {
          this.vendalist[i].docfinanceiro = this.vendalist[i].id;
        }
      }
      console.log(valtotal);
      this.valtotvendas = valtotal;
      this.countvendas = countvendas;
      //this.showcomp = 0;
    });
  }
  getRelatorio() {
    if (this.operacao == 1) {
      this.getRelatorioList()
    }
    if (this.operacao == 2) {
      this.getRelatorioListByVend();
    }
  }

  getRelatorioListByPlano() {
    this.totalvendas = 0;
    this.totalvalor = 0;
    this.vendalist = [];
    let dta = this.relatorioPlanoForm.controls["dtinicio"].value;
    let dtb = this.relatorioPlanoForm.controls["dtfim"].value;
    let nome_plano = this.relatorioPlanoForm.controls["buscaplano"].value;
    this.service.getVendaListByPlano(dta, dtb, nome_plano).subscribe(c => {
      console.log(c);
      this.vendalist = c.venda;
      console.log(this.vendalist);
      this.totalvendas = this.vendalist.length;
      this.totalvalor = 0;
      for (let t = 0; t < this.vendalist.length; t++) {
        this.totalvalor = Number(this.totalvalor) + Number(this.vendalist[t].valor_total);

      }
    });
  }

  testOnload(c: any, ci: any) {
    console.log(c.cliente, ci);
    console.log("a");
  }

  getRelatorioList() {
    this.totalvendas = 0;
    this.totalvalor = 0;
    this.vendalist = [];
    let dta = this.relatorioForm.controls["dtinicio"].value;
    let dtb = this.relatorioForm.controls["dtfim"].value;
    const obj = {
      dta: dta,
      dtb: dtb
    }
    this.dataa = this.relatorioForm.controls["dtinicio"].value;
    this.datab = this.relatorioForm.controls["dtfim"].value;
    this.service.getVendaList(obj).subscribe(c => {
      console.log(c);
      this.vendalist = c.venda;
      console.log(this.vendalist);
      this.totalvendas = this.vendalist.length;
      this.totalvalor = 0;
      for (let t = 0; t < this.vendalist.length; t++) {
        this.totalvalor = Number(this.totalvalor) + Number(this.vendalist[t].valor_total);

      }
    });
  }


  getRelatorioListByVend() {
    this.totalvendas = 0;
    this.totalvalor = 0;
    this.vendalist = [];
    let dta = this.relatorioForm.controls["dtinicio"].value;
    let dtb = this.relatorioForm.controls["dtfim"].value;
    let ven = this.objvendedor.id;
    this.service.getVendaListByVendedor(dta, dtb, ven).subscribe(c => {
      console.log(c);
      this.vendalist = c.venda;
      console.log(this.vendalist);
      this.totalvendas = this.vendalist.length;
      for (let t = 0; t < this.vendalist.length; t++) {
        this.totalvalor = Number(this.totalvalor) + Number(this.vendalist[t].valor_total);
      }
    });
  }

  getRelatorioListAtrasados() {
    let dta = this.relatorioAtrasadosForm.controls["dtinicio"].value;
    let dtb = this.relatorioAtrasadosForm.controls["dtfim"].value;
    this.service.getVendaListAtrasos(dta, dtb).subscribe(v => {
      // //console.log(v.inadimplentes);
      // //console.log(v.pagatrasados);
      let inadimplentes = v.inadimplentes;
      let arraypag = v.pagatrasados;
      for (let i = 0; i < arraypag.length; i++) {
        let totparc = 0;
        let totatual = 0;
        for (let e = 0; e < arraypag[i].length; e++) {
          totparc = Number(totparc) + Number(arraypag[i][e].valparcela);
          totparc = this.decimalFix(totparc);
          let myDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
          let count = 0;
          let valatual = arraypag[i][e].valparcela;
          let dtvenci = new Date(arraypag[i][e].vencimento);
          let objhj = new Date(myDate);
          let hoje = objhj.setHours(objhj.getHours() + 4);
          let dtvencim = dtvenci.setHours(dtvenci.getHours() + 4);
          let dtvenc = new Date(dtvencim);
          for (let hj = new Date(hoje); hj > dtvenc;) {
            count = count + 1;
            valatual = valatual * 1.02;
            dtvenc = new Date(dtvenc.setMonth(dtvenc.getMonth() + 1));
            valatual = this.decimalFix(valatual);
          }
          arraypag[i][e].valatual = valatual;
          totatual = totatual + arraypag[i][e].valatual;
          totatual = this.decimalFix(totatual);
        }
        arraypag[i].totparc = totparc;
        arraypag[i].totatual = totatual;
      }
      console.log(arraypag);
      this.atrasadoslist = inadimplentes;
      this.arraypag = arraypag;
      this.qtdatrasos = v.countinadimplentes;
      this.cobrancadtinicio = this.relatorioAtrasadosForm.controls["dtinicio"].value;
      this.cobrancadtfim = this.relatorioAtrasadosForm.controls["dtfim"].value;
    });
  }


  getRelatorioCaixaDiario() {
    this.showrelatorioestorno = 0;
    this.caixapagamentos = [];
    this.caixaestornos = [];
    let dta = this.relatorioCaixaDiarioForm.controls["dtinicio"].value;
    let dtb = this.relatorioCaixaDiarioForm.controls["dtfim"].value;
    this.caixadiariodtinicio = this.relatorioCaixaDiarioForm.controls["dtinicio"].value;
    this.caixadiariodtfim = this.relatorioCaixaDiarioForm.controls["dtfim"].value;
    this.service.getVendaListCaixaDiarioSimple(dta, dtb).subscribe(v => {
      console.log(v);
      console.log(v.total);
      if (v.pagamentos != [] && v.pagamentos != undefined) {
        // this.caixapagamentos = v.pagamentos;
        let objpagamento = v.pagamentos;
        for (let i = 0; i < objpagamento.length; i++) {
          let tvcredito = this.decimalFix(objpagamento[i].valcredito);
          let tvdebito = this.decimalFix(objpagamento[i].valdebito);
          let tvdinheiro = this.decimalFix(objpagamento[i].valdinheiro);
          let tvcredz = this.decimalFix(objpagamento[i].valcredz);
          let tvpaypal = this.decimalFix(objpagamento[i].valpaypal);
          let tvpicpay = this.decimalFix(objpagamento[i].valpicpay);
          let tvrecorrente = this.decimalFix(objpagamento[i].valrecorrente);
          let tvpix = this.decimalFix(objpagamento[i].valpix);
          let ccredito = this.decimalFix(objpagamento[i].countcredito);
          let cdebito = this.decimalFix(objpagamento[i].countdebito);
          let cdinheiro = this.decimalFix(objpagamento[i].countdinheiro);
          let ccredz = this.decimalFix(objpagamento[i].countcredz);
          let cpaypal = this.decimalFix(objpagamento[i].countpaypal);
          let cpicpay = this.decimalFix(objpagamento[i].countpicpay);
          let crecorrente = this.decimalFix(objpagamento[i].countrecorrente);
          let cpix = this.decimalFix(objpagamento[i].countpix);
          let countcaixa = Number(ccredito) + Number(cdebito) + Number(cdinheiro) + Number(ccredz) + Number(cpaypal) + Number(cpicpay) + Number(crecorrente) + Number(cpix);
          let totalcaixa = Number(tvcredito) + Number(tvdebito) + Number(tvdinheiro) + Number(tvcredz) + Number(tvpaypal) + Number(tvpicpay) + Number(tvrecorrente) + Number(tvpix);
          totalcaixa = this.decimalFix(totalcaixa);
          objpagamento[i].ctotal = countcaixa;
          objpagamento[i].total = totalcaixa;
          // this.totcaixa = this.decimalFix(totalcaixa);
        }
        console.log(objpagamento);
        this.caixapagamentos = objpagamento;
      }
      if (v.estornos != [] && v.estornos != undefined) {
        // this.caixapagamentos = v.pagamentos;
        this.showrelatorioestorno = 1;
        this.totestorno = 0;
        let objestorno = v.estornos;
        let totestorno = 0;
        for (let i = 0; i < objestorno.length; i++) {
          objestorno[i].valpago = this.decimalFix(objestorno[i].valpago);
          totestorno = totestorno + objestorno[i].valpago;
          //totestorno = this.decimalFix(totestorno);
        }
        totestorno = this.decimalFix(totestorno);
        this.totestorno = totestorno;
        // this.totcaixa = this.decimalFix(totalcaixa);
        this.caixaestornos = objestorno;
        console.log(this.caixaestornos);
      }
      if (v.total != [] && v.total != undefined) {
        this.caixalist = v.total;

        let tvcredito = this.decimalFix(this.caixalist[0].valcredito);
        let tvdebito = this.decimalFix(this.caixalist[0].valdebito);
        let tvdinheiro = this.decimalFix(this.caixalist[0].valdinheiro);
        let tvcredz = this.decimalFix(this.caixalist[0].valcredz);
        let tvpaypal = this.decimalFix(this.caixalist[0].valpaypal);
        let tvpicpay = this.decimalFix(this.caixalist[0].valpicpay);
        let tvrecorrente = this.decimalFix(this.caixalist[0].valrecorrente);
        let tvpix = this.decimalFix(this.caixalist[0].valpix);
        let totalcaixa = Number(tvcredito) + Number(tvdebito) + Number(tvdinheiro) + Number(tvcredz) + Number(tvpaypal) + Number(tvpicpay) + Number(tvrecorrente) + Number(tvpix);
        this.totcaixa = this.decimalFix(totalcaixa);
        console.log(this.caixalist);
        console.log(this.totcaixa);
      }
      else {
        this.caixalist = [];
      }
      if (v.details != [] && v.details != undefined) {
        this.showlancamentos = true;
        this.caixadetails = v.details;
        console.log(this.caixadetails);
        this.fpcredito = this.caixadetails["Cartão de Crédito"];
        if (this.fpcredito != undefined) {
          let totalcred = 0;
          let count = 0;
          for (let i = 0; i < this.fpcredito.length; i++) {
            totalcred = Number(totalcred) + Number(this.fpcredito[i].valpago);
            totalcred = this.decimalFix(totalcred);
            count = i + 1;
          }
          this.fpcredito.total = totalcred;
          this.fpcredito.qtd = count;
        }
        else { this.fpcredito = [] }
        console.log(this.fpcredito);
        this.fpdebito = this.caixadetails["Cartão de Débito"];
        if (this.fpdebito != undefined) {
          let totaldeb = 0;
          let count = 0;
          for (let i = 0; i < this.fpdebito.length; i++) {
            totaldeb = Number(totaldeb) + Number(this.fpdebito[i].valpago);
            totaldeb = this.decimalFix(totaldeb);
            count = i + 1;
          }
          this.fpdebito.total = totaldeb;
          this.fpdebito.qtd = count;
        }
        else { this.fpdebito = [] }
        console.log(this.fpdebito);
        this.fpdinheiro = this.caixadetails["Dinheiro"];
        if (this.fpdinheiro != undefined) {
          let totaldinheiro = 0;
          let count = 0;
          for (let i = 0; i < this.fpdinheiro.length; i++) {
            totaldinheiro = Number(totaldinheiro) + Number(this.fpdinheiro[i].valpago);
            totaldinheiro = this.decimalFix(totaldinheiro);
            count = i + 1;
          }
          this.fpdinheiro.total = totaldinheiro;
          this.fpdinheiro.qtd = count;
        }
        else { this.fpdinheiro = [] }
        console.log(this.fpdinheiro);
        this.fprecorrente = this.caixadetails["Recorrente"];
        if (this.fprecorrente != undefined) {
          let totalrecorrente = 0;
          let count = 0
          for (let i = 0; i < this.fprecorrente.length; i++) {
            totalrecorrente = Number(totalrecorrente) + Number(this.fprecorrente[i].valpago);
            totalrecorrente = this.decimalFix(totalrecorrente);
            count = i + 1;
          }
          this.fprecorrente.total = totalrecorrente;
          this.fprecorrente.qtd = count;
        }
        else { this.fprecorrente = [] }
        console.log(this.fprecorrente);
        this.fppaypal = this.caixadetails["PayPal"];
        if (this.fppaypal != undefined) {
          let totalpaypal = 0;
          let count = 0;
          for (let i = 0; i < this.fppaypal.length; i++) {
            totalpaypal = Number(totalpaypal) + Number(this.fppaypal[i].valpago);
            totalpaypal = this.decimalFix(totalpaypal);
            count = i + 1;
          }
          this.fppaypal.total = totalpaypal;
          this.fppaypal.qtd = count;
        }
        else { this.fppaypal = [] }
        console.log(this.fppaypal);
        this.fppicpay = this.caixadetails["PicPay"];
        if (this.fppicpay != undefined) {
          let totalpicpay = 0;
          let count = 0;
          for (let i = 0; i < this.fppicpay.length; i++) {
            totalpicpay = Number(totalpicpay) + Number(this.fppicpay[i].valpago);
            totalpicpay = this.decimalFix(totalpicpay);
            count = i + 1;
          }
          this.fppicpay.total = totalpicpay;
          this.fppicpay.qtd = count;
        }
        else { this.fppicpay = [] }
        console.log(this.fppicpay);
        this.fpcredz = this.caixadetails["Credz"];
        if (this.fpcredz != undefined) {
          let totalcredz = 0;
          let count = 0;
          for (let i = 0; i < this.fpcredz.length; i++) {
            totalcredz = Number(totalcredz) + Number(this.fpcredz[i].valpago);
            totalcredz = this.decimalFix(totalcredz);
            count = i + 1;
          }
          this.fpcredz.total = totalcredz;
          this.fpcredz.qtd = count;
        }
        else { this.fpcredz = [] }
        console.log(this.fpcredz);
        this.fppix = this.caixadetails["Pix"];
        if (this.fppix != undefined) {
          let totalpix = 0;
          let count = 0;
          for (let i = 0; i < this.fppix.length; i++) {
            totalpix = Number(totalpix) + Number(this.fppix[i].valpago);
            totalpix = this.decimalFix(totalpix);
            count = i + 1;
          }
          this.fppix.total = totalpix;
          this.fppix.qtd = count;
        }
        else { this.fppix = [] }
        console.log(this.fppix);
        console.log(this.fpcredito);
        // //console.log(this.fpdebito);
      }
      else {
        this.showlancamentos = false
        this.caixadetails = [];
        this.fpcredito = [];
        this.fpdebito = [];
        this.fpdinheiro = [];
        this.fprecorrente = [];
        this.fppaypal = [];
        this.fppicpay = [];
        this.fppix = [];
      }

    });
  }
  getRelatorioContasReceber() {
    let dta = this.relatorioPagamentosReceberForm.controls["dtinicio"].value;
    let dtb = this.relatorioPagamentosReceberForm.controls["dtfim"].value;
    this.contasreceberdtinicio = this.relatorioPagamentosReceberForm.controls["dtinicio"].value;
    this.contasreceberdtfim = this.relatorioPagamentosReceberForm.controls["dtfim"].value;
    this.service.getVendaListContasReceber(dta, dtb).subscribe(v => {
      // //console.log(v);
      // //console.log(v.venda);
      let recebarray = v.venda;
      // //console.log(recebarray);
      // //console.log(recebarray[0]);
      if (recebarray != undefined && recebarray != []) {
        for (let i = 0; i < recebarray.length; i++) {
          let total = 0;
          for (let e = 0; e < recebarray[i].length; e++) {
            let val = Number(recebarray[i][e].valparcela);
            let value = this.decimalFix(val);
            total = total + value;
            total = this.decimalFix(total);
          }
          console.log(total);
          recebarray[i].total = total;
        }
        //this.areceberpaglist = this.areceberlist;
        let recebtot = 0
        for (let i = 0; i < recebarray.length; i++) {
          recebtot = this.decimalFix(Number(recebtot)) + this.decimalFix(Number(recebarray[i].total));
          recebtot = this.decimalFix(recebtot);
        }
        console.log(recebarray);
        this.areceberlist = recebarray;
        this.recebtot = recebtot;
        console.log(recebtot);
      }
      else {
        this.areceberlist = [];
      }
      //this.totareceber = total;
    });
  }
  calculaTotal() {

    alert("Total de vendas é: " + this.totalvalor);
  }

  buscaVendedorNome() {
    if (this.relatorioForm.controls["buscavendedor"].value.length >= 3) {
      this.service.getVendedorNome(this.relatorioForm.controls["buscavendedor"].value).subscribe(c => {
        console.log(c.Vendedores);
        this.objbuscav = c.Vendedores;
      }
      );
    }
    if (this.relatorioForm.controls["buscavendedor"].value.length < 3) {
      this.objbuscav = [];
    }
  }
  fillFormVendedor(ven: any, index: any) {
    // console.log(ven);
    this.objvendedor = this.objbuscav[index];
    console.log(this.objvendedor);
    this.objbuscav = []
    this.relatorioForm.controls["buscavendedor"].disable();
    this.relatorioForm.controls["buscavendedor"].setValue(this.objvendedor.nome.toUpperCase());
  }
  clearVendedor() {
    this.relatorioForm.controls["buscavendedor"].reset();
    this.relatorioForm.controls["buscavendedor"].enable();
    this.objbuscav = [];
    this.objvendedor = [];
  }
  setOperacao() {
    if (this.relatorioForm.controls["isvendedor"].value == false) {
      this.operacao = 1;
      this.relatorioForm.controls["buscavendedor"].disable();
      this.relatorioForm.controls["buscavendedor"].reset();
      this.objbuscav = [];
      this.objvendedor = [];
    }
    if (this.relatorioForm.controls["isvendedor"].value == true) {
      this.operacao = 2;
      this.relatorioForm.controls["buscavendedor"].enable();
      this.objbuscav = [];
      this.objvendedor = [];
    }
    console.log(this.relatorioForm.controls["isvendedor"].value)
    console.log(this.operacao);
    console.log(this.objvendedor);
  }
  downloadProtEx() {
    let fileName = 'produtos_os.csv';
    let columnNames = ["num_os", "doc_odc", "laboratorio", "paciente", "cpf", "produto", "valor", "qtd", "data_entrega", "data_recebimento", "unidade"];
    let header = columnNames.join(';');

    let csv = header;
    csv += '\r\n';

    this.prodoslist.map((c: { [x: string]: any; }) => {
      csv += [c["idos"], c["documento"], c["laboratorio"], c["paciente"], c["cpf"], c["produto"], c["valor"], c["qtd"], c["data_entrega"], c["data_recebimento"], c["unidade"]].join(';');
      csv += '\r\n';
    })

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8,%EF%BB%BF;" });

    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  printProtex() {
    let printContents, popupWin;
    printContents = document.getElementById('printarea')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Relatório</title>
          <style>
            .no-print {
              visibility: hidden;
            }
            .table {
              font-size:12px;
            }
            .pad {
              padding: 0.25rem !important;
            }
            .lfont{
              font-size: 8px;
            }
            .pa {
              font-size:15px;
              margin-left:2px;
              position:absolute;
            }
          </style>
          <link rel="stylesheet" href="styles.css">
        </head>
    <body onload="window.print();window.close()">${printContents}
    </body>
      </html>`
    );
    popupWin!.document.close();

  }

  inputLab() {
    if (this.buscaProteseExtForm.controls["laboratorio"].value == 'outro') {
      this.showlabinput = 1;
    }
    else {
      this.showlabinput = 0;
    }
  }
  searchParamsProteseEx() {
    let laboratorio;
    let tlab;
    let tipodata = this.buscaProteseExtForm.controls["tipodata"].value;
    let dta = this.buscaProteseExtForm.controls["dtinicio"].value;
    let dtb = this.buscaProteseExtForm.controls["dtfim"].value;
    this.dta = dta;
    this.dtb = dtb;
    // let cpf;
    let unidade;

    if (this.buscaProteseExtForm.controls["laboratorio"].value == 'todos') {
      laboratorio = null;
      tlab = 'todos';
    }

    if (this.buscaProteseExtForm.controls["laboratorio"].value == 'outro') {
      laboratorio = this.buscaProteseExtForm.controls["labinput"].value;
      tlab = 1;
    }

    if (this.buscaProteseExtForm.controls["laboratorio"].value != 'outro' && this.buscaProteseExtForm.controls["laboratorio"].value != 'todos') {
      laboratorio = this.buscaProteseExtForm.controls["laboratorio"].value;
      tlab = 0;
    }

    // if (this.buscaProteseExtForm.controls["cpf"].value != '' && this.buscaProteseExtForm.controls["cpf"].value != null) {
    //   cpf = this.buscaProteseExtForm.controls["cpf"].value;
    // }
    // else {
    //   cpf = null;
    // }
    if (this.buscaProteseExtForm.controls["unidade"].value != '' && this.buscaProteseExtForm.controls["unidade"].value != null && this.buscaProteseExtForm.controls["unidade"].value != "todas") {
      unidade = this.buscaProteseExtForm.controls["unidade"].value;
    }
    else {
      unidade = null;
    }

    let params = {
      dta: dta,
      dtb: dtb,
      tipodata: tipodata,
      laboratorio: laboratorio,
      tlab: tlab,
      // cpf: cpf,
      unidade: unidade
    }
    return params;
  }

  getOs() {
    this.prodoslist = [];
    this.countprotex = 0;
    this.totalprotex = 0;

    if (this.buscaProteseExtForm.valid == true) {
      this.sloader = 1;
      const obj = this.searchParamsProteseEx();
      this.service.searchProdutosOsB(obj).subscribe(o => {
        console.log(o);
        let total: number = 0;
        let count: number = 0;
        for (let x = 0; x < o.Produtos.length; x++) {
          if (Number(o.Produtos[x].qtd > 0)) {
            o.Produtos[x].total = Number(o.Produtos[x].valor) * Number(o.Produtos[x].qtd);
            total = total + Number(o.Produtos[x].total);
            count = count + Number(o.Produtos[x].qtd);
          }
          else {
            o.Produtos[x].total = 0;
          }
        }
        this.prodoslist = o.Produtos;
        this.countprotex = count;
        this.totalprotex = total;
        console.log(this.prodoslist);
        this.sloader = 0;
      },
        (error) => {
          console.log(error);
          this.prodoslist = [];
          this.sloader = 0;
        });
    }
    else {
      alert("Defina as datas da busca");
    }
  }
  // ***BACKUP DA FUNÇÃO***
  // getRelatorioListAtrasados() {
  //   let dta = this.relatorioAtrasadosForm.controls["dtinicio"].value;
  //   let dtb = this.relatorioAtrasadosForm.controls["dtfim"].value;
  //   this.service.getVendaListAtrasos(dta, dtb).subscribe(v => {
  // //     //console.log(v);
  //     this.arraypag = [];
  // //     console.log(v.venda);
  // //     console.log(v.itemCount);
  //     let list = v.venda;
  // //     //console.log
  //     let array: any = [];
  //     for (let i = 0; i < v.itemCount; i++) {
  //       let obj = {
  //         contrato: list[i].contrato,
  //         data: this.today,
  //         dta: dta,
  //         dtb: dtb
  //       };
  //       array.push(obj);
  //     }
  //     this.service.getContaListAtrasosByContrato(array).subscribe(p => {
  // //       console.log(p.pagamentos);
  //       let arrayf: any = [];
  //       let listpag = p.pagamentos;
  //       for (let a = 0; a < list.length; a++) {
  //         let arraypag: any = [];
  //         for (let b = 0; b < listpag.length; b++) {
  //           if (list[a].contrato == listpag[b].contrato) {
  //             arraypag.push(listpag[b]);
  //           }
  //           arrayf[a] = (arraypag);
  //         }
  //       }
  //       this.atrasadoslist = v.venda;
  //       this.qtdatrasos = v.itemCount;
  //       for (let d = 0; d < arrayf.length; d++) {
  //         let totparc = 0;
  //         let totatual = 0;
  //         for (let e = 0; e < arrayf[d].length; e++) {
  // //           //console.log(arrayf[d][e]);
  //           totparc = Number(totparc) + Number(arrayf[d][e].valparcela);
  //           totparc = this.decimalFix(totparc);
  //           let myDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  //           let count = 0;
  //           let valatual = arrayf[d][e].valparcela;
  //           let dtvenci = new Date(arrayf[d][e].vencimento);
  //           let objhj = new Date(myDate);
  //           let hoje = objhj.setHours(objhj.getHours() + 4);
  //           let dtvencim = dtvenci.setHours(dtvenci.getHours() + 4);
  //           let dtvenc = new Date (dtvencim);
  //           for (let hj = new Date(hoje); hj > dtvenc;) {
  // //             //console.log(hj);
  // //             //console.log(dtvenc);
  //             count = count + 1;
  // //            console.log(count);
  //             valatual = valatual * 1.02;
  //             dtvenc = new Date(dtvenc.setMonth(dtvenc.getMonth() + 1));
  // //             //console.log(dtvenc);
  //             valatual = this.decimalFix(valatual);
  //           }
  //           arrayf[d][e].valatual = valatual;
  //           totatual = totatual + arrayf[d][e].valatual;
  //           totatual = this.decimalFix(totatual);
  //           // this.contaatraso = count;

  //         }
  //         arrayf[d].totparc = totparc;
  //         arrayf[d].totatual = totatual;
  //       }
  // //       //console.log(arrayf);
  //       this.arraypag = arrayf;
  // //       console.log(this.arraypag);
  // //       //console.log(this.arraypag[0].totparc);
  //     });
  //   });
  // }



}
