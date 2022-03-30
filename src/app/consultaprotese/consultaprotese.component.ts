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
import { ModaldetailsosComponent } from './modaldetailsos/modaldetailsos.component';
import { ModalupdateosComponent } from './modalupdateos/modalupdateos.component';

@Component({
  selector: 'app-consultaprotese',
  templateUrl: './consultaprotese.component.html',
  styleUrls: ['./consultaprotese.component.scss']
})

export class ConsultaproteseComponent implements OnInit {
  userForm: FormGroup;
  foundcliente: any;
  objvendedor: any = [];
  role: any;
  user: any;
  buscaForm: any;
  today: any;
  thisday: any;
  ordemlist: any = [];
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
      labinput: new FormControl(''),
      typesearch: new FormControl(false),
      cpf: new FormControl(''),
      documento: new FormControl(''),
      nos: new FormControl(''),
      unidade: new FormControl('todas')
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
    let fileName = 'download.csv';
    let columnNames = ["id", "cliente", "cpf_fiador", "cpf_paciente", "fiador", "valor_total", "data_venda", "doc_financeiro", "doc_odc", "financiador", "usuario", "unidade"];
    let header = columnNames.join(';');

    let csv = header;
    csv += '\r\n';

    this.ordemlist.map((c: { [x: string]: any; }) => {
      csv += [c["id"], c["cliente"], c["cpffiador"], c["cpfpaciente"], c["isnotfiador"], c["valortotal"], c["createdat"], c["docfinanceiro"], c["docodc"], c["financiador"], c["createdby"], c["unidade"]].join(';');
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
    let dta = this.buscaForm.controls["dtinicio"].value;
    let dtb = this.buscaForm.controls["dtfim"].value;
    let cpf;
    let unidade;

    if (this.buscaForm.controls["laboratorio"].value == 'todos') {
      laboratorio = null;
      tlab = '';
    }

    if (this.buscaForm.controls["laboratorio"].value == 'outro') {
      laboratorio = this.buscaForm.controls["labinput"].value;
      tlab = 1;
    }

    if (this.buscaForm.controls["laboratorio"].value != 'outro' && this.buscaForm.controls["laboratorio"].value != 'todos') {
      laboratorio = this.buscaForm.controls["laboratorio"].value;
      tlab = 0;
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

    let params = {
      dta: dta,
      dtb: dtb,
      // tipodata: 'cadastro',
      laboratorio: laboratorio,
      tlab: tlab,
      cpf: cpf,
      unidade: unidade
    }
    return params;
  }

  getOs() {
    this.ordemlist = [];
    let tipobusca = this.buscaForm.controls["typesearch"].value;
    if (tipobusca == false) {
      if (this.buscaForm.valid == true) {
        this.sloader = 1;
        const obj = this.searchParams();
        this.service.postOrdemDeServicoReadM(obj).subscribe(o => {
          console.log(o);
          this.ordemlist = o.ordens;
          console.log(this.ordemlist);
          this.sloader = 0;
        },
          (error) => {
            console.log(error);
            this.ordemlist = [];
            this.sloader = 0;
          });
      }
      else {
        alert("Defina as datas da busca");
      }
    }
    if (tipobusca == true) {
      this.sloader = 1;
      const obj = {
        id: this.buscaForm.controls["nos"].value
      }
      this.service.postOrdemDeServicoReadS(obj).subscribe(o => {
        console.log(o);
        this.ordemlist = o.ordens;
        console.log(this.ordemlist);
        this.sloader = 0;
      },
        (error) => {
          console.log(error);
          this.ordemlist = [];
          this.sloader = 0;
        });
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
      this.ordemlist = v.Vendas;
      let valtotal = 0;
      let countvendas = 0;
      for (let i = 0; i < this.ordemlist.length; i++) {
        countvendas++;
        valtotal = this.ordemlist.valortotal + valtotal;
        valtotal = this.decimalFix(valtotal);
      }
      this.valtotvendas = valtotal;
      this.countvendas = countvendas;
      console.log(this.ordemlist);
      this.showcomp = 0;
    },
      (error) => {
        console.log(error);
        this.sloader = 0;
        alert("Erro ao buscar vendas");
      });
  }

  detailsOs(index: any) {
    let ordem = this.ordemlist[index];
    const dialogRef = this.dialog.open(ModaldetailsosComponent, {
      data: {
        ordem: ordem
      },
      panelClass: 'modaldetails'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  updateOs(index: any) {
    let produtos = this.ordemlist[index].produtos;
    const dialogRef = this.dialog.open(ModalupdateosComponent, {
      data: {
        produtos: produtos,
        user: this.user
      },
      panelClass: 'modaldetails'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let json = {
          obj: result.data
        }
        // obj.count = result.count;
        console.log(json);
        this.sloader = 1;
        this.service.postOrdemDeServicoProdUpdt(json).subscribe(p => {
          console.log(p);
          if (p.stats == 'ok') {
            alert("Datas atualizadas com sucesso")
            this.ordemlist[index].produtos = result.obj;
            this.sloader = 0;
          }
          if (p.stats == 'error') {
            alert("Erro ao atualizar as datas")
            // this.ordemlist[index].produtos = result.obj;
            this.sloader = 0;
          }
        },
          (error) => {
            console.log(error);
            alert("Erro ao atualizar as datas")
            // this.ordemlist[index].produtos = result.obj;
            this.sloader = 0;
          });
      }
    });
  }

  // detailsVendaJF(index: any) {
  //   let venda = this.ordemlist[index];
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


