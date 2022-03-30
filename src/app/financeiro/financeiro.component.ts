import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import { formatDate, TitleCasePipe, DatePipe, formatCurrency } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { HttpClient } from '@angular/common/http';
import { ModalaComponent } from './modala/modala.component';
import { ModalbComponent } from './modalb/modalb.component';
import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";
import { ModalfinnComponent } from './modalfin/modalfin.component';
import { Router } from '@angular/router';
import { validate } from 'gerador-validador-cpf';
import { ToolsService } from '../services/tools.service';
import { ModalprodlistComponent } from '../jfvenda/modalprodlist/modalprodlist.component';
import { ModalemergencialComponent } from '../jfvenda/modalemergencial/modalemergencial.component';
import { ModalconfirmdescontoComponent } from '../jfvenda/modalconfirmdesconto/modalconfirmdesconto.component';
import { ModalfpagComponent } from './modalfpag/modalfpag.component';

@Component({
  selector: 'app-financeiro',
  templateUrl: './financeiro.component.html',
  styleUrls: ['./financeiro.component.scss']
})
export class FinanceiroComponent implements OnInit {
  userForm: FormGroup;
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
  objbuscap: any = [];
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
  retstr: string = 'return';
  venda: any;
  valor_parcela: any;
  valparcela: any;
  unidade: any;
  blckbtnpag: number = 0;
  showcancellabel: number = 0;
  showcancelbtn: number = 0;
  vendaForm: any;
  vendalayout: number = 1;
  sloader: any;
  nvendaForm: any;
  @ViewChild('pacientecpf', { static: false }) pacicpf: any;
  @ViewChild('fiadorcpf', { static: false }) fiadcpf: any;
  @ViewChild('teste', { static: false }) teste: any;
  objprint: any;
  today: Date = new (Date);
  financiadores: any = [];



  produtos: any = [];
  prodemg = 0;
  discount: number = 0;
  showcontent: number = 0;
  percdesc: any;
  tipoparcelamento: any = [];
  arraycjuros: any;
  arraysjuros: any;
  totalprodutos: number = 0;
  prevavaliacao: any = 0;
  totalentrada: any = 0;
  total: number = 0;
  prevdesc: number = 0;
  entradas: any = [];
  fentradas: any = [];
  liberadoatd: any = false;
  fpagarr: any = [];


  constructor(private router: Router, private auth: AuthService, public datepipe: DatePipe, private tools: ToolsService, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService) {
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
    this.sloader = 0;
    this.today = testdate;
    let myDate = formatDate(new Date(), 'yyyy-MM-dd : HH:mm', 'en');
    this.service.getFinanciadores().subscribe(f => {
      console.log(f)
      this.financiadores = f;
    });
    console.log(myDate);
    this.vendaForm = new FormGroup({
      cliente: new FormControl('', Validators.required),
      cpfpaciente: new FormControl('', Validators.required),
      // fiador: new FormControl('', Validators.required),
      // cpffiador: new FormControl('', Validators.required),
      parcela: new FormControl(1, Validators.required),
      docfinanceiro: new FormControl('', Validators.required),
      docodc: new FormControl('', Validators.required),
      valortotal: new FormControl(0, Validators.required),
      isnotfiador: new FormControl(false),
      financiador: new FormControl('', Validators.required)
    });
    this.nvendaForm = new FormGroup({
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




    //this.adesao='';
    //this.finForm.value.finnparcelas = 1;
    //this.priparcela = this.valorparcela;

    //  this.tNome='';
    // this.titNome='';


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

  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
  }
  fixParcela() {
    console.log('works');
    if (this.vendaForm.controls["parcela"].value !== parseInt(this.vendaForm.controls["parcela"].value)) {
      this.vendaForm.controls["parcela"].setValue(1);
    }
    if (this.vendaForm.controls["parcela"].value === parseInt(this.vendaForm.controls["parcela"].value)) {
      if (this.vendaForm.controls["parcela"].value < 1) {
        this.vendaForm.controls["parcela"].setValue(1);
      }
      if (this.vendaForm.controls["parcela"].value > 99) {
        this.vendaForm.controls["parcela"].setValue(99);
      }
    }
  }
  // resetFiador() {
  //   const pacientecontrol = this.vendaForm.get("isnotfiador");
  //   if (this.vendaForm.controls["isnotfiador"].value == false) {
  //     if (pacientecontrol) {
  //       this.vendaForm.removeControl("cpfpaciente");
  //     }
  //     this.vendaForm.controls["cpffiador"].setValue(null);
  //     //this.vendaForm.controls["cpfpaciente"].setValue(null);
  //   }

  //   else {
  //     this.vendaForm.addControl("cpfpaciente", new FormControl('', Validators.required));
  //     this.vendaForm.controls["cpffiador"].setValue(null);
  //     this.vendaForm.controls["cpfpaciente"].setValue(null);
  //   }
  // }
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

  isCpfValid(tipo: any) {
    // validate(cpf);
    //const pcpf = this.vendaForm.controls["cpfpaciente"].value;
    const ccpf = this.vendaForm.controls["cpfcliente"].value;
    const fcpf = this.vendaForm.controls["cpffiador"].value;
    if (tipo == 1) {
      if (ccpf.length > 0 && !validate(ccpf)) {
        this.vendaForm.controls["cpfcliente"].setValue('');
        this.fiadcpf.nativeElement.focus();
        alert("CPF inválido")
      }
      //      this.vendaForm.controls["cpfpaciente"].setValue(this.vendaForm.controls["cpffiador"].value);

    }
    if (tipo == 2) {
      if (fcpf.length > 0 && !validate(fcpf)) {
        this.vendaForm.controls["cpffiador"].setValue(null);
        this.fiadcpf.nativeElement.focus();
        alert("CPF do fiador inválido")
      }
    }
  }
  cpfValid(tipo: any) {
    // validate(cpf);
    if (tipo == 1) {
      const pcpf = this.vendaForm.controls["cpfpaciente"].value;
      if (pcpf.length > 0 && !validate(pcpf)) {
        this.vendaForm.controls["cpfpaciente"].setValue('');
        this.pacicpf.nativeElement.focus();
        alert("CPF do paciente inválido")
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
  }
  clearFormVenda() {
    this.vendaForm.reset();
    this.vendaForm.controls["isnotfiador"].setValue(false);
  }

  resetVenda() {
    if (this.vendaForm.controls["isnotfiador"].value == true) {
      this.vendaForm.removeControl("cpffiador");
      this.vendaForm.removeControl("fiador");
    }
    this.vendaForm.controls["isnotfiador"].setValue(false);
    this.vendaForm.controls["cliente"].setValue('');
    this.vendaForm.controls["cpfpaciente"].setValue('');
    this.vendaForm.controls["parcela"].setValue(1);
    this.vendaForm.controls["docfinanceiro"].setValue('');
    this.vendaForm.controls["docodc"].setValue('');
    this.vendaForm.controls["valortotal"].setValue(0);
    this.vendaForm.controls["financiador"].setValue('');
    console.log(this.vendaForm);
  }

  saveVenda() {
    if (this.vendaForm.valid) {
      if (this.vendaForm.controls["valortotal"].value > 0) {
        // let text = "Confirma os dados abaixo?"
        // let paciente = this.vendaForm.controls["cliente"].value;
        // let cpfp = this.vendaForm.controls["cpfpaciente"].value;
        // let cpff = this.vendaForm.controls["cpffiador"].value;
        // let docf = this.vendaForm.controls["docfinanceiro"].value;
        // let doco = this.vendaForm.controls["docodc"].value;
        // let valortotal = this.vendaForm.controls["valortotal"].value;
        // let financiador = this.vendaForm.controls["tipo"].value;
        let myDate = new Date();
        let cpff = this.vendaForm.controls["cpfpaciente"].value;
        let cpfp = this.vendaForm.controls["cpfpaciente"].value;
        let nomefiad = this.vendaForm.controls["cliente"].value;
        let nomepaci = this.vendaForm.controls["cliente"].value;
        if (this.vendaForm.controls["isnotfiador"].value == true) {
          cpff = this.vendaForm.controls["cpffiador"].value;
          nomefiad = this.vendaForm.controls["fiador"].value;
        }

        const dialogRef = this.dialog.open(ModalaComponent, {
          panelClass: 'modaldetails',

          data: {
            text: "CONFIRME OS DADOS PARA FINALIZAR A VENDA",
            paciente: nomepaci,
            fiador: nomefiad,
            cpff: cpff,
            cpfp: cpfp,
            docf: this.vendaForm.controls["docfinanceiro"].value,
            doco: this.vendaForm.controls["docodc"].value,
            parcela: this.vendaForm.controls["parcela"].value,
            valortotal: this.vendaForm.controls["valortotal"].value,
            financiador: this.vendaForm.controls["financiador"].value,
            isnotfiador: this.vendaForm.controls["isnotfiador"].value,

          }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log(`Dialog result: ${result}`);
          if (result) {
            this.sloader = 1;
            let parcelatxt: any;
            let valorparcela = this.decimalFix((this.vendaForm.controls["valortotal"].value / this.vendaForm.controls["parcela"].value));
            if (this.vendaForm.controls["parcela"].value == 1) {
              parcelatxt = "" + this.vendaForm.controls["parcela"].value + " parcela"
            }
            if (this.vendaForm.controls["parcela"].value > 1) {
              parcelatxt = "" + this.vendaForm.controls["parcela"].value + " parcelas"
            }
            let audittxt;
            if (this.vendaForm.controls["isnotfiador"].value == false) {
              audittxt = "Cadastro de venda do cliente: " + this.vendaForm.controls["cliente"].value + " - CPF: " + cpff + ", SEM FIADOR, no valor de " + formatCurrency(Number(this.vendaForm.controls["valortotal"].value,), 'pt-BR', 'R$') + ", " + parcelatxt + ", financiador: " + this.vendaForm.controls["financiador"].value + " na unidade " + this.user.unidade + "."
            }
            if (this.vendaForm.controls["isnotfiador"].value == true) {
              audittxt = "Cadastro de venda do cliente: " + this.vendaForm.controls["cliente"].value + " - CPF do Paciente: " + cpfp + " - Fiador: " + nomefiad + " - CPF do Fiador: " + cpff + ", no valor de " + formatCurrency(Number(this.vendaForm.controls["valortotal"].value,), 'pt-BR', 'R$') + ", financiador: " + this.vendaForm.controls["financiador"].value + " na unidade " + this.user.unidade + "."
            }
            let auditoperacao = "Cadastro";
            let auditobj = "Venda";
            let obj = {
              cliente: nomepaci,
              fiador: nomefiad,
              cpfpaciente: cpfp,
              cpffiador: cpff,
              docfinanceiro: this.vendaForm.controls["docfinanceiro"].value,
              docodc: this.vendaForm.controls["docodc"].value,
              parcela: this.vendaForm.controls["parcela"].value,
              valorparcela: valorparcela,
              valortotal: this.vendaForm.controls["valortotal"].value,
              isnotfiador: this.vendaForm.controls["isnotfiador"].value,
              financiador: this.vendaForm.controls["financiador"].value,
              createdat: myDate,
              user: this.user.username,
              funcionario: this.user.nome,
              unidade: this.user.unidade,
              auditoperacao: auditoperacao,
              auditobj: auditobj,
              audittxt: audittxt
            }
            let json = JSON.stringify(obj);
            this.service.postVendaCreate(json).subscribe(v => {
              this.sloader = 0;
              console.log(v);
              this.objprint = obj;
              console.log(obj);
              alert("Venda cadastrada com sucesso!");
              this.vendalayout = 2;
              this.resetVenda();
            },
              (error) => {
                this.sloader = 0;
                alert("Erro ao cadastrar venda");
              });
          }
        });
      }
      else {
        alert("Valor da venda não pode ser 0")
      }
    }
    else {
      alert("Preencha todos os campos");
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
  showDeps() {
    console.log(this.dependentesx);
  }

  addDep() {
    console.log(this.depForm.valid)
    if (this.depForm.valid) {
      // console.log(this.dependentes)
      // this.showdeplist = 1;
      this.dependentes.push({
        id: this.dependentes.length,
        nome: this.depForm.value.depnome,
        cpf: this.depForm.value.depcpf,
        rg: this.depForm.value.deprg,
        orgao: this.depForm.value.deporgao,
        nasc: this.depForm.value.depnasc,
        gen: this.depForm.value.depgen
      });
      if (this.dependentes.length >= 4) {
        this.depbtnincenable = 0
      }

      this.depForm.reset();
      this.depbtnenable = 1;
      console.log(this.dependentes);
      // console.log(this.dependentes)
    }
    else {
      alert("Preencha todos os campos.")

    }


    //this.dependente.push
    // //console.log(this.dependente)
    // this.dependente.push(this.depNome);
    //resetar o input
    // this.depNome = ''
    // this.depCpf = ''
    // this.depRg = ''
    // this.depOrg = ''
    // this.depNasc = ''
    // this.depGen = '';

  }


  trocarValor(valor: number) {
    this.enabletitb = valor;

  }

  incTitular() {
    this.enabletitb = 0;
    // this.profileForm.enable();
    this.enabletitinc = 1;


  }
  enableBusca() {

    this.profileForm.disable();
    this.profileForm.reset();
    this.profileForm.controls["buscacliente"].enable();
    this.profileForm.controls["buscacliente"].setValue('');
    this.enabletitinc = 0;
    this.finbaenable = 0;
    this.pagForm.reset();
    // this.enabletitba = 1;
    this.enabletitb = 1;
    // this.enabletitbc = 1;
    this.objvenda = [];
    this.objpagamento = [];
    this.pagar = 0;
    this.showcomprovante = 0;
    this.tcontrato = 0;
    this.showcarne = 0;
    this.objcliente = [];
    this.objvendedor = [];
    this.objbuscac = [];
    this.objbuscav = [];
    this.dependentes = [];
    this.deps = [];
    this.finForm.reset();
    this.finForm.disable();
    this.depcount = 0;
    this.deletefin = 0;
    this.showcancelbtn = 0;
    this.showcancellabel = 0;
    this.finbbenable = 0;

  }

  saveDep() {

    this.dependentesx = this.dependentes;
    this.dependentes = [];
    this.depbtnenable = 0;
    const dialogRef = this.dialog.open(ModalbComponent, {
      panelClass: 'modalCadastroTitular'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        this.tabindex = 2;
        this.depForm.disable();
        this.depbtnincenable = 0;

        if (this.dependentesx.find(t => t.id == 0) != null) {
          this.dep1 = this.dependentesx.find(t => t.id == 0);
        }
        if (this.dependentesx.find(t => t.id == 1) != null) {
          this.dep2 = this.dependentesx.find(t => t.id == 1);
        }
        if (this.dependentesx.find(t => t.id == 2) != null) {
          this.dep3 = this.dependentesx.find(t => t.id == 2);
        }
        if (this.dependentesx.find(t => t.id == 3) != null) {
          this.dep4 = this.dependentesx.find(t => t.id == 3);
        }

      }
    });

    //  const dependentelist = this.dependentesx;
    //  dependentelist.find(x=>x.length == 0) 


  }

  delDep() {
    this.dependentes.pop();
    this.depbtnincenable = 1;
    console.log(this.dependentes);
    if (this.dependentes.length < 1) {
      this.depbtnenable = 0;
    }


  }
  enabletitbVariavel() {
    console.log(this.profileForm.value)
    alert(this.profileForm.value.vendedor);

  }

  saveTit() {
    console.log(this.profileForm.value)
    console.log(this.profileForm.valid)
    console.log(this.objcliente)
    console.log(this.objvendedor)
    console.log(this.objcliente.id)
    console.log(this.objcliente.nome)
    console.log(this.objvendedor.id)
    console.log(this.objvendedor.nome)
    if (this.profileForm.valid) {

      // this.profileForm.enable();
      //   this.formobj = {
      //     //MUDAR PARA SINTAXE COM CONTROLS (vide funções de busca linha 831)
      //     vend: this.profileForm.value.vendedor,
      //     origem: this.profileForm.value.origemvenda,
      //     uni: this.profileForm.value.unidade,
      //     titnome: this.profileForm.value.titularnome,
      //     titcpf: this.profileForm.value.titularcpf,
      //     titrg: this.profileForm.value.titularrg,
      //     titorg: this.profileForm.value.titularorgao,
      //     titnasc: this.profileForm.value.titularnasc,
      //     titgen: this.profileForm.value.titulargen,
      //     titemail: this.profileForm.value.titularemail,
      //     titcel: this.profileForm.value.titularcel,
      //     tittel: this.profileForm.value.titulartel,
      //     titend: this.profileForm.value.titularendereco,
      //     titcep: this.profileForm.value.titularcep,
      //     titnum: this.profileForm.value.titularnum,
      //     titcomp: this.profileForm.value.titularcomp,
      //     titbairro: this.profileForm.value.titularbairro,
      //     titcidade: this.profileForm.value.titularcidade,
      //     titestado: this.profileForm.value.titularestado
      // }
      this.titNome = this.objcliente.nome;
      // this.depForm.enable();
      this.finForm.enable();
      this.profileForm.disable();
      this.enabletitb = 1;
      this.depbtnincenable = 1;
      this.finbbenable = 1;
      this.tabindex = 1;




    }
    else {
      alert("Preencha todos os campos.")
    }
  }
  enableForm() {
    alert("Estou funcionando!")
  }

  printContratoTest() {
    // const contr = new jsPDF();
    // var string = contr.output('datauristring');
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    // var x = window.open();
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();
  }

  checkDeps() {
    // if (this.finForm.controls["finplano"].value == "PRAMELHOR") {
    //   if (this.depcount != 0) {
    //     alert("Plano indisponível para titulares com dependentes.")
    //     this.finForm.reset()
    //   }
    // }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 PESSOA") {
      if (this.depcount != 0) {
        alert("Plano indisponível para titulares com dependentes.")
        this.finForm.reset()
      }
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 1 DEPENDENTE") {
      if (this.depcount < 1) {
        alert("Titular não possui dependentes o suficiente para este plano.")
        this.finForm.reset()
      }
      if (this.depcount > 1) {
        alert("Titular possui mais dependentes que o permitido para este plano.")
        this.finForm.reset()
      }
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 2 DEPENDENTES") {
      if (this.depcount < 2) {
        alert("Titular não possui dependentes o suficiente para este plano.")
        this.finForm.reset()
      }
      if (this.depcount > 2) {
        alert("Titular possui mais dependentes que o permitido para este plano.")
        this.finForm.reset()
      }
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 3 DEPENDENTES") {
      if (this.depcount < 3) {
        alert("Titular não possui dependentes o suficiente para este plano.")
        this.finForm.reset()
      }
      if (this.depcount > 3) {
        alert("Titular possui mais dependentes que o permitido para este plano.")
        this.finForm.reset()
      }
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 4 DEPENDENTES") {
      if (this.depcount < 4) {
        alert("Titular não possui dependentes o suficiente para este plano.")
        this.finForm.reset()
      }

    }

  }
  setValortot() {
    this.finForm.enable()
    this.finForm.controls["finoptpag"].reset();
    this.finForm.controls["finnparcelas"].reset();
    this.finForm.controls["finformapag"].reset();
    this.finForm.controls["finadesao"].reset();
    this.finForm.controls["finvencpri"].reset();
    this.finForm.controls["finvenc"].reset();
    this.finForm.controls["finpriparcela"].reset();
    this.finForm.controls["finvalorparcela"].reset();
    this.finForm.controls["finvalordesconto"].reset();
    this.finForm.controls["finvalorfinaltot"].reset();
    this.finForm.controls["findesconto"].setValue("Sem desconto");


    if (this.finForm.controls["finplano"].value == "PRAMELHOR") {

      this.finForm.controls["finvalorfinaltot"].setValue(657.80);
      this.tipocontrato = 1;
      this.nomeplano = "Pramelhor"
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR - PARCERIA") {
      let myDate = formatDate(new Date(), 'yyyy/MM/dd', 'en');
      this.finForm.controls["finvalorfinaltot"].setValue(0);
      this.tipocontrato = 0;
      this.nomeplano = "Pramelhor - Parceria"
      this.finForm.controls["finadesao"].setValue(0);
      this.finForm.controls["finadesao"].disable();
      this.finForm.controls["finvenc"].setValue(0);
      this.finForm.controls["finvenc"].disable();
      this.finForm.controls["finvencpri"].setValue(myDate);
      this.finForm.controls["finvencpri"].disable();
      this.finForm.controls["finoptpag"].setValue("Isento");
      this.finForm.controls["finoptpag"].disable();
      this.finForm.controls["finformapag"].setValue("Isento");
      this.finForm.controls["finformapag"].disable();
      this.finForm.controls["finvalorparcela"].setValue(0);
      this.finForm.controls["finvalorparcela"].disable();
      this.finForm.controls["finpriparcela"].setValue(0);
      this.finForm.controls["finpriparcela"].disable();
      this.finForm.controls["finnparcelas"].setValue(1);
      this.finForm.controls["finnparcelas"].disable();
      this.finForm.controls["findesconto"].setValue("Sem desconto");
      this.finForm.controls["findesconto"].disable();
      this.finForm.controls["finvalordesconto"].setValue(0);
      this.finForm.controls["finvalordesconto"].disable();
      this.finForm.controls["finvalorfinal"].setValue(0);
      this.finForm.controls["finvalorfinal"].disable();
    }

    if (this.finForm.controls["finplano"].value == "PRAMELHOR PROMOCIONAL") {

      this.finForm.controls["finvalorfinaltot"].setValue(437.80);
      this.tipocontrato = 1;
      this.nomeplano = "Pramelhor Promocional"
    }


    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 PESSOA") {

      this.finForm.controls["finvalorfinaltot"].setValue(1315.6);
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 pessoa"
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 1 DEPENDENTE") {
      this.finForm.controls["finvalorfinaltot"].setValue(1973.4);
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 titular + 1 dependente"
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 2 DEPENDENTES") {
      this.finForm.controls["finvalorfinaltot"].setValue(2521.2);
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 titular + 2 dependentes"
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 3 DEPENDENTES") {
      this.finForm.controls["finvalorfinaltot"].setValue(2950.2);
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 titular + 3 dependentes"
    }
    if (this.finForm.controls["finplano"].value == "PRAMELHOR GOLD 1 TITULAR + 4 DEPENDENTES") {
      this.finForm.controls["finvalorfinaltot"].setValue(3300.0);
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor Gold 1 titular + 4 dependentes"
    }
    this.valortot = this.finForm.controls["finvalorfinaltot"].value;


  }


  calcAdesao() {
    this.calcFin();

  }

  calcFin() {
    // const valorparcela = (Number(this.valortot)) / Number(this.finForm.controls["finnparcelas"].value);
    // // this.finForm.controls["finvalorparcela"].setValue(valorparcela);
    // this.finForm.controls["finvalorparcela"].setValue(valorparcela);
    // const valortotal = (Number(this.finForm.controls["finadesao"].value)) + Number(this.valortot);
    // this.finForm.controls["finvalorfinaltot"].setValue(valortotal);

    // if (this.finForm.controls["findesconto"].value == "Sem desconto") {

    //   this.finForm.controls["finvalorparcela"].setValue(valorparcela);
    //   this.finForm.controls["finvalorfinal"].setValue(null);
    //   this.finForm.controls["finvalordesconto"].setValue(0);
    // }
    // if (this.finForm.controls["findesconto"].value == "5%") {

    //   const parceladesconto = valorparcela * 0.95
    //   const totaldesconto = (Number(this.valortot) * 0.95) + (Number(this.finForm.controls["finadesao"].value))
    //   const descontado = Number(valortotal) - Number(totaldesconto);
    //   this.finForm.controls["finvalorparcela"].setValue(parceladesconto);
    //   this.finForm.controls["finvalorfinal"].setValue(totaldesconto);
    //   this.finForm.controls["finvalordesconto"].setValue(descontado);
    // }
    // if (this.finForm.controls["findesconto"].value == "10%") {

    //   const parceladesconto = valorparcela * 0.90
    //   const totaldesconto = (Number(this.valortot) * 0.90) + (Number(this.finForm.controls["finadesao"].value))
    //   const descontado = Number(valortotal) - Number(totaldesconto);
    //   this.finForm.controls["finvalorparcela"].setValue(parceladesconto);
    //   this.finForm.controls["finvalorfinal"].setValue(totaldesconto);
    //   this.finForm.controls["finvalordesconto"].setValue(descontado);
    // }


    // const primeiraparcela = Number(this.finForm.controls["finvalorparcela"].value) + Number(this.finForm.controls["finadesao"].value);
    // console.log(primeiraparcela);
    // this.finForm.controls["finpriparcela"].setValue(primeiraparcela);
    // // if (this.finForm.controls["finnparcelas"].value == 1) {
    // //   this.finForm.controls["finvalorparcela"].setValue(this.finForm.controls["finpriparcela"].value);

    // // }

  }

  setDesconto() {
    if (this.prevdesc != this.nvendaForm.controls["desconto"].value) {
      this.calculateDesconto();
      // this.prevdesc = this.vendaForm.controls["desconto"].value;
    }
  }



  saveFin() {

    console.log("Opag: " + this.opag);
    if (this.finForm.valid) {

      this.objvenda = {
        nome_plano: this.finForm.controls["finplano"].value,
        opcao_pagamento: this.finForm.controls["finoptpag"].value,
        forma_pagamento: this.finForm.controls["finformapag"].value,
        origem: this.profileForm.controls["origemvenda"].value,
        unidade: this.profileForm.controls["unidade"].value,
        adesao: this.finForm.controls["finadesao"].value,
        qtd_parcelas: this.finForm.controls["finnparcelas"].value,
        venc_priparcela: formatDate(this.finForm.controls["finvencpri"].value, 'yyy-MM-dd', 'en'),
        venc_parcela: this.finForm.controls["finvenc"].value,
        valor_priparcela: this.finForm.controls["finpriparcela"].value,
        valor_parcela: this.finForm.controls["finvalorparcela"].value,
        valor_desconto: this.finForm.controls["finvalorfinal"].value,
        valor_descontado: this.finForm.controls["finvalordesconto"].value,
        valor_total: this.finForm.controls["finvalorfinaltot"].value,
        tipo_desconto: this.finForm.controls["findesconto"].value,
        ven_id: this.objvendedor.id,
        cli_id: this.objcliente.id
      }
      this.datavencimento = new Date(this.objvenda.venc_priparcela);
      console.log(this.datavencimento);
      this.datavencimento.setHours(this.datavencimento.getHours() + 4);
      console.log(this.datavencimento);
      this.datavencimento.setDate(this.objvenda.venc_parcela);
      console.log(this.datavencimento);
      const obj = JSON.stringify(this.objvenda);
      this.service.postVendaCreate(obj).subscribe(c => {
        console.log(c);

        this.service.getVendaSingleActive(this.objcliente.id).subscribe(v => {
          console.log(v);
          this.objvenda.id = v.id;
          let objvendaid = v.id;
          console.log(this.objvenda.id);
          this.objvenda.createdat = v.createdat;
          let objvenda = this.objvenda;
          this.service.getClienteId(objvenda.cli_id).subscribe(cli => {
            let cliente = cli;
            let logobj = {
              objeto: 'Venda',
              operacao: 'Criação',
              descricao: "Criação de venda: " + objvenda.nome_plano + " - Número de contrato " + objvenda.id + " / Titular " + cliente.nome + " - CPF: " + cliente.cpf + ""
            }
            this.service.createLogObj(logobj).subscribe(u => {
              console.log(u);
              alert("Financeiro cadastrado com sucesso.")
              this.finForm.disable();
              this.tcontrato = this.tipocontrato;
              //this.finForm.disable();
              this.finbaenable = 1;
              this.finbbenable = 0;
              console.log(this.objcliente);
              console.log(this.objvendedor);
              console.log(this.dependentes);
              console.log(this.objvenda);
              this.showcarne = 1;

              for (let i = 0; i <= (Number(this.objvenda.qtd_parcelas) - 1); i++) {
                let newParcela = {
                  venda_id: this.objvenda.id,
                  parcela: i + 1,
                  dt_venc: '',
                  valor_parcela: 0.0,

                }
                if (i == 0) {
                  newParcela.valor_parcela = this.objvenda.valor_priparcela;
                  const privenc = new Date(this.objvenda.venc_priparcela);
                  privenc.setHours(privenc.getHours() + 4);
                  newParcela.dt_venc = formatDate(privenc, 'yyyy-MM-dd', 'en');
                  // newParcela.dt_venc = new Date(this.objvenda.venc_priparcela);

                }
                else {
                  newParcela.valor_parcela = this.objvenda.valor_parcela;
                  let d = new Date(this.datavencimento.setMonth(this.datavencimento.getMonth() + 1));
                  let mydt = formatDate(new Date(d), 'yyyy-MM-dd', 'en');
                  newParcela.dt_venc = mydt;
                }
                this.pagamento = newParcela;
                // this.pagamento.push(newParcela);
                console.log(this.pagamento);
                const objp = JSON.stringify(this.pagamento);
                this.service.postPagamentoCreate(objp).subscribe(p => {
                  console.log(p);
                  this.service.getPagamento(this.objvenda.id).subscribe(pag => {
                    console.log(pag);
                    this.objpagamento = pag.pagamento;
                    console.log(this.objpagamento);

                  });
                });
              }
            });
          });
        });


      });

    }

    else {
      alert("Preencha todos os campos");
    }
  }
  showDateValue() {
    // let date1 = formatDate(this.finForm.controls["finvencpri"].value, 'yyyy-MM-dd', 'en');
    // let date2 = this.finForm.controls["finvencpri"].value;
    let date = new Date('2021-01-01');
    console.log(date);
    date.setHours(date.getHours() + 4)
    console.log(date);
    //let date1 = formatDate(date,'yyyy-MM-dd', 'en');
    // let date2:any = Date();
    // console.log(date);
    // // //console.log(date1);
    // console.log(date2);
    //date2.setDate(date1);

    // console.log(date1);
    // console.log(date2);
    // //console.log(datavencimento);
  }
  showCartao() {
    if (this.finForm.controls["finformapag"].value == "Cartão de Crédito" || this.finForm.controls["finformapag"].value == "Recorrente") {
      this.showcartao = 1;
      this.finForm.controls['fincartao'].reset();
      console.log(this.finForm.get('fincartao')?.value);
    }
    else {
      this.finForm.controls['fincartao'].setValue('0');
      this.showcartao = 0;
    }
  }


  seeDeps() {
    // //console.log(this.dependentesx.filter (this.dependentesx.id == 0));
    console.log(this.dep1);
    console.log(this.dep2);
    console.log(this.dep3);
    console.log(this.dep4);
  }

  generateaPDF(data: any) {
    var data: any = document.getElementById('contentToConverta');
    html2canvas(data).then(canvas => {
      let HTML_Width = canvas.width;
      let HTML_Height = canvas.height;
      let top_left_margin = 15;

      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;
      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      canvas.getContext('2d');
      let imgData = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, 180, 850);
      for (let i = 1; i <= 2; i++) {
        pdf.addPage('a4', 'p');

        pdf.addImage(imgData, 'JPG', top_left_margin, -(300 * i) + (top_left_margin * 2), 180, 850);
        // pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }
      pdf.save("Contrato " + this.titNome + " PRAMELHOR.pdf");
    });
  }
  generatebPDF(data: any) {
    var data: any = document.getElementById('contentToConvertb');
    html2canvas(data).then(canvas => {
      let HTML_Width = canvas.width;
      let HTML_Height = canvas.height;
      let top_left_margin = 15;

      let PDF_Width = HTML_Width + (top_left_margin * 2);
      let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
      let canvas_image_width = HTML_Width;
      let canvas_image_height = HTML_Height;
      let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
      canvas.getContext('2d');
      let imgData = canvas.toDataURL("image/jpeg", 1.0);
      let pdf = new jsPDF('p', 'mm', 'a4');
      pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, 180, 850);
      for (let i = 1; i <= 2; i++) {
        pdf.addPage('a4', 'p');

        pdf.addImage(imgData, 'JPG', top_left_margin, -(300 * i) + (top_left_margin * 2), 180, 850);
        // pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
      }
      pdf.save("Contrato " + this.titNome + " PRAMELHOR GOLD.pdf");
    });
  }
  newCadastro() {
    this.tabindex = 0;
    this.tcontrato = 0;
    this.showcarne = 0;
    this.finbaenable = 0;
    this.enableBusca();
    // this.titNome = '';
    // this.enabletitinc = 0;
    // this.finbbenable = 0;
    // this.finForm.disable()
    // this.finForm.reset();
    // this.profileForm.reset();
    // this.finForm.controls['fincartao'].reset();
    // this.showcartao = 0;
    // this.objbusca = [];
    // this.objcliente = [];
    // this.profileForm.controls["buscacliente"].setValue('');
    //this.formobj = null;
  }

  buscaVendedorNome() {
    if (this.profileForm.controls["vendedor"].value.length >= 3) {
      this.service.getVendedorNome(this.profileForm.controls["vendedor"].value).subscribe(c => {
        console.log(c.Vendedores);
        this.objbuscav = c.Vendedores;
      });
    }
    if (this.profileForm.controls["vendedor"].value.length < 3) {
      this.objbuscav = [];
    }
  }

  buscaClienteNome() {

    if (this.profileForm.controls["buscacliente"].value.length >= 3) {
      this.service.getClienteNome(this.profileForm.controls["buscacliente"].value).subscribe(c => {
        console.log(c.Cliente);
        this.objbuscac = c.Clientes;
        console.log(c);
      });
    }
    if (this.profileForm.controls["buscacliente"].value.length < 3) {
      this.objbuscac = [];
    }
  }

  // buscaClienteCpf() {

  // //   console.log(this.profileForm.controls["buscacliente"].value)
  //   this.service.getClienteCpf(this.profileForm.controls["buscacliente"].value).subscribe(c => {
  // //     console.log("Cliente encontrado: ", this.objcliente);
  //     this.profileForm.controls["titularnome"].setValue(c.nome);
  //   });
  // }

  //   for (let i = 1; i <= 2; i++) {
  //     pdf.addPage('a4', 'p');

  //     pdf.addImage(imgData, 'JPG', top_left_margin, -(300 * i) + (top_left_margin * 2), 180, 850);
  //   pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
  //   }

  fillFormCliente(cli: any, index: any) {
    this.objcliente = this.objbuscac[index];
    this.dependentes = [];
    this.service.getDependenteList(this.objcliente.id).subscribe(d => {
      console.log(this.objcliente.id);
      // console.log(c.dependentes.length);
      // let count = c.dependentes.length;
      this.dependentes = d.dependentes;
      // console.log("this.dependentes: " + this.dependentes.length);
      // console.log("d.dependentes: " + d.dependentes);
      if (d.dependentes != undefined) {
        console.log("Contagem de dependentes" + this.dependentes.length);
        this.depcount = this.dependentes.length;
        for (let i = 0; i <= 3; i++) {

          let newDep = {
            nome: "",
            cpf: "",
            rg: "",
            dtnasc: "",
            orgao: ""
          }
          // console.log(c.dependentes[i]);
          // console.log(this.dependentes);
          // console.log(this.dependentes[i]);

          if (d.dependentes[i] != undefined) {
            console.log(d);
            newDep.nome = d.dependentes[i].nome;
            newDep.cpf = d.dependentes[i].cpf;
            newDep.rg = d.dependentes[i].rg;
            newDep.dtnasc = d.dependentes[i].dtnasc;
            newDep.orgao = d.dependentes[i].orgao;
            this.deps.push(newDep);
            console.log(this.deps);
          }
          else {

            // this.dependentes = c.dependentes;
            // console.log(this.dependentes);
            newDep.nome = '';
            newDep.cpf = '';
            newDep.rg = '';
            newDep.dtnasc = '';
            newDep.orgao = '';
            this.deps.push(newDep);
            console.log(this.deps);
          }
        }

      }
      else {
        this.depcount = 0;

        for (let i = 0; i <= 3; i++) {
          let newDep = {
            nome: "",
            cpf: "",
            rg: "",
            dtnasc: "",
            orgao: ""
          }
          newDep.nome = '';
          newDep.cpf = '';
          newDep.rg = '';
          newDep.dtnasc = '';
          newDep.orgao = '';
          this.deps.push(newDep);
          console.log(this.deps);
        }
      }
      console.log(this.depcount);
    });
    console.log(cli);
    this.profileForm.controls["buscacliente"].setValue('');
    this.profileForm.controls["buscacliente"].disable();
    this.profileForm.controls["titularnome"].setValue(cli.nome);
    this.profileForm.controls["titularcpf"].setValue(cli.cpf);
    this.profileForm.controls["titularrg"].setValue(cli.rg);
    this.profileForm.controls["titularorgao"].setValue(cli.orgao);
    this.profileForm.controls["titularnasc"].setValue(cli.dtnasc);
    this.profileForm.controls["titulargen"].setValue(cli.genero);
    this.profileForm.controls["titularemail"].setValue(cli.email);
    this.profileForm.controls["titularcel"].setValue(cli.celular);
    this.profileForm.controls["titulartel"].setValue(cli.telefone);
    this.profileForm.controls["titularendereco"].setValue(cli.endereco);
    this.profileForm.controls["titularcep"].setValue(cli.cep);
    this.profileForm.controls["titularnum"].setValue(cli.numero);
    this.profileForm.controls["titularcomp"].setValue(cli.complemento);
    this.profileForm.controls["titularbairro"].setValue(cli.bairro);
    this.profileForm.controls["titularcidade"].setValue(cli.cidade);
    this.profileForm.controls["titularestado"].setValue(cli.estado);
    if (cli.whatsapp == "1") {
      this.profileForm.controls["titularwhatsapp"].setValue(true);
    }
    else {
      this.profileForm.controls["titularwhatsapp"].setValue(false);
    }

    this.service.getVendaSingle(this.objcliente.id).subscribe(c => {
      console.log(c.cli_id);

      if (c.cli_id != undefined) {
        this.objvenda = c;
        console.log(this.objvenda);
        if (this.objvenda.stats == 'ativo') {
          this.showcancelbtn = 1;
          this.deletefin = 1;
          this.blckbtnpag = 0;
          this.showcancellabel = 0;
          this.service.getVendedorId(this.objvenda.ven_id).subscribe(v => {
            console.log(v);
            this.objvendedor = v;
            this.profileForm.controls["origemvenda"].setValue(this.objvenda.origem);
            this.profileForm.controls["unidade"].setValue(this.objvenda.unidade);
            this.profileForm.controls["vendedor"].setValue(this.objvendedor.nome);
            alert("Financeiro encontrado para este cliente")
            this.enabletitb = 1;
            this.showcarne = 1;
            this.finForm.controls["finplano"].setValue(this.objvenda.nome_plano);
            this.finForm.controls["finoptpag"].setValue(this.objvenda.opcao_pagamento);
            this.finForm.controls["finformapag"].setValue(this.objvenda.forma_pagamento);
            this.finForm.controls["finadesao"].setValue(this.objvenda.adesao);
            this.finForm.controls["finnparcelas"].setValue(this.objvenda.qtd_parcelas);
            this.finForm.controls["finvencpri"].setValue(this.objvenda.venc_priparcela);
            this.finForm.controls["finvenc"].setValue(this.objvenda.venc_parcela);
            this.finForm.controls["finpriparcela"].setValue(this.objvenda.valor_priparcela);
            this.finForm.controls["finvalorparcela"].setValue(this.objvenda.valor_parcela);
            this.finForm.controls["finvalorfinal"].setValue(this.objvenda.valor_desconto);
            this.finForm.controls["finvalordesconto"].setValue(this.objvenda.valor_descontado);
            this.finForm.controls["finvalorfinaltot"].setValue(this.objvenda.valor_total);
            this.finForm.controls["findesconto"].setValue(this.objvenda.tipo_desconto);


            if (this.finForm.controls["finplano"].value == "PRAMELHOR")
              this.tcontrato = 1;
            else if (this.objvenda.nome_plano == "PRAMELHOR - PARCERIA") {
              this.tcontrato = 0;
            }
            else if (this.objvenda.nome_plano == "PRAMELHOR PROMOCIONAL") {
              this.tcontrato = 1;
            }
            else {
              this.tcontrato = 2;
            }
            console.log(this.tcontrato);
            this.service.getPagamento(this.objvenda.id).subscribe(pag => {
              console.log(pag);
              if (pag.pagamento) {
                this.objpagamento = pag.pagamento;
                console.log(this.objpagamento);
              }
            });
          });
        }
        if (this.objvenda.stats == 'cancelado') {
          this.showcancelbtn = 0;
          this.deletefin = 1;
          this.blckbtnpag = 1;
          this.showcancellabel = 1;
          this.service.getVendedorId(this.objvenda.ven_id).subscribe(v => {
            console.log(v);
            this.objvendedor = v;
            this.profileForm.controls["origemvenda"].setValue(this.objvenda.origem);
            this.profileForm.controls["unidade"].setValue(this.objvenda.unidade);
            this.profileForm.controls["vendedor"].setValue(this.objvendedor.nome);
            alert("O contrato deste cliente encontra-se cancelado")
            this.enabletitb = 1;
            this.showcarne = 1;
            this.finForm.controls["finplano"].setValue(this.objvenda.nome_plano);
            this.finForm.controls["finoptpag"].setValue(this.objvenda.opcao_pagamento);
            this.finForm.controls["finformapag"].setValue(this.objvenda.forma_pagamento);
            this.finForm.controls["finadesao"].setValue(this.objvenda.adesao);
            this.finForm.controls["finnparcelas"].setValue(this.objvenda.qtd_parcelas);
            this.finForm.controls["finvencpri"].setValue(this.objvenda.venc_priparcela);
            this.finForm.controls["finvenc"].setValue(this.objvenda.venc_parcela);
            this.finForm.controls["finpriparcela"].setValue(this.objvenda.valor_priparcela);
            this.finForm.controls["finvalorparcela"].setValue(this.objvenda.valor_parcela);
            this.finForm.controls["finvalorfinal"].setValue(this.objvenda.valor_desconto);
            this.finForm.controls["finvalordesconto"].setValue(this.objvenda.valor_descontado);
            this.finForm.controls["finvalorfinaltot"].setValue(this.objvenda.valor_total);
            this.finForm.controls["findesconto"].setValue(this.objvenda.tipo_desconto);


            if (this.finForm.controls["finplano"].value == "PRAMELHOR")
              this.tcontrato = 1;
            else if (this.objvenda.nome_plano == "PRAMELHOR - PARCERIA") {
              this.tcontrato = 0;
            }
            else if (this.objvenda.nome_plano == "PRAMELHOR PROMOCIONAL") {
              this.tcontrato = 1;
            }
            else {
              this.tcontrato = 2;
            }
            console.log(this.tcontrato);
            this.service.getPagamento(this.objvenda.id).subscribe(pag => {
              console.log(pag);
              if (pag.pagamento) {
                this.objpagamento = pag.pagamento;
                console.log(this.objpagamento);
              }
            });
          });
        }
      }
      else {
        this.showcancelbtn = 0;
        this.blckbtnpag = 1;
        this.profileForm.controls["origemvenda"].enable();
        this.profileForm.controls["vendedor"].enable();
        this.profileForm.controls["unidade"].setValue(this.unidade);
        //this.profileForm.controls["unidade"].enable();
        this.enabletitb = 0;
        this.objbuscac = [];
        this.objvenda = [];
      }
    });



  }
  fillVendedor(ven: any, index: any) {
    this.profileForm.controls["vendedor"].setValue(ven.nome);
    console.log(ven);
    this.objvendedor = this.objbuscav[index];
    this.objbuscav = [];
  }

  trocaDtPag(parcela: any, index: any) {
    this.atraso = 0;
    this.juros = 0;
    this.contaatraso = 0;
    let dtvenc = new Date(this.objpagamento[index].dt_venc);
    let valor_parcela = this.objpagamento[index].valor_parcela;
    let count = 0;
    for (let dtpag = new Date(this.pagForm.controls["pagdata"].value); dtpag > dtvenc;) {
      console.log(dtpag);
      console.log(dtvenc);
      count = count + 1;
      console.log(count);
      valor_parcela = valor_parcela * 1.02;
      dtvenc = new Date(dtvenc.setMonth(dtvenc.getMonth() + 1));
    }
    this.contaatraso = count;
    if (count > 0) {
      this.atraso = 1;
      this.juros = Number(valor_parcela) - Number(this.objpagamento[index].valor_parcela);
    }
    this.pagForm.controls["pagvalor"].setValue(valor_parcela);
  }

  addFormaPag() {
    let valparcela = this.decimalFix(this.valparcela);
    let valtotal = this.calcFormaPag();
    console.log(valtotal);
    console.log(valparcela);
    if (this.pagForm.valid) {
      if (valtotal < valparcela) {
        this.forma_pagamento.push(this.forma_pagamento.length);
        let pagvalor = "pagvalor" + this.forma_pagamento.length;
        this.pagForm.addControl(pagvalor, new FormControl('', Validators.required));
        let pagforma = "pagforma" + this.forma_pagamento.length;
        this.pagForm.addControl(pagforma, new FormControl('', Validators.required));
        let newvalor = this.valparcela - valtotal;
        this.pagForm.controls[pagvalor].setValue(newvalor);
        this.showTotParcela();
        // //console.log(this.forma_pagamento.length);
      }
      else {
        alert("Valor informado já atingiu o valor da parcela");
      }
    }
    else {
      alert("Preencha todos os campos");
    }

  }
  removeFormaPag() {
    if (this.forma_pagamento.length > 1) {
      let pagvalor = "pagvalor" + this.forma_pagamento.length;
      this.pagForm.removeControl(pagvalor);
      let pagforma = "pagforma" + this.forma_pagamento.length;
      this.pagForm.removeControl(pagforma);
      this.forma_pagamento.pop();
    }
  }
  clearPagForm() {
    for (let i = 1; i <= this.forma_pagamento.length; i++) {
      let pagvalor = "pagvalor" + i;
      let pagforma = "pagforma" + i;
      this.pagForm.removeControl(pagvalor);
      this.pagForm.removeControl(pagforma);
    }
  }

  decimalFix(val: any) {
    let value = Number((Math.round(val * 100) / 100).toFixed(2));
    return value;
  }
  calcFormaPag() {
    let valortotal = 0;
    for (let i = 1; i <= this.forma_pagamento.length; i++) {
      let pagvalor = "pagvalor" + i;
      let pagforma = "pagforma" + i;
      let valor_pago = this.pagForm.controls[pagvalor].value;
      valor_pago = this.decimalFix(valor_pago);
      let forma_pag = this.pagForm.controls[pagforma].value;
      valortotal = valortotal + this.pagForm.controls[pagvalor].value;
    }
    valortotal = this.decimalFix(valortotal);
    // console.log(valortotal);
    // this.pagForm.controls["pagtot"].setValue(valortotal);
    return valortotal;
  }

  showTotParcela() {
    let valortotal = 0;
    for (let i = 1; i <= this.forma_pagamento.length; i++) {
      let pagvalor = "pagvalor" + i;
      let pagforma = "pagforma" + i;
      let valor_pago = this.pagForm.controls[pagvalor].value;
      valor_pago = this.decimalFix(valor_pago);
      let forma_pag = this.pagForm.controls[pagforma].value;
      valortotal = valortotal + this.pagForm.controls[pagvalor].value;
    }
    valortotal = this.decimalFix(valortotal);
    console.log(valortotal);
    this.pagForm.controls["pagtot"].setValue(valortotal);

  }

  pagaParcela(parcela: any, index: any) {
    this.clearPagForm();
    this.valor_parcela
    this.forma_pagamento = [];
    this.forma_pagamento.push(this.forma_pagamento.length);
    console.log(this.forma_pagamento.length);
    let pagvalor = "pagvalor" + this.forma_pagamento.length;
    this.pagForm.addControl(pagvalor, new FormControl('', Validators.required));
    let pagforma = "pagforma" + this.forma_pagamento.length;
    this.pagForm.addControl(pagforma, new FormControl('', Validators.required));
    this.contaatraso = 0;
    this.juros = 0;
    this.atraso = 0;
    let myDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    let hoje = new Date
    this.pagar = 1;
    this.parcel = this.objpagamento[index].parcela;
    //this.venda = this.objpagamento[index];
    this.objpaga = this.objpagamento[index];
    console.log(this.objpaga);
    console.log(myDate);
    console.log(hoje);
    let valor_parcela = this.objpagamento[index].valor_parcela;
    let dtvenc = new Date(this.objpagamento[index].dt_venc);
    let count = 0;
    // //  console.log(dtvenc);
    // //  console.log(hoje);
    //  dtvenc = new Date (dtvenc.setMonth(dtvenc.getMonth() - 1));
    // //  console.log(dtvenc);
    for (let hj = new Date(myDate); hj > dtvenc;) {
      console.log(hj);
      console.log(dtvenc);
      count = count + 1;
      console.log(count);
      valor_parcela = valor_parcela * 1.02;
      dtvenc = new Date(dtvenc.setMonth(dtvenc.getMonth() + 1));
    }

    this.contaatraso = count;
    if (count > 0) {
      this.atraso = 1;
      this.juros = Number(valor_parcela) - Number(this.objpagamento[index].valor_parcela);
    }
    this.pagForm.controls["pagdata"].setValue(myDate);
    // this.pagForm.controls["pagdata"].disable();
    this.valparcela = valor_parcela;
    this.valor_parcela = formatCurrency(valor_parcela, 'pt-Br', 'R$');
    this.pagForm.controls["pagvalor1"].setValue(valor_parcela);
    this.pagForm.controls["pagtot"].setValue(valor_parcela);
  }

  confirmaPag() {

    console.log(this.objpaga);

    if (this.pagForm.valid) {
      let valortotal = 0;
      let venda_id = this.objpaga.venda_id;
      let array: any = [];
      let parcela = this.objpaga.parcela;
      for (let i = 1; i <= this.forma_pagamento.length; i++) {

        let obj = {
          venda_id: this.objvenda.id,
          parcela: this.parcel,
          valor_pago: 0,
          forma_pag: ''
        }
        // //console.log(i);
        // //console.log(this.forma_pagamento.length);
        let pagvalor = "pagvalor" + i;
        console.log("Valor " + i + ": " + this.pagForm.controls[pagvalor].value);
        let pagforma = "pagforma" + i;
        console.log("Forma de pagamento " + i + ": " + this.pagForm.controls[pagforma].value);
        let valor_pago = this.pagForm.controls[pagvalor].value;
        valor_pago = this.decimalFix(valor_pago);
        let forma_pag = this.pagForm.controls[pagforma].value;
        obj.valor_pago = valor_pago;
        obj.forma_pag = forma_pag;
        array.push(obj);
        valortotal = valortotal + this.pagForm.controls[pagvalor].value;
      }
      valortotal = this.decimalFix(valortotal);
      console.log("Valor total: " + formatCurrency(valortotal, 'pt-Br', 'R$'));
      console.log(array);


      let objpag = {
        venda_id: this.objvenda.id,
        parcela: this.parcel,
        valor_pago: valortotal,
        dt_pag: this.pagForm.controls["pagdata"].value
      }
      console.log(objpag);
      let objcomprovante = {
        clinome: this.objcliente.nome,
        clicpf: this.objcliente.cpf,
        valor_parcela: this.objpaga.valor_parcela,
        valor_pago: objpag.valor_pago,
        dt_venc: this.objpaga.dt_venc,
        dt_pag: objpag.dt_pag,
        parcela: objpag.parcela,
        parcelaf: this.objpagamento.length,
        numcontrato: this.objvenda.id,
        plano: this.objvenda.nome_plano
      }
      let pagamento = {
        numerocontrato: objpag.venda_id,
        parcela: objpag.parcela,
        valorpago: formatCurrency(Number(objpag.valor_pago), 'pt-BR', 'R$'),
        datapagamento: formatDate(objpag.dt_pag, 'dd/MM/yyyy', 'pt-BR'),
        datavencimento: formatDate(objcomprovante.dt_venc, 'dd/MM/yyyy', 'pt-BR'),
        valorparcela: formatCurrency(Number(objcomprovante.valor_parcela), 'pt-BR', 'R$'),
        plano: objcomprovante.plano,
        titularnome: objcomprovante.clinome,
        titularcpf: objcomprovante.clicpf
      }

      let text = "Confirma este pagamento?"
      let parcdata = "Parcela: " + pagamento.parcela + " / Valor pago: " + pagamento.valorpago + ""

      const dialogRef = this.dialog.open(ModalfinnComponent, {
        data: {
          text: text,
          parcdata: parcdata
        },
        panelClass: 'modalestorno'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log("The dialog was closed");
        console.log(result);
        if (result) {
          this.service.postFormaPagamentoCreate(array).subscribe(pgf => {
            console.log(pgf);
            this.service.postPagamentoUpdate(objpag).subscribe(pg => {
              console.log(pg);
              this.objcomprovante = objcomprovante;
              let logobj = {
                objeto: 'Pagamento',
                operacao: 'Baixa de parcela',
                descricao: "Baixa de parcela número " + pagamento.parcela + " da venda " + pagamento.plano + " - contrato nº " + pagamento.numerocontrato + " - titular " + pagamento.titularnome + " - CPF: " + pagamento.titularcpf + ". Valor da parcela: " + pagamento.valorparcela + " - Vencimento da parcela: " + pagamento.datavencimento + " - Valor pago: " + pagamento.valorpago + " - Data do Pagamento: " + pagamento.datapagamento + ""
              }
              this.service.createLogObj(logobj).subscribe(u => {
                console.log(u);
                this.showcomprovante = 1;
                this.service.getPagamento(this.objvenda.id).subscribe(pag => {
                  console.log(pag);
                  this.objpagamento = pag.pagamento;
                  console.log(this.objpagamento);
                  alert("Pagamento cadastrado com sucesso.");
                });

              });
            });
          });
        }
      });

    }
    else {
      alert("Preencha todos os dados")
    }
    // console.log(objpag);
    // console.log(JSON.stringify(objpag));


  }

  cancelPag() {
    console.log(this.pagar);
    this.pagar = 0;
    this.parcel = 0;
    this.pagForm.reset();
    console.log(this.pagar);
  }

  comprovaPag(parcela: any, index: any) {
    let parcelaf = this.objpagamento.length;
    // console.log(parcelaf);
    this.showcomprovante = 1;
    this.parcel = this.objpagamento[index].parcela;
    console.log(this.objpagamento[index])
    this.objcomprovante = {
      clinome: this.objcliente.nome,
      clicpf: this.objcliente.cpf,
      valor_parcela: this.objpagamento[index].valor_parcela,
      valor_pago: this.objpagamento[index].valor_pago,
      dt_venc: this.objpagamento[index].dt_venc,
      dt_pag: this.objpagamento[index].dt_pag,
      parcela: this.objpagamento[index].parcela,
      parcelaf: parcelaf,
      numcontrato: this.objvenda.id,
      plano: this.objvenda.nome_plano
    }
    console.log(this.objcomprovante);
    // window.open('#/comprovantepagamento', '_blank')
  }

  massCreatePag() {
    this.service.getVenda().subscribe(pag => {
      // console.log(pag);
      // console.log(pag.Vendas);
      let venda = pag.Vendas;
      let arraylength = pag.Vendas.length;
      console.log(venda);
      for (let p = 0; p < arraylength; p++) {
        this.objvenda = venda[p];
        console.log(this.objvenda);
        this.datavencimento = new Date(this.objvenda.venc_priparcela);
        console.log(this.datavencimento);
        // console.log(this.objvenda.venc_parcela);
        this.datavencimento.setDate(this.objvenda.venc_parcela);
        console.log(this.datavencimento);
        for (let i = 0; i <= (Number(this.objvenda.qtd_parcelas) - 1); i++) {
          let newParcela = {
            venda_id: this.objvenda.id,
            parcela: i + 1,
            dt_venc: '',
            valor_parcela: 0.0,

          }
          if (i == 0) {
            newParcela.valor_parcela = this.objvenda.valor_priparcela;
            //newParcela.dt_venc = formatDate(new Date(this.objvenda.venc_priparcela), 'yyy-MM-dd', 'en');
            let priparc = new Date(this.objvenda.venc_priparcela);
            let priparcela = priparc.setHours(priparc.getHours() + 4);
            let priparcelaformat = formatDate(priparcela, 'yyy-MM-dd', 'en');
            newParcela.dt_venc = priparcelaformat;
            // newParcela.dt_venc = new Date(this.objvenda.venc_priparcela);

          }
          else {
            newParcela.valor_parcela = this.objvenda.valor_parcela;
            let d = new Date(this.datavencimento.setMonth(this.datavencimento.getMonth() + 1));
            let mydt = formatDate(new Date(d), 'yyyy-MM-dd', 'en');
            newParcela.dt_venc = mydt;
          }
          this.pagamento = newParcela;
          // this.pagamento.push(newParcela);
          console.log(this.pagamento);
          const objp = JSON.stringify(this.pagamento);
          this.service.postPagamentoCreate(objp).subscribe(p => {
            console.log(p);
          });
        }
      }
    });
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
    let fcontrol = this.nvendaForm.controls[input];
    console.log(fcontrol.value);
    if (!(fcontrol.value.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/))) {
      fcontrol.setValue('');
    }
  }

  getkey(event: KeyboardEvent, type: any) {
    console.log(event);
    // if (event.key.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/)) {
    //   console.log(event.charCode);
    //   console.log(event.key);
    // }
    this.tools.getKeyPress(event, type);
  }
  checkCoin(t: string) {
    let target = this.vendaForm.controls[t].value;
    console.log(target);
    if (Number(target) < 0) {
      let nt = Number(target * (-1));
      this.vendaForm.controls[t].setValue(nt);
    }
  }








  // FUNÇÕES VENDAS NÃO FINANCIADAS 


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
  buscaProduto() {
    if (this.nvendaForm.controls["buscaproduto"].value.length >= 3) {
      let unidade = this.getUnidadeTable(this.user.unidade);

      // if (this.user.unidade == 'Partmed'){
      //   unidade = 'prodni1'
      // }
      let search = {
        unidade: unidade,
        busca: this.nvendaForm.controls["buscaproduto"].value
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
    if (this.nvendaForm.controls["buscaproduto"].value.length < 3) {
      this.objbuscap = [];
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
  calcPercent() {
    if (this.produtos[0] != undefined) {
      console.log(this.produtos);
      let vala = this.nvendaForm.controls["valorcomercial"].value;
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
      //  this.nvendaForm.controls["desconto"].setValue(value);
      this.discount = value;
      this.totalprodutos = sum;
      console.log(value);
      //let result = value + "%";
      // //console.log(result);

    }
  }
  addProduto(produto: any, index: any) {
    //this.produtos.tipo = 'tbl';
    this.produtos.push(this.objbuscap[index]);
    console.log(this.produtos);
    this.objbuscap = [];
    this.nvendaForm.controls["buscaproduto"].setValue('');
    this.nvendaForm.controls["desconto"].setValue(0);
    this.inputAvaliacao();
    this.calcPercent();
    // this.calcDesconto();
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
        this.nvendaForm.controls["buscaproduto"].setValue('');
        this.nvendaForm.controls["desconto"].setValue(0);
        this.inputAvaliacao();
        this.calcPercent();
        this.prodemg = 1;
      }
    })
  }
  fixValues() {
    let vcom = this.nvendaForm.controls["valorcomercial"].value;
    let vent = this.totalentrada;
    if (vcom < vent) {
      alert("Valor da entrada maior que o valor comercial, recadastre a(s) entrada(s)")
      this.totalentrada = 0;
      this.fentradas = [];
    }
  }
  inputAvaliacao() {
    if (this.prevavaliacao != this.nvendaForm.controls["valoravaliacao"].value) {
      this.prevavaliacao = this.nvendaForm.controls["valoravaliacao"].value;
      console.log(this.nvendaForm.value);
      if (this.nvendaForm.controls["valoravaliacao"].value > 0) {
        this.showcontent = 1;
      }
      else {
        this.showcontent = 0;
      }
      //this.nvendaForm.controls["valorcomercial"].setValue(0);
      //this.nvendaForm.controls["valorfinanciado"].setValue(0);
      this.totalentrada = 0;
      this.fentradas = [];
      this.nvendaForm.controls["desconto"].setValue(0);
      this.prevdesc = 0;
      this.nvendaForm.controls["valorentrada"].setValue(0);
      this.nvendaForm.controls["valorcomercial"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
      this.nvendaForm.controls["valorfinanciado"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
      this.nvendaForm.controls["parcelamento"].setValue('SJUROS');
      this.nvendaForm.controls["fpagparcela"].setValue('BOLETO');
      let tot = ((this.total - this.nvendaForm.controls["valoravaliacao"].value) / this.total) * 100;
      console.log(tot);
      //this.calcDesconto();
      this.fixValues();
      this.setTotFin();
      this.calcPercent();
      this.objparcelamento();
      // this.nvendaForm.controls["qtdparcelas"].setValue(this.arraysjuros[0].qtdparcelas);
      // console.log(this.nvendaForm.controls["qtdparcelas"].value);
    }
  }
  showFpag() {
    if (this.nvendaForm.controls["valorcomercial"].value > 0) {
      let vm = this.nvendaForm.controls["valorcomercial"].value;
      const dialogRef = this.dialog.open(ModalfpagComponent, {
        data: {

        },
        panelClass: 'newprodutomodal'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
        //  this.fentradas = result.entradas;
        //  this.totalentrada = result.totalentrada;
        //  this.totalentradajf = result.totalentradajf;
        //  this.setEntrada();
      });
    }
    else {
      alert("Preencha o valor da avaliação");
    }
  }
  fixPercentage() {
    console.log(this.nvendaForm.controls["desconto"].value);
    if (this.nvendaForm.controls["desconto"].value > 100) {
      this.nvendaForm.controls["desconto"].setValue(100);
    }
    if (this.nvendaForm.controls["desconto"].value < 0) {
      this.nvendaForm.controls["desconto"].setValue(0);
    }
    console.log(this.nvendaForm.controls["desconto"].value);
  }
  calculateDesconto() {
    let valor = this.nvendaForm.controls["desconto"].value;
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
      this.nvendaForm.controls["desconto"].setValue(0);
    }
    else {
      if (this.nvendaForm.controls["desconto"].value > 0) {
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
                      val = (Number(this.nvendaForm.controls["desconto"].value) * Number(this.nvendaForm.controls["valoravaliacao"].value) / 100)
                      val = Number(this.nvendaForm.controls["valoravaliacao"].value) - val;
                      this.nvendaForm.controls["valorcomercial"].setValue(val);
                      this.setTotFin();
                      this.prevdesc = this.nvendaForm.controls["desconto"].value;
                    }
                    else {
                      this.nvendaForm.controls["desconto"].setValue(0);
                      this.nvendaForm.controls["valorcomercial"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
                      this.setTotFin();
                      this.prevdesc = this.nvendaForm.controls["desconto"].value;
                      alert("Senha incorreta");
                    }
                  })
                } else {
                  this.nvendaForm.controls["desconto"].setValue(0);
                  this.nvendaForm.controls["valorcomercial"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
                  this.setTotFin();
                  this.prevdesc = this.nvendaForm.controls["desconto"].value;
                }
              });
            }
            else {
              this.nvendaForm.controls["desconto"].setValue(0);
              this.nvendaForm.controls["valorcomercial"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
              this.setTotFin();
              this.prevdesc = this.nvendaForm.controls["desconto"].value;
            }
          })
          //  this.nvendaForm.controls["desconto"].setValue(0);
        }
        else {
          if (this.nvendaForm.controls["desconto"].value > 0) {
            val = (Number(this.nvendaForm.controls["desconto"].value) * Number(this.nvendaForm.controls["valoravaliacao"].value) / 100)
            val = Number(this.nvendaForm.controls["valoravaliacao"].value) - val;
            this.nvendaForm.controls["valorcomercial"].setValue(val);
            this.prevdesc = this.nvendaForm.controls["desconto"].value;
          }
          if (this.nvendaForm.controls["desconto"].value == 0) {
            this.nvendaForm.controls["valorcomercial"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
            this.prevdesc = this.nvendaForm.controls["desconto"].value;
          }
          this.setTotFin();
        }
      }
      if (this.nvendaForm.controls["desconto"].value == 0) {
        this.nvendaForm.controls["valorcomercial"].setValue(this.nvendaForm.controls["valoravaliacao"].value);
        this.prevdesc = this.nvendaForm.controls["desconto"].value;
      }
      this.setTotFin();
    }

  }
  setTotFin() {
    let vcomercial = this.nvendaForm.controls["valorcomercial"].value;
    let vfinanciado = vcomercial - this.totalentrada;
    if (vfinanciado < 0) {
      //this.nvendaForm.controls["valorfinanciado"].setValue(0);
      this.nvendaForm.controls["desconto"].setValue(0);
      this.calculateDesconto();
      alert("Valor de entrada maior que valor comercial");
    }
    else {
      this.nvendaForm.controls["valorfinanciado"].setValue(vfinanciado);
    }
    console.log(this.nvendaForm.controls["valorcomercial"].value);
    console.log(this.totalentrada);
    if (this.totalentrada > 0) {
      this.nvendaForm.controls['valorentrada'].setValue(this.totalentrada);
      let entrada = Number(this.nvendaForm.controls['valorentrada'].value);
      let comercial = Number(this.nvendaForm.controls['valorcomercial'].value);
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
      this.nvendaForm.controls['valorentrada'].setValue(0);
      if (this.nvendaForm.controls['valorfinanciado'].value > 0) {
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
    //   this.nvendaForm.controls["parcelamento"].setValue(this.tipoparcelamento.val);
    // }
  }
  objparcelamento() {
    // let totfinanciado = Number(this.nvendaForm.controls["valorfinanciado"].value);
    // let arraycjuros = [];
    // let arraysjuros = [];
    // this.tipoparcelamento = [];
    // let juroscategoria: number = 0;
    // if (this.nvendaForm.controls["fpagparcela"].value == 'BOLETO') {
    //   let fjuroscategoria = ((this.taxas.jurosboleto) / 100);
    //   juroscategoria = Number(fjuroscategoria);
    // }
    // if (this.nvendaForm.controls["fpagparcela"].value == 'CHEQUE') {
    //   let fjuroscategoria = ((this.taxas.juroscheque) / 100);
    //   juroscategoria = Number(fjuroscategoria);
    // }
    // //let qtdparcelas:number;
    // for (let qtdparcelas = 7; qtdparcelas <= 24; qtdparcelas++) {
    //   let jurosparcela = Number(this.jurosParcelaNoFix(qtdparcelas));
    //   let taxaadicional = Number(this.taxas.taxaadicional);
    //   //=(((totfinanciado+((totfinanciado*juroscategoria)*qtdparcelas)/24)*(1+jurosparcela)^qtdparcelas)/qtdparcelas)+taxaadicional
    //   // let valparcelaf = (((totfinanciado + ((totfinanciado * juroscategoria) * qtdparcelas) / 24) * (1 + jurosparcela) ** qtdparcelas) / qtdparcelas) + taxaadicional;
    //   let valparcela = this.calculateParcela(totfinanciado, juroscategoria, qtdparcelas, jurosparcela, taxaadicional);
    //   let valtotal = valparcela * qtdparcelas;
    //   valparcela = this.tools.decimalFix(valparcela);
    //   valtotal = this.tools.decimalFix(valtotal);
    //   let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    //   let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    //   let desc = "" + qtdparcelas + "x de " + valpshow + "";
    //   let obj = {
    //     valparcela: valparcela,
    //     valtotal: valtotal,
    //     desc: desc,
    //     qtdparcelas: qtdparcelas
    //   }
    //   if (obj.valparcela >= 100) {
    //     arraycjuros.push(obj);
    //   }
    //   //    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    // }
    // for (let qtdparcelas = 1; qtdparcelas <= 6; qtdparcelas++) {
    //   let valparcela = totfinanciado / qtdparcelas;
    //   let valtotal = valparcela * qtdparcelas;
    //   valparcela = this.tools.decimalFix(valparcela);
    //   valtotal = this.tools.decimalFix(valtotal);
    //   let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    //   let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    //   let desc = "" + qtdparcelas + "x de " + valpshow + "";
    //   let obj = {
    //     valparcela: valparcela,
    //     valtotal: valtotal,
    //     desc: desc,
    //     qtdparcelas: qtdparcelas
    //   }
    //   if (obj.valparcela >= 100) {
    //     arraysjuros.push(obj);
    //   }
    //   //    alert("Valor total a ser pago: " + valshow + " em " + qtdparcelas + "x de " + valpshow + "");
    // }
    // if (arraysjuros.length == 0) {
    //   let valparcela = totfinanciado / 1;
    //   let valtotal = valparcela * 1;
    //   valparcela = this.tools.decimalFix(valparcela);
    //   valtotal = this.tools.decimalFix(valtotal);
    //   let valshow = formatCurrency(valtotal, 'pt-BR', 'R$');
    //   let valpshow = formatCurrency(valparcela, 'pt-BR', 'R$');
    //   let desc = "" + 1 + "x de " + valpshow + "";
    //   let obj = {
    //     valparcela: valparcela,
    //     valtotal: valtotal,
    //     desc: desc,
    //     qtdparcelas: 1
    //   }
    //   arraysjuros.push(obj);
    // }
    // console.log(arraysjuros);
    // console.log(arraycjuros);
    // this.arraycjuros = arraycjuros;
    // this.arraysjuros = arraysjuros;
    // let array = [];
    // if (this.arraysjuros.length > 0) {
    //   let obj = {
    //     val: "SJUROS",
    //     desc: "ATÉ 6X SEM JUROS"
    //   }
    //   array.push(obj);
    // }
    // if (this.arraycjuros.length > 0) {
    //   let obj = {
    //     val: "CJUROS",
    //     desc: "ATÉ 24X"
    //   }
    //   array.push(obj);
    // }
    // this.tipoparcelamento = array;
    // this.nvendaForm.controls["parcelamento"].setValue('SJUROS');
    // this.nvendaForm.controls["qtdparcelas"].setValue(this.arraysjuros[0].qtdparcelas);
  }
  resetQtdParc() {
    // console.log(this.nvendaForm.controls["parcelamento"].value);
    // this.nvendaForm.controls["qtdparcelas"].reset();
  }
  excluiProduto(index: any) {
    if (this.produtos[index].produto == 'EMG') {
      this.prodemg = 0;
    }
    this.produtos.splice(index, 1);
    console.log(this.produtos);
    // //    console.log(this.produtos[0]);
    this.nvendaForm.controls["desconto"].setValue(0);
    // //console.log(this.produtos[0].valor);
    this.inputAvaliacao();
    this.calcPercent();
    if (this.produtos[0] == undefined) {
      this.discount = 0;
      this.nvendaForm.controls["valorcomercial"].setValue(0);
      this.nvendaForm.controls["valoravaliacao"].setValue(0);
      this.nvendaForm.controls["valorfinanciado"].setValue(0);
      this.nvendaForm.controls["desconto"].setValue(0);
      this.fentradas = [];
      this.totalentrada = 0;
    }
  }
}


