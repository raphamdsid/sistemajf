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

@Component({
  selector: 'app-relatorioprotese',
  templateUrl: './relatorioprotese.component.html',
  styleUrls: ['./relatorioprotese.component.scss']
})
export class RelatorioproteseComponent implements OnInit {
  userForm: FormGroup;
  foundcliente: any;
  objvendedor: any = [];
  role: any;
  user: any;
  buscaForm: any;
  protEntrForm: any;
  tabindex: number = 0;
  today: any;
  thisday: any;
  prodoslist: any = [];
  prodosblist: any = [];
  showcomp: any = 0;
  compindex: any;
  pwd: any;
  valtotvendas: number = 0;
  countvendas: number = 0;
  valor: any;
  financiadores: any = [];
  laboratorios: any = [];
  sloader: any = 0;
  showlabinput: number = 0;
  count: number = 0;
  total: number = 0;
  countb: number = 0;
  totalb: number = 0;
  dta: any;
  dtb: any;
  dtentregaprot: any;
  labprot: any;
  endereco: any;
  bairro: any;
  ciduf: any;
  cidade: any;
  tel: any;
  dia: any;


  constructor(private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService, private http: HttpClient,
    private cepService: BuscaCepService, private auth: AuthService) {
    this.userForm = this.formBuilder.group({
    });
  }

  ngOnInit(): void {
    this.auth.isAuth();
    this.getSessionItem();
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.today = today;
    let thisday = new Date();
    this.thisday = thisday;
    console.log(formatDate(new Date(today), 'dd', 'pt-BR'));
    console.log(formatDate(new Date(today), 'MMMM', 'pt-BR'));
    console.log(formatDate(new Date(today), 'yyyy', 'pt-BR'));
    console.log(today);
    console.log(this.today);
    this.service.getLaboratorios().subscribe(f => {
      console.log(f)
      this.laboratorios = f;
    });

    this.buscaForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      laboratorio: new FormControl('todos'),
      tipodata: new FormControl('data_entrega'),
      labinput: new FormControl(''),
      unidade: new FormControl('todas')
    });
    this.protEntrForm = new FormGroup({
      dt: new FormControl(today, Validators.required),
      laboratorio: new FormControl('', Validators.required)
    });
  }
  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
  }

  showComprovante(show: any, index: any) {
    this.showcomp = show;
    this.compindex = index;
  }

  dummyFunction(any: any) {
    alert("Ainda não funciono!");
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


  showLoader(display: boolean) {
    if (display == true) {
      this.sloader = 1;
    }
    if (display == false) {
      this.sloader = 0;
    }
  }




  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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


  download() {
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
  inputLab() {
    if (this.buscaForm.controls["laboratorio"].value == 'outro') {
      this.showlabinput = 1;
    }
    else {
      this.showlabinput = 0;
    }
  }
  searchParams() {
    let laboratorio;
    let tlab;
    let tipodata = this.buscaForm.controls["tipodata"].value;
    let dta = this.buscaForm.controls["dtinicio"].value;
    let dtb = this.buscaForm.controls["dtfim"].value;
    this.dta = dta;
    this.dtb = dtb;
    // let cpf;
    let unidade;

    if (this.buscaForm.controls["laboratorio"].value == 'todos') {
      laboratorio = null;
      tlab = 'todos';
    }

    if (this.buscaForm.controls["laboratorio"].value == 'outro') {
      laboratorio = this.buscaForm.controls["labinput"].value;
      tlab = 1;
    }

    if (this.buscaForm.controls["laboratorio"].value != 'outro' && this.buscaForm.controls["laboratorio"].value != 'todos') {
      laboratorio = this.buscaForm.controls["laboratorio"].value;
      tlab = 0;
    }

    // if (this.buscaForm.controls["cpf"].value != '' && this.buscaForm.controls["cpf"].value != null) {
    //   cpf = this.buscaForm.controls["cpf"].value;
    // }
    // else {
    //   cpf = null;
    // }
    if (this.buscaForm.controls["unidade"].value != '' && this.buscaForm.controls["unidade"].value != null && this.buscaForm.controls["unidade"].value != "todas") {
      unidade = this.buscaForm.controls["unidade"].value;
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
    this.count = 0;
    this.total = 0;

    if (this.buscaForm.valid == true) {
      this.sloader = 1;
      const obj = this.searchParams();
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
        this.count = count;
        this.total = total;
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
  setAddress() {
    this.dia = new Date();
    if (this.user.unidade == 'ODC Nova Iguaçu I (Centro)') {
      this.endereco = 'Rua Otávio Tarquino Nº 173';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9400'
    }
    if (this.user.unidade == 'ODC Nova Iguaçu II (Centro)') {
      this.endereco = 'Rua Coronel Francisco Soares Nº 33 sala 101 e 102';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9401'
    }
    if (this.user.unidade == 'ODC Nova Iguaçu III (Centro)') {
      this.endereco = 'Av Governador Roberto Silveira Nº 529';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9405'
    }
    if (this.user.unidade == 'ODC Vilar dos Teles (Centro)') {
      this.endereco = 'Avenida Automovel Club Nº 2384 - Terreo';
      this.bairro = 'Jardim José Bonifácio';
      this.ciduf = 'São João de Meriti/RJ';
      this.cidade = 'São João de Meriti';
      this.tel = 'Telefone: (21) 2755-9403'
    }
    if (this.user.unidade == 'ODC Belford Roxo (Centro)') {
      this.endereco = 'Praça Getúlio Vargas Nº 12 - Loja';
      this.bairro = 'Centro';
      this.ciduf = 'Belford Roxo/RJ';
      this.cidade = 'Belford Roxo';
      this.tel = 'Telefone: (21) 2755-9404'
    }
    if (this.user.unidade == 'São João de Meriti (Centro)') {
      this.endereco = 'Rua da Matriz Nº 117';
      this.bairro = 'Centro';
      this.ciduf = 'São João de Meriti/RJ';
      this.cidade = 'São João de Meriti';
      this.tel = 'Telefone: (21) 2755-9402'
    }
    if (this.user.unidade == 'Partmed') {
      this.endereco = 'Travessa Irene Nº 35';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9420'
    }
  }
  printProtOs(): void {
    let todayf = this.protEntrForm.controls["dt"].value;
    let today = new Date(todayf + ' 00:00')
    let dia = formatDate(new Date(today), 'dd', 'pt-BR');
    let mes = formatDate(new Date(today), 'MMMM', 'pt-BR');
    let ano = formatDate(new Date(today), 'yyyy', 'pt-BR');
    let printContents, popupWin;
    printContents = document.getElementById('printprot')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Protocolo de Entrega</title>
          <style>
            .no-print{
              visibility: hidden;
            }
            
            #printarea {
              width: 270mm !important;
              visibility: visible !important;
              overflow: visible !important;
              background-color: rgb(255, 255, 255) !important;
              color: #000 !important;
              border: none !important;
              position: absolute !important;
              left: 0px !important;
              top: 0px !important;
              width: 100% !important;
              height: 100% !important;
              margin-left: 0px !important;
              margin-top: 0px !important;
              line-height: 1.5 !important;
              font-size: 14px !important;
              text-align: justify !important;
              border: solid !important;
              background-color: rgb(255, 255, 255) !important;
              width: 94% !important;
              height: 77% !important;
              color: #000 !important;
              position: fixed !important;
    
            }
            .pad {
              padding: 0.25rem !important;
            }
            .lfont {
                font-size: 8px !important;
            }
            
            .lpad5{
                padding-left: 2px !important;
                padding-right: 2px !important;
            }
            .rborder{
                border-right: solid 1px !important;
            }
            .lmarg0{
                margin-left: 0px !important;
                margin-right: 0px !important;
            }
            .lmarg5{
                margin-left: 5px !important;
                margin-right: 5px !important;
            }
            body {
              display: flex;
              flex-direction: column;
              min-height: 100vh;
              width: 270mm !important;
            }
            
            footer {
              width: 270mm !important;
              background-color: #efefef !important;
              position: fixed !important;
              margin-top: auto !important;
              bottom: 0 !important;
            }
            row {
              margin-left: 0px !important;
              margin-right: 0px !important;
            }
            .w100 {
                width: 100% !important;
            }
            
            .ulrow {
                border-bottom: solid 1px !important;
            }
          </style>
          <link rel="stylesheet" href="styles.css">
        </head>
         <body onload="window.print();window.close();">${printContents}
        </body>
    </html>`
    );
    // <body onload="window.print();window.close();">${printContents}
    popupWin!.document.close();
  }
  printProtOsB(): void {
    let todayf = this.protEntrForm.controls["dt"].value;
    let today = new Date(todayf + ' 00:00')
    let dia = formatDate(new Date(today), 'dd', 'pt-BR');
    let mes = formatDate(new Date(today), 'MMMM', 'pt-BR');
    let ano = formatDate(new Date(today), 'yyyy', 'pt-BR');
    let printContents, popupWin;
    printContents = document.getElementById('printprot')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Protocolo de Entrega</title>
          <style>
            .no-print{
              visibility: hidden;
            }
            
            #printprot {
              width: 270mm !important;
              visibility: visible !important;
              overflow: visible !important;
              background-color: rgb(255, 255, 255) !important;
              color: #000 !important;
              border: none !important;
              position: absolute !important;
              left: 0px !important;
              top: 0px !important;
              width: 100% !important;
              height: 100% !important;
              margin-left: 0px !important;
              margin-top: 0px !important;
              line-height: 1.5 !important;
              font-size: 14px !important;
              text-align: justify !important;
              border: solid !important;
              background-color: rgb(255, 255, 255) !important;
              width: 94% !important;
              height: 77% !important;
              color: #000 !important;
              position: fixed !important;
    
            }
            .pad {
              padding: 0.25rem !important;
            }
            .lfont {
                font-size: 8px !important;
            }
            
            .lpad5{
                padding-left: 2px !important;
                padding-right: 2px !important;
            }
            .rborder{
                border-right: solid 1px !important;
            }
            .lmarg0{
                margin-left: 0px !important;
                margin-right: 0px !important;
            }
            .lmarg5{
                margin-left: 5px !important;
                margin-right: 5px !important;
            }
            #container {
              width: 270mm;
            }

            .divfooter{
              position: fixed;
              height: 200px;
              width: 270mm;
              bottom: 0;
            }
            footer {
              position: fixed;
              height:200px;
              width: 270mm;
            }
            row {
              margin-left: 0px !important;
              margin-right: 0px !important;
            }
            .w100 {
                width: 100% !important;
            }
            
            .ulrow {
                border-bottom: solid 1px !important;
            }
            .empty-header, .empty-footer {
              height:100px
              }

          </style>
          <style media="print">
          </style>
          <link rel="stylesheet" href="styles.css">
         <body>${printContents}
         </body>
      </html>`
    );
    // <body onload="window.print();window.close();">${printContents}
    popupWin!.document.close();
  }
  getOsB() {
    this.prodosblist = [];
    this.setAddress();
    // this.count = 0;
    // this.total = 0;
    this.dtentregaprot = this.protEntrForm.controls["dt"].value;
    this.labprot = this.protEntrForm.controls["laboratorio"].value;
    if (this.protEntrForm.valid == true) {
      this.sloader = 1;
      const obj = {
        dt: this.protEntrForm.controls["dt"].value,
        laboratorio: this.protEntrForm.controls["laboratorio"].value,
        unidade: this.user.unidade
      }
      console.log(obj);
      this.service.searchProdutosOsProtocolo(obj).subscribe(o => {
        console.log(o);
        let result = o.Produtos;
        for (let x = 0; x < result.length; x++) {
          result[x].idos = result[x][0].idos;
          result[x].paciente = result[x][0].paciente;
          result[x].cpf = result[x][0].cpf;
        }
        // console.log(result);
        // let total: number = 0;
        // for (let x = 0; x < o.Produtos.length; x++) {
        //   total = total + Number(o.Produtos[x].valor);
        // }
        this.prodosblist = result;
        this.countb = Number(o.itemCount);
        // this.totalb = total;

        console.log(this.prodosblist);
        this.sloader = 0;
      },
        (error) => {
          console.log(error);
          this.prodosblist = [];
          this.sloader = 0;
        });
    }
    else {
      alert("Defina a data de entrega e o laboratório");
    }
  }

  getVendas() {
    this.sloader = 1;
    const obj = this.searchParams();
    console.log(obj);
    this.valtotvendas = 0;
    this.countvendas = 0;
    let json = JSON.stringify(obj);
    this.service.getVendaList(json).subscribe(v => {
      this.sloader = 0;
      console.log(v);
      this.prodoslist = v.Vendas;
      let valtotal = 0;
      let countvendas = 0;
      for (let i = 0; i < this.prodoslist.length; i++) {
        countvendas++;
        valtotal = this.prodoslist.valortotal + valtotal;
        valtotal = this.decimalFix(valtotal);
      }
      this.valtotvendas = valtotal;
      this.countvendas = countvendas;
      console.log(this.prodoslist);
      this.showcomp = 0;
    },
      (error) => {
        console.log(error);
        this.sloader = 0;
        alert("Erro ao buscar vendas");
      });
  }

  print() {
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
  // detailsVendaJF(index: any) {
  //   let venda = this.prodoslist[index];
  //   const dialogRefa = this.dialog.open(ModaldetailsjfComponent, {
  //     data: {
  //       venda: venda
  //     },
  //     panelClass: 'modaldetails'
  //   });
  //   dialogRefa.afterClosed().subscribe(result => {
  //     console.log(result);
  //   });
  // }


  // printComprovante(): void {
  //   let printContents, popupWin;
  //   printContents = document.getElementById('printcomprovante')!.innerHTML;
  //   popupWin = window.open('', '_blank');
  //   popupWin!.document.open();
  //   popupWin!.document.write(`
  //     <html>
  //       <head>
  //         <title>Comprovante</title>
  //         <style>
  //           .no-print {
  //             visibility: hidden;
  //           }
  //           .comprovante {
  //             font-size: 49px;
  //             line-height: 1;
  //             page-break-inside: avoid;
  //           }
  //         </style>
  //         <link rel="stylesheet" href="styles.css">
  //       </head>
  //   <body onload="window.print();window.close();">${printContents}
  //   </body>
  //     </html>`
  //   );
  //   popupWin!.document.close();
  // }

}


