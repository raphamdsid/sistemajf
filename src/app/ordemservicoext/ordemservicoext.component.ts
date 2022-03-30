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
import { ToolsService } from '../services/tools.service';
import { ModalconfirmordemservicoComponent } from './modalconfirmordemservico/modalconfirmordemservico.component';
import { ModalosprodutosComponent } from './modalosprodutos/modalosprodutos.component';

@Component({
  selector: 'app-ordemservicoext',
  templateUrl: './ordemservicoext.component.html',
  styleUrls: ['./ordemservicoext.component.scss']
})
export class OrdemservicoextComponent implements OnInit {
  userForm: FormGroup;
  role: any;
  user: any;
  unidade: any;
  ordemForm: any;
  vendalayout: number = 1;
  sloader: any;
  @ViewChild('pacientecpf', { static: false }) pacicpf: any;
  @ViewChild('fiadorcpf', { static: false }) fiadcpf: any;
  @ViewChild('teste', { static: false }) teste: any;
  objprint: any;
  today: Date = new (Date);
  financiadores: any = [];
  prazomsg: number = 0;
  prevdatea: any;
  prevdateb: any;
  laboratorios: any = [];
  produtos: any = [];
  produtolist: any = [];

  constructor(private router: Router, private auth: AuthService, public datepipe: DatePipe, private tools: ToolsService, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService) {
    this.userForm = this.formBuilder.group({

    });

  }

  ngOnInit(): void {
    this.service.getLaboratorios().subscribe(f => {
      console.log(f)
      this.laboratorios = f;
    });
    this.service.getProdOs().subscribe(f => {
      console.log(f)
      this.produtos = f;
    });
    this.auth.isAuth();
    this.getSessionItem();
    let role = this.auth.getRole();
    console.log(role);
    let testdate = new Date();
    this.sloader = 0;
    this.today = testdate;
    let today = new Date();
    let today15 = new Date();
    today15.setDate(today.getDate() + 15);
    let stoday = formatDate(today, 'yyyy-MM-dd', 'en');
    let stoday15 = formatDate(today15, 'yyyy-MM-dd', 'en');
    this.service.getFinanciadores().subscribe(f => {
      console.log(f)
      this.financiadores = f;
    });
    console.log(today);
    console.log(today15);
    this.ordemForm = new FormGroup({
      documento: new FormControl('', Validators.required),
      paciente: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      valor_contratado: new FormControl(0, Validators.required),
      custo_materiais: new FormControl(0, Validators.required),
      // data_envio: new FormControl(stoday, Validators.required),
      // data_recebimento: new FormControl(stoday15, Validators.required),
      laboratorio: new FormControl('', Validators.required),
      buscaproduto: new FormControl('')
    });
    // this.prevdatea = this.ordemForm.controls["data_envio"].value;
    // this.prevdateb = this.ordemForm.controls["data_recebimento"].value;
    // console.log(this.ordemForm.value);
  }
  testForm() {
    console.log(this.ordemForm.valid);
    if (this.ordemForm.valid) {
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
  setProdutos() {

  }
  showProdutosModal() {
    const dialogRef = this.dialog.open(ModalosprodutosComponent, {
      data: {
        // custo_materiais: this.ordemForm.controls["custo_materiais"],
        produtos: this.produtos,
        produtolist: this.produtolist
      },
      panelClass: 'newprodutomodal'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.produtolist = result.produtolist;
      this.ordemForm.controls["custo_materiais"].setValue(result.total);
      // this.setProdutos();
    });
  }

  saveOs() {
    if (this.ordemForm.valid == true && this.ordemForm.controls["valor_contratado"].value > 0) {
      if (this.produtolist.length > 0) {
        let ordem = {
          documento: this.ordemForm.controls["documento"].value,
          paciente: this.ordemForm.controls["paciente"].value,
          cpf: this.ordemForm.controls["cpf"].value,
          valor_contratado: this.ordemForm.controls["valor_contratado"].value,
          custo_materiais: this.ordemForm.controls["custo_materiais"].value,
          laboratorio: this.ordemForm.controls["laboratorio"].value,
          produtos: this.produtolist,
          unidade: this.user.unidade,
          user: this.user.username
        }
        console.log(ordem);
        const dialogRef = this.dialog.open(ModalconfirmordemservicoComponent, {
          panelClass: 'modaldetails',
          data: {
            ordem: ordem
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            let obj = result;
            console.log(result);
            this.sloader = 1;
            this.service.postOrdemDeServicoCreate(obj).subscribe(a => {
              console.log(a);
              if (a.stats == 'ok') {
                this.sloader = 0;
                this.resetForm();
                alert('Ordem de serviço cadastrada com sucesso');
              }
              else {
                this.sloader = 0;
                alert("Erro ao cadastrar ordem de serviço");
              }
            },
              (error) => {
                this.sloader = 0;
                console.log(error);
                alert("Erro ao cadastrar ordem de serviço");
              });
          }
        });
      }
      else {
        alert("Adicione algum produto para prosseguir")
      }
    }
    else {
      alert("Preencha todos os campos");
    }
  }
  resetForm() {
    // let today = new Date();
    // let today15 = new Date();
    // today15.setDate(today.getDate() + 15);
    // let stoday = formatDate(today, 'yyyy-MM-dd', 'en');
    // let stoday15 = formatDate(today15, 'yyyy-MM-dd', 'en');
    this.produtolist = [];
    this.ordemForm.controls["documento"].setValue('');
    this.ordemForm.controls["paciente"].setValue('');
    this.ordemForm.controls["cpf"].setValue('');
    this.ordemForm.controls["valor_contratado"].setValue(0);
    this.ordemForm.controls["custo_materiais"].setValue(0);
    // this.ordemForm.controls["data_envio"].setValue(stoday);
    // this.ordemForm.controls["data_recebimento"].setValue(stoday15);
    this.ordemForm.controls["laboratorio"].setValue('');
  }
  // dateFunction(op: any) {
  //   if (op == 0) {
  //     this.calculateDate();
  //     this.validateDate();
  //   }
  //   if (op == 1) {

  //   }
  // }

  dateFunction() {
    this.calculateDate();
    this.fixDates();
    this.validateDate();
  }

  calculateDate() {
    if (this.ordemForm.controls["data_envio"].value != this.prevdatea) {
      let dta = this.ordemForm.controls["data_envio"].value + ' 00:00';
      let tempdta = new Date(dta);
      tempdta.setDate(tempdta.getDate() + 15);
      let dtb = formatDate(tempdta, 'yyyy-MM-dd', 'en');
      this.ordemForm.controls["data_recebimento"].setValue(dtb);
      this.prevdatea = this.ordemForm.controls["data_envio"].value;
    }
  }
  fixDates() {
    if (this.ordemForm.controls["data_recebimento"].value < this.ordemForm.controls["data_envio"].value) {
      this.ordemForm.controls["data_recebimento"].setValue(this.ordemForm.controls["data_envio"].value);
      console.log("fixed!")
    }
  }
  validateDate() {
    let dta = this.ordemForm.controls["data_envio"].value + ' 00:00';
    let dtb = this.ordemForm.controls["data_recebimento"].value + ' 00:00';
    let tempdta = new Date(dta);
    let tempdtb = new Date(dtb);
    tempdta.setDate(tempdta.getDate() + 15);
    if (tempdtb <= tempdta) {
      this.prazomsg = 0;
    }
    if (tempdtb > tempdta) {
      this.prazomsg = 1;
    }
    console.log(tempdta);
    console.log(tempdtb);
    console.log(this.prazomsg);
  }
  dummyFunction(any: any) {

  }
  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
  }
  isCpfValid(tipo: any) {
    // validate(cpf);
    //const pcpf = this.ordemForm.controls["cpfpaciente"].value;
    const ccpf = this.ordemForm.controls["cpfcliente"].value;
    const fcpf = this.ordemForm.controls["cpffiador"].value;
    if (tipo == 1) {
      if (ccpf.length > 0 && !validate(ccpf)) {
        this.ordemForm.controls["cpfcliente"].setValue('');
        this.fiadcpf.nativeElement.focus();
        alert("CPF inválido")
      }
      //      this.ordemForm.controls["cpfpaciente"].setValue(this.ordemForm.controls["cpffiador"].value);

    }
    if (tipo == 2) {
      if (fcpf.length > 0 && !validate(fcpf)) {
        this.ordemForm.controls["cpffiador"].setValue(null);
        this.fiadcpf.nativeElement.focus();
        alert("CPF do fiador inválido")
      }
    }
  }
  cpfValid(tipo: any) {
    // validate(cpf);
    if (tipo == 1) {
      const pcpf = this.ordemForm.controls["cpfpaciente"].value;
      if (pcpf.length > 0 && !validate(pcpf)) {
        this.ordemForm.controls["cpfpaciente"].setValue('');
        this.pacicpf.nativeElement.focus();
        alert("CPF do paciente inválido")
      }

    }
    if (tipo == 2) {
      const fcpf = this.ordemForm.controls["cpffiador"].value;
      if (fcpf.length > 0 && !validate(fcpf)) {
        this.ordemForm.controls["cpffiador"].setValue('');
        this.fiadcpf.nativeElement.focus();
        alert("CPF do fiador inválido")
      }
    }
  }

  // saveVenda() {
  //   if (this.ordemForm.valid) {
  //     if (this.ordemForm.controls["valortotal"].value > 0) {
  //       // let text = "Confirma os dados abaixo?"
  //       // let paciente = this.ordemForm.controls["cliente"].value;
  //       // let cpfp = this.ordemForm.controls["cpfpaciente"].value;
  //       // let cpff = this.ordemForm.controls["cpffiador"].value;
  //       // let docf = this.ordemForm.controls["docfinanceiro"].value;
  //       // let doco = this.ordemForm.controls["docodc"].value;
  //       // let valortotal = this.ordemForm.controls["valortotal"].value;
  //       // let financiador = this.ordemForm.controls["tipo"].value;
  //       let myDate = new Date();
  //       let cpff = this.ordemForm.controls["cpfpaciente"].value;
  //       let cpfp = this.ordemForm.controls["cpfpaciente"].value;
  //       let nomefiad = this.ordemForm.controls["cliente"].value;
  //       let nomepaci = this.ordemForm.controls["cliente"].value;
  //       if (this.ordemForm.controls["isnotfiador"].value == true) {
  //         cpff = this.ordemForm.controls["cpffiador"].value;
  //         nomefiad = this.ordemForm.controls["fiador"].value;
  //       }

  //       const dialogRef = this.dialog.open(ModalaComponent, {
  //         panelClass: 'modaldetails',

  //         data: {
  //           text: "CONFIRME OS DADOS PARA FINALIZAR A VENDA",
  //           paciente: nomepaci,
  //           fiador: nomefiad,
  //           cpff: cpff,
  //           cpfp: cpfp,
  //           docf: this.ordemForm.controls["docfinanceiro"].value,
  //           doco: this.ordemForm.controls["docodc"].value,
  //           parcela: this.ordemForm.controls["parcela"].value,
  //           valortotal: this.ordemForm.controls["valortotal"].value,
  //           financiador: this.ordemForm.controls["financiador"].value,
  //           isnotfiador: this.ordemForm.controls["isnotfiador"].value,

  //         }
  //       });

  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log(`Dialog result: ${result}`);
  //         if (result) {
  //           this.sloader = 1;
  //           let parcelatxt: any;
  //           let valorparcela = this.decimalFix((this.ordemForm.controls["valortotal"].value / this.ordemForm.controls["parcela"].value));
  //           if (this.ordemForm.controls["parcela"].value == 1) {
  //             parcelatxt = "" + this.ordemForm.controls["parcela"].value + " parcela"
  //           }
  //           if (this.ordemForm.controls["parcela"].value > 1) {
  //             parcelatxt = "" + this.ordemForm.controls["parcela"].value + " parcelas"
  //           }
  //           let audittxt;
  //           if (this.ordemForm.controls["isnotfiador"].value == false) {
  //             audittxt = "Cadastro de venda do cliente: " + this.ordemForm.controls["cliente"].value + " - CPF: " + cpff + ", SEM FIADOR, no valor de " + formatCurrency(Number(this.ordemForm.controls["valortotal"].value,), 'pt-BR', 'R$') + ", " + parcelatxt + ", financiador: " + this.ordemForm.controls["financiador"].value + " na unidade " + this.user.unidade + "."
  //           }
  //           if (this.ordemForm.controls["isnotfiador"].value == true) {
  //             audittxt = "Cadastro de venda do cliente: " + this.ordemForm.controls["cliente"].value + " - CPF do Paciente: " + cpfp + " - Fiador: " + nomefiad + " - CPF do Fiador: " + cpff + ", no valor de " + formatCurrency(Number(this.ordemForm.controls["valortotal"].value,), 'pt-BR', 'R$') + ", financiador: " + this.ordemForm.controls["financiador"].value + " na unidade " + this.user.unidade + "."
  //           }
  //           let auditoperacao = "Cadastro";
  //           let auditobj = "Venda";
  //           let obj = {
  //             cliente: nomepaci,
  //             fiador: nomefiad,
  //             cpfpaciente: cpfp,
  //             cpffiador: cpff,
  //             docfinanceiro: this.ordemForm.controls["docfinanceiro"].value,
  //             docodc: this.ordemForm.controls["docodc"].value,
  //             parcela: this.ordemForm.controls["parcela"].value,
  //             valorparcela: valorparcela,
  //             valortotal: this.ordemForm.controls["valortotal"].value,
  //             isnotfiador: this.ordemForm.controls["isnotfiador"].value,
  //             financiador: this.ordemForm.controls["financiador"].value,
  //             createdat: myDate,
  //             user: this.user.username,
  //             funcionario: this.user.nome,
  //             unidade: this.user.unidade,
  //             auditoperacao: auditoperacao,
  //             auditobj: auditobj,
  //             audittxt: audittxt
  //           }
  //           let json = JSON.stringify(obj);
  //           this.service.postVendaCreate(json).subscribe(v => {
  //             this.sloader = 0;
  //             console.log(v);
  //             this.objprint = obj;
  //             console.log(obj);
  //             alert("Venda cadastrada com sucesso!");
  //             this.vendalayout = 2;
  //             this.resetVenda();
  //           },
  //             (error) => {
  //               this.sloader = 0;
  //               alert("Erro ao cadastrar venda");
  //             });
  //         }
  //       });
  //     }
  //     else {
  //       alert("Valor da venda não pode ser 0")
  //     }
  //   }
  //   else {
  //     alert("Preencha todos os campos");
  //   }

  // }
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
  decimalFix(val: any) {
    let value = Number((Math.round(val * 100) / 100).toFixed(2));
    return value;
  }
  printComprovante(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printcomprovante')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Comprovante</title>
          <style>
            .no-print {
              visibility: hidden;
            }
            .comprovante {
              font-size: 49px;
              line-height: 1;
              page-break-inside: avoid;
            }
          </style>
          <link rel="stylesheet" href="styles.css">
        </head>
    <body onload="window.print();window.close();">${printContents}
    </body>
      </html>`
    );
    popupWin!.document.close();
  }
  testSmth() {
    console.log((<HTMLInputElement>document.getElementById("teste")).value);
  }
  validNome(input: string) {
    let fcontrol = this.ordemForm.controls[input];
    console.log(fcontrol.value);
    let hasnumber = this.tools.stringContainsNumber(fcontrol.value);
    if (hasnumber == true) {
      fcontrol.setValue('');
    }
  }
}


