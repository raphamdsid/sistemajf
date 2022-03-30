import { Component, OnInit, ElementRef, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ControlContainer, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import * as html2canvas from 'html2canvas';
import { ConsultaService } from '../services/consulta.service';
import { BuscaCepService } from '../services/buscacep.service';
import { ModalComponent } from './modal/modal.component';
import { ModalfinComponent } from './modalfin/modalfin.component';
import { cpf } from 'cpf-cnpj-validator';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";
// import { exists } from 'node:fs';



@Component({
  selector: 'app-cadastrocliente',
  templateUrl: './cadastrocliente.component.html',
  styleUrls: ['./cadastrocliente.component.scss']
})


export class CadastroclienteComponent implements OnInit {
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
  dep1: any = '';
  dep2: any = '';
  dep3: any = '';
  dep4: any = '';
  formobj: any = null;
  buscaclientecpf: String = '';
  objbusca: any = [];
  enabletitba: Number = 1;
  enabletitbb: Number = 1;
  enabletitbc: Number = 1;
  operacao: Number = 0;
  // depnome: string = '';
  // depcpf: string = '';
  // deprg: string = '';
  // deporgao: string = '';
  // depnasc: string = '';
  // depgen: string = '';

  options = [
    { name: "option1", value: 1 },
    { name: "option2", value: 2 }
  ]

  qtdparcelas: number = 0;
  // qtdparcelas = [
  //   { qtd: "1", value: 1 },
  //   { qtd: "2", value: 2 },
  //   { qtd: "3", value: 3 },
  //   { qtd: "4", value: 4 },
  //   { qtd: "5", value: 5 },
  //   { qtd: "6", value: 6 },
  //   { qtd: "7", value: 7 },
  //   { qtd: "8", value: 8 },
  //   { qtd: "9", value: 9 },
  //   { qtd: "10", value: 10 },
  //   { qtd: "11", value: 11 },
  //   { qtd: "12", value: 12 },
  //   { qtd: "13", value: 13 },
  //   { qtd: "14", value: 14 },
  //   { qtd: "15", value: 15 },
  //   { qtd: "16", value: 16 },
  //   { qtd: "17", value: 17 },
  //   { qtd: "18", value: 18 },
  //   { qtd: "19", value: 19 },
  //   { qtd: "20", value: 20 },
  //   { qtd: "21", value: 21 },
  //   { qtd: "22", value: 22 },
  //   { qtd: "23", value: 23 },
  //   { qtd: "24", value: 24 },
  //   { qtd: "25", value: 25 },
  //   { qtd: "26", value: 26 },
  //   { qtd: "27", value: 27 },
  //   { qtd: "28", value: 28 },
  //   { qtd: "29", value: 29 },
  //   { qtd: "30", value: 30 },
  //   { qtd: "31", value: 31 },
  //   { qtd: "32", value: 32 },
  //   { qtd: "33", value: 33 },
  //   { qtd: "34", value: 34 },
  //   { qtd: "35", value: 35 },
  //   { qtd: "36", value: 36 }
  // ]



  planos = [
    { nome: "Pramelhor", value: 1 },
    { nome: "Pramelhor GOLD 1 pessoa", value: 2 },
    { nome: "Pramelhor GOLD 1 titular + 1 dependente", value: 3 },
    { nome: "Pramelhor GOLD 1 titular + 2 dependentes", value: 4 },
    { nome: "Pramelhor GOLD 1 titular + 3 dependentes", value: 5 },
    { nome: "Pramelhor GOLD 1 titular + 4 dependentes", value: 6 }


  ]

  hidedescontos: number = 1;
  depbtnenable: number = 0;
  // depaddenable: number = 0;
  parcela: number = 1;
  valortot: number = 0;
  depNome: string = '';
  depCpf: string = '';
  depRg: string = '';
  depOrg: string = '';
  depNasc: any = '';
  depGen: string = '';
  dependentesx: any;
  testpage: string = '';
  titNome: string = '';
  tNome: string = '';
  tabindex: number = 0;
  valorf: Number = 0;
  valorft: Number = 0;
  valorparcelaf: any = 0;
  showcarne: Number = 0;
  public enabletitb: number = 1;
  public validtit: number = 0;
  public showdeplist: number = 0;
  dependentes: any;


  depForm: any;
  profileForm: any;

  public finForm = new FormGroup({
    finformapag: new FormControl(''),
    finvalorfinal: new FormControl(''),
    finpriparcela: new FormControl(''),
    finadesao: new FormControl(''),
    finoptpag: new FormControl("parcelado"),
    finnparcelas: new FormControl(''),
    finplano: new FormControl(''),
    finvencpri: new FormControl(''),
    finvenc: new FormControl(''),
    fincartao: new FormControl(''),
    finvalorparcela: new FormControl(''),
    finvalordesconto: new FormControl(''),
    finvalorfinaltot: new FormControl(''),
    findesconto: new FormControl(1)

  });
  tcontrato: number = 0;
  enabletitinc: number = 0;
  opag: any;
  showcartao: number = 0;
  objcliente: any;
  cep: any;
  objcep: any = [];
  depaddenable: number = 1;
  objdepedit: any;
  depsaveenable: number = 1;
  depeditenable: number = 1;
  depobj: any;
  editid: any;
  allowedroles = ['vendedor', 'admin', 'gerente'];

  @ViewChild('titularcpf', { static: false }) titcpf: any;
  @ViewChild('dependentecpf', { static: false }) depcpf: any;
  foundcliente: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService, private http: HttpClient,
    private cepService: BuscaCepService) {
    this.userForm = this.formBuilder.group({

    });


  }
  ngOnInit(): void {
    // this.auth.isAuth();
    // this.auth.getSessionItem();
    // this.auth.checkRole(this.allowedroles);
    this.profileForm = new FormGroup({
      buscacliente: new FormControl(null),
      titularnome: new FormControl('', Validators.required),
      titularcpf: new FormControl('', Validators.required),
      titularrg: new FormControl('', Validators.required),
      titularorgao: new FormControl('', Validators.required),
      titularnasc: new FormControl('', Validators.required),
      titulargen: new FormControl('', Validators.required),
      titularemail: new FormControl('', [Validators.required, Validators.email]),
      titularcel: new FormControl('', Validators.required),
      titulartel: new FormControl('', Validators.required),
      titularendereco: new FormControl('', Validators.required),
      titularcep: new FormControl('', Validators.required),
      titularnum: new FormControl('', Validators.required),
      titularcomp: new FormControl(null),
      titularbairro: new FormControl('', Validators.required),
      titularcidade: new FormControl('', Validators.required),
      titularestado: new FormControl('', Validators.required),
      titularwhatsapp: new FormControl(false)
    });
    this.depForm = new FormGroup({
      depnome: new FormControl('', Validators.required),
      depcpf: new FormControl(null),
      deprg: new FormControl(null),
      deporgao: new FormControl(null),
      depnasc: new FormControl('', Validators.required),
      depgen: new FormControl('', Validators.required),
    });

    console.log("Obj Cliente: " + this.objcliente);

    this.service.getCliente().subscribe(c => {
      this.objcliente = c;
      console.log("Obj Cliente: ", this.objcliente);

    },
      (e) => {

        this.objcliente = {
          nome: ''
        }
        // alert("Erro de conexão");


      });
    this.enabletitb = 1;
    this.showdeplist = 0;
    // this.dependentes.shift();
    this.depForm.disable();
    this.profileForm.disable();
    this.depbtnenable = 1;
    this.depaddenable = 1;
    this.finForm.controls['fincartao'].disable();
    this.qtdparcelas = 0;
    this.finForm.value.finnparcelas = this.qtdparcelas;
    this.finForm.controls['finnparcelas'].setValue('');
    this.finForm.disable();
    this.formobj = {
      var1: 'enabletitb',
      var2: 2
    }





    //this.adesao='';
    //this.finForm.value.finnparcelas = 1;
    //this.priparcela = this.valorparcela;

    //  this.tNome='';
    // this.titNome='';

  }

  showDeps() {
    console.log(this.dependentesx);
  }

  addDep() {
    this.dependentesx = [];
    this.depobj = [];
    this.depeditenable = 1;
    this.depsaveenable = 0;
    this.depForm.enable();
    this.depForm.reset();
  }

  saveDep() {
    console.log(this.depForm.valid)
    if (this.depForm.valid) {
      this.dependentesx = {
        cli_id: this.objcliente.id,
        nome: this.depForm.controls["depnome"].value,
        cpf: this.depForm.controls["depcpf"].value,
        rg: this.depForm.controls["deprg"].value,
        orgao: this.depForm.controls["deporgao"].value,
        dtnasc: this.depForm.controls["depnasc"].value,
        genero: this.depForm.controls["depgen"].value
      };
      const obj = JSON.stringify(this.dependentesx);
      this.service.postDependenteCreate(obj).subscribe(c => {
        console.log(c);

        this.service.getDependenteList(this.objcliente.id).subscribe(c => {
          console.log(c);
          this.dependentes = c.dependentes;
          if (this.dependentes.length >= 4) {
            this.depaddenable = 1;
          }
          if (this.dependentes.length < 4) {
            this.depaddenable = 0;
          }
          let dependente = JSON.parse(obj);
          let logobj = {
            objeto: 'Dependente',
            operacao: 'Criação',
            descricao: "Criação do dependente " + dependente.nome + ""
          }
          this.service.createLogObj(logobj).subscribe(u => {
            console.log(u);
          });
        });
      });


      this.depForm.disable();
      this.depForm.reset()
      this.dependentesx = [];
      this.depbtnenable = 0;
      this.depsaveenable = 1;
      this.depeditenable = 1;

    }
    else {
      alert("Preencha todos os campos.")
    }
  }

  trocarValor(valor: number) {
    this.enabletitb = valor;

  }

  incTitular() {
    this.operacao = 2;
    this.enabletitba = 0;
    this.enabletitbb = 1;
    this.enabletitbc = 1;
    this.depaddenable = 1;
    this.depsaveenable = 1;
    this.depeditenable = 1;
    this.depForm.disable();
    this.depForm.reset();
    this.dependentes = [];
    this.profileForm.reset();
    this.profileForm.enable();
    this.profileForm.controls["buscacliente"].setValue('');
    this.profileForm.controls["buscacliente"].reset();
    this.profileForm.controls["buscacliente"].disable();
    // this.enabletitinc = 1;
    this.objcliente = [];
    this.objbusca = [];



  }


  delDep() {
    this.dependentes.pop();
    this.depaddenable = 1;
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

    console.log(this.profileForm.value);
    console.log(this.profileForm.valid);
    console.log(this.profileForm);
    let isvalid = this.profileForm.valid;

    if (isvalid) {

      console.log('isvalid')
      this.objcliente = {
        id: this.objcliente.id,
        cpf: this.profileForm.controls["titularcpf"].value,
        nome: this.profileForm.controls["titularnome"].value,
        rg: this.profileForm.controls["titularrg"].value,
        orgao: this.profileForm.controls["titularorgao"].value,
        dtnasc: this.profileForm.controls["titularnasc"].value,
        genero: this.profileForm.controls["titulargen"].value,
        email: this.profileForm.controls["titularemail"].value,
        celular: this.profileForm.controls["titularcel"].value,
        telefone: this.profileForm.controls["titulartel"].value,
        endereco: this.profileForm.controls["titularendereco"].value,
        cep: this.profileForm.controls["titularcep"].value,
        numero: this.profileForm.controls["titularnum"].value,
        complemento: this.profileForm.controls["titularcomp"].value,
        bairro: this.profileForm.controls["titularbairro"].value,
        cidade: this.profileForm.controls["titularcidade"].value,
        estado: this.profileForm.controls["titularestado"].value
      }


      // this.objcliente.cpf = this.profileForm.controls["titularcpf"].value,
      //   this.objcliente.nome = this.profileForm.controls["titularnome"].value,
      //   this.objcliente.rg = this.profileForm.controls["titularrg"].value,
      //   this.objcliente.orgao = this.profileForm.controls["titularorgao"].value,
      //   this.objcliente.dtnasc = this.profileForm.controls["titularnasc"].value,
      //   this.objcliente.genero = this.profileForm.controls["titulargen"].value,
      //   this.objcliente.email = this.profileForm.controls["titularemail"].value,
      //   this.objcliente.celular = this.profileForm.controls["titularcel"].value,
      //   this.objcliente.telefone = this.profileForm.controls["titulartel"].value,
      //   this.objcliente.endereco = this.profileForm.controls["titularendereco"].value,
      //   this.objcliente.cep = this.profileForm.controls["titularcep"].value,
      //   this.objcliente.numero = this.profileForm.controls["titularnum"].value,
      //   this.objcliente.complemento = this.profileForm.controls["titularcomp"].value,
      //   this.objcliente.bairro = this.profileForm.controls["titularbairro"].value,
      //   this.objcliente.cidade = this.profileForm.controls["titularcidade"].value,
      //   this.objcliente.estado = this.profileForm.controls["titularestado"].value

      if (this.profileForm.controls["titularwhatsapp"].value == true) {
        this.objcliente.whatsapp = 1;
      }
      else {
        this.objcliente.whatsapp = 0;
      }

      console.log(this.objcliente.id);
      console.log(this.objcliente);
      if (this.operacao == 1) {
        const obj = JSON.stringify(this.objcliente);
        this.service.postClienteEdit(obj).subscribe(c => {
          console.log(c);
          let logobj = {
            objeto: 'Cliente',
            operacao: 'Atualização',
            descricao: "Atualização dos dados do cliente " + this.objcliente.nome + ". CPF: " + this.objcliente.cpf + ""
          }
          this.service.createLogObj(logobj).subscribe(u => {
            console.log(u);
          });
          alert("Cliente atualizado com sucesso.")
        });
        console.log(this.objcliente);
        this.afterCliente();
      }
      if (this.operacao == 2) {

        const cpf = this.objcliente.cpf;
        console.log(cpf);
        this.service.getClienteCpf(cpf).subscribe(c => {
          console.log(c);
          if (c.cpf != undefined) {
            alert("CPF já encontra-se cadastrado no sistema.")

          }
          else {

            this.objcliente.stats = "ativo";
            const obj = JSON.stringify(this.objcliente);
            this.service.postClienteCreate(obj).subscribe(c => {
              console.log(c);
              let objcliente = JSON.parse(obj);
              let logobj = {
                objeto: 'Cliente',
                operacao: 'Criacão',
                descricao: "Criação do cliente " + objcliente.nome + ". CPF: " + objcliente.cpf + ""
              }
              this.service.createLogObj(logobj).subscribe(u => {
                console.log(u);
              });
            });
            console.log(this.objcliente);
            console.log(this.objcliente.id);
            const dialogRef = this.dialog.open(ModalComponent, {
              panelClass: 'modalCadastroTitular'
            });

            dialogRef.afterClosed().subscribe(result => {
              console.log(`Dialog result: ${result}`);
              if (result) {
                this.service.getClienteCpf(this.objcliente.cpf).subscribe(c => {
                  console.log(c);
                  this.objcliente = c;
                  console.log(this.objcliente);
                  console.log(this.objcliente.id);
                  this.afterCliente();
                });

                this.tabindex = 1;
                this.depForm.disable();
                this.depaddenable = 0;
                this.dependentes = [];
                this.dependentesx = [];
              }
            });
            this.afterCliente();
          }
        });
      }
    }

    else {
      alert("Preencha todos os campos.")
    }
  }

  afterCliente() {
    this.titNome = this.profileForm.value.titularnome;
    this.profileForm.disable();
    this.enabletitba = 1;
    this.enabletitbb = 0;
    this.enabletitbc = 0;
    this.finbbenable = 1;
    this.enabletitinc = 0;
    this.service.getClienteCpf(this.objcliente.cpf).subscribe(c => {
      console.log(c);
      this.objcliente = c;
      console.log(this.objcliente);
      console.log(this.objcliente.id);
    });
  }
  editDep() {

    this.objdepedit = {
      id: this.editid,
      nome: this.depForm.controls["depnome"].value,
      cpf: this.depForm.controls["depcpf"].value,
      rg: this.depForm.controls["deprg"].value,
      orgao: this.depForm.controls["deporgao"].value,
      dtnasc: this.depForm.controls["depnasc"].value,
      genero: this.depForm.controls["depgen"].value,
      cli_id: this.objcliente.id,

    }

    // this.objdepedit.nome = this.depForm.controls["depnome"].value,
    // this.objdepedit.cpf = this.depForm.controls["depcpf"].value,
    // this.objdepedit.rg = this.depForm.controls["deprg"].value,
    // this.objdepedit.orgao = this.depForm.controls["deporgao"].value,
    // this.objdepedit.dtnasc = this.depForm.controls["depnasc"].value,
    // this.objdepedit.genero = this.depForm.controls["depgen"].value,


    console.log(this.objdepedit);
    const obj = JSON.stringify(this.objdepedit);
    console.log(obj);
    this.service.postDependenteEdit(obj).subscribe(c => {
      console.log(c);
      let dependente = JSON.parse(obj);
      let logobj = {
        objeto: 'Dependente',
        operacao: 'Edição',
        descricao: "Edição dos dados do dependente " + dependente.nome + ""
      }
      this.service.createLogObj(logobj).subscribe(u => {
        console.log(u);
      });
      console.log(this.objdepedit);
      alert("Dependente atualizado com sucesso.")
      this.service.getDependenteList(this.objcliente.id).subscribe(c => {
        console.log(this.objcliente.id);
        console.log(c);
        this.dependentes = c.dependentes;
        console.log(this.dependentes.length);
        if (this.dependentes.length >= 4) {
          this.depaddenable = 1;
        }
        if (this.dependentes.length < 4) {
          this.depaddenable = 0;
        }

      });
      this.depForm.reset();
      this.depForm.disable();
      this.depeditenable = 1;
    });

    this.service.getDependenteList(this.objcliente.id).subscribe(c => {
      console.log(this.objcliente.id);
      console.log(c);
      this.dependentes = c.dependentes;
      console.log(this.dependentes.length);
      if (this.dependentes.length >= 4) {
        this.depaddenable = 1;
      }
      if (this.dependentes.length < 4) {
        this.depaddenable = 0;
      }

    });
  }

  deleteDep(dep: any, index: any) {

    console.log(this.dependentes[index].id);

    this.service.postDependenteDelete(this.dependentes[index]).subscribe(c => {
      console.log(c);
      let dependente = this.dependentes[index];
      let logobj = {
        objeto: 'Dependente',
        operacao: 'Deleção',
        descricao: "Deleção do dependente " + dependente.nome + ""
      }
      this.service.createLogObj(logobj).subscribe(u => {
        console.log(u);
      });
    });
    alert("Dependente apagado com sucesso.")

    this.service.getDependenteList(this.objcliente.id).subscribe(c => {
      console.log(this.objcliente.id);
      console.log(c);
      if (!c.dependentes) {
        this.dependentes = []
      }
      else {
        this.dependentes = c.dependentes;
      }
      console.log(this.dependentes.length);
      if (this.dependentes.length >= 4) {
        this.depaddenable = 1;
      }
      if (this.dependentes.length < 4) {
        this.depaddenable = 0;

      }

    });


  }

  fillEditDep(dep: any, index: any) {

    console.log(this.dependentes[index]);
    this.depForm.enable();
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    this.depForm.controls["depnome"].setValue(this.dependentes[index].nome);
    this.depForm.controls["depcpf"].setValue(this.dependentes[index].cpf);
    this.depForm.controls["deprg"].setValue(this.dependentes[index].rg);
    this.depForm.controls["deporgao"].setValue(this.dependentes[index].orgao);
    this.depForm.controls["depnasc"].setValue(this.dependentes[index].dtnasc);
    this.depForm.controls["depgen"].setValue(this.dependentes[index].genero);
    console.log(this.depeditenable);
    console.log(this.depsaveenable);
    this.depeditenable = 0;
    this.depsaveenable = 1;
    this.objdepedit = this.dependentes[index];
    this.editid = this.dependentes[index].id;
    console.log(this.dependentes[index]);
    console.log(this.objdepedit);
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


  setValortot() {
    console.log("Parcela: ", this.parcela);
    // if (this.planos.values(value) == "Pramelhor") {
    //  this.valortot = 1076.40;

    this.valorf = 0;
    this.valordesconto = 0;
    this.parcelcontrol = 0;
    this.desconto = 1;
    this.valorparcela = 0;
    this.valorparcelaf = 0;
    this.priparcela = 0;
    this.qtdparcelas = 0;
    this.finForm.value.finnparcelas = this.qtdparcelas;
    this.finForm.controls['finnparcelas'].setValue('');

    this.finForm.controls['finoptpag'].setValue('');
    this.finForm.controls['finformapag'].setValue('');
    console.log("Forma de Pagamento: " + this.finForm.value.finoptpag);
    if (this.finForm.value.finplano == "1") {
      this.valortot = 1076.40;
      this.tipocontrato = 1;
      this.nomeplano = "Pramelhor"
    }
    if (this.finForm.value.finplano == "2") {
      this.valortot = 1436.40;
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 pessoa"
    }
    if (this.finForm.value.finplano == "3") {
      this.valortot = 1976.40;
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 titular + 1 dependente"
    }
    if (this.finForm.value.finplano == "4") {
      this.valortot = 2696.40;
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 titular + 2 dependentes"
    }
    if (this.finForm.value.finplano == "5") {
      this.valortot = 3236.40;
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor GOLD 1 titular + 3 dependentes"
    }
    if (this.finForm.value.finplano == "6") {
      this.valortot = 3596.40;
      this.tipocontrato = 2;
      this.nomeplano = "Pramelhor Gold 1 titular + 4 dependentes"
    }
    //alert(this.valortot);
    //this.valorf= Number(this.valortot)+Number(this.adesao);
    // this.qtdparcelas = 1;
    // this.finForm.value.finnparcelas = 1;
    this.adesao = this.finForm.value.finadesao;

    this.valorft = Number(this.valortot) + Number(this.adesao);
    this.finForm.value.finvalorfinaltot = this.valorft;

    this.descontos = 1;


    this.valorf = Number(this.valortot) + Number(this.adesao);
    this.valordesconto = Number(this.valorft) - Number(this.valorf);

    this.finForm.value.finnparcelas = 1;
    this.valorparcela = (Number(this.valortot) / Number(this.qtdparcelas));
    this.valorparcelaf = this.valorparcela;
    this.priparcela = Number(this.adesao) + Number(this.valorparcelaf);

    console.log('Valor total: ', this.finForm.value.finvalorfinaltot);
    console.log('Valor descontado: ', this.finForm.value.finvalordesconto);
    console.log('Valor com desconto: ', this.valorf);
    console.log('Valor total: ', this.finForm.value.finvalorfinaltot);
    console.log('Tipo de desconto: ', this.finForm.value.findesconto);
    //console.log(this.valorparcela);


  }
  setParcela() {

    this.qtdparcelas = this.finForm.value.finnparcelas;
    if (this.finForm.value.findesconto != "Sem desconto" || this.finForm.value.optPag == "À vista") {
      this.valorf = Number(this.valorf) + Number(this.adesao);
      this.valorft = Number(this.valortot) + Number(this.adesao);
      this.finForm.value.finvalorfinaltot = this.valorft;
      this.valordesconto = Number(this.valorft) - Number(this.valorf);
      this.valorparcela = Number(this.valortot) / Number(this.qtdparcelas);
      this.valorparcelaf = this.valorparcela;
      this.priparcela = Number(this.adesao) + Number(this.valorparcelaf);
    }
    this.valorf = Number(this.valortot) + Number(this.adesao);
    this.valorft = Number(this.valortot) + Number(this.adesao);
    this.finForm.value.finvalorfinaltot = this.valorft;
    this.valordesconto = Number(this.valorft) - Number(this.valorf);
    this.valorparcela = Number(this.valortot) / Number(this.qtdparcelas);
    this.valorparcelaf = this.valorparcela;
    this.priparcela = Number(this.adesao) + Number(this.valorparcelaf);

    if (this.finForm.value.finnparcelas == 1) {
      //this.parcelcontrol = 1;
      this.finForm.controls['finnparcelas'].disable();
      this.finForm.controls['finoptpag'].setValue("À vista");
      this.finForm.value.findesconto = "5%";
      this.finForm.controls['findesconto'].setValue("5%");
      this.finForm.controls['findesconto'].disable();
      this.descontos = this.finForm.value.findesconto;
      this.parcelcontrol = 1;
      this.valorf = Number(this.valorf) * 0.95
      this.valorparcelaf = Number(this.valorf) / Number(this.qtdparcelas);
      this.hidedescontos = 0;

      this.priparcela = Number(this.adesao) + Number(this.valorparcelaf);
      this.gerentectrl = 0;
      this.valorft = Number(this.valortot) + Number(this.adesao);
      this.finForm.value.finvalorfinaltot = this.valorft;
      this.valordesconto = Number(this.valorft) - Number(this.valorf);

    }

  }
  setDesconto() {

    this.valorf = (Number(this.valortot) + Number(this.adesao))
    this.valorparcelaf = Number(this.valorparcela);
    if (this.finForm.controls['findesconto'].value == "Sem desconto") {
      //this.valorf = (Number(this.valortot) + Number(this.adesao)) * Number(100/100)
      this.valorf = Number(this.valorf) * 1;
      this.valorparcelaf = Number(this.valorparcelaf) * 1
      this.gerentectrl = 0;
      this.hidedescontos = 1;
    }
    if (this.finForm.controls['findesconto'].value == "5%") {
      this.gerentectrl = 0;
      this.valorf = Number(this.valorf) * 0.95
      this.valorparcelaf = Number(this.valorparcelaf) * 0.95
      this.hidedescontos = 1;

    }
    if (this.finForm.controls['findesconto'].value == "10%") {
      this.gerentectrl = 1;
      this.valorf = Number(this.valorf) * 0.90
      this.valorparcelaf = Number(this.valorparcelaf) * 0.90
      this.hidedescontos = 0;

    }
    this.priparcela = Number(this.valorparcelaf) + Number(this.adesao);
    this.valorft = Number(this.valortot) + Number(this.adesao);
    this.finForm.value.finvalorfinaltot = this.valorft;
    this.valordesconto = Number(this.valorft) - Number(this.valorf);

  }

  optPag() {
    this.adesao = this.finForm.value.finadesao;
    this.valorft = Number(this.valortot) + Number(this.adesao);
    this.valorf = Number(this.valortot) + Number(this.adesao);
    // if (this.finForm.controls['finoptpag'].value == "Parcelado" || this.finForm.controls['findesconto'].value == "Sem desconto") {

    // }


    if (this.finForm.value.finoptpag == "À vista") {
      this.opag = 0;
      this.hidedescontos = 0;
      this.qtdparcelas = 1;
      this.finForm.controls['finoptpag'].setValue("À vista");
      this.valorparcela = Number(this.valortot) / Number(this.qtdparcelas);
      this.valorparcelaf = Number(this.valorparcela);
      this.finForm.value.finnparcelas = this.qtdparcelas;
      this.finForm.controls['finnparcelas'].setValue(1);


      this.finForm.controls['findesconto'].setValue("5%");
      // this.descontos = this.finForm.value.findesconto;
      this.finForm.controls['finnparcelas'].disable();
      this.valorf = Number(this.valorf) * 0.95
      this.valorparcelaf = Number(this.valorf) / Number(this.qtdparcelas);
      this.finForm.controls['findesconto'].disable();

      this.priparcela = Number(this.adesao) + Number(this.valorparcelaf);
      this.gerentectrl = 0;
    }
    if (this.finForm.value.finoptpag == "Parcelado") {
      this.finForm.controls['finoptpag'].setValue("Parcelado");
      this.opag = 1;
      this.hidedescontos = 1;
      this.qtdparcelas = 2;
      this.finForm.value.finnparcelas = this.qtdparcelas;
      this.valorf = Number(this.valortot) + Number(this.adesao);
      this.valorparcela = Number(this.valortot) / Number(this.qtdparcelas);
      this.priparcela = Number(this.adesao) + Number(this.valorparcela);
      this.valorparcelaf = Number(this.valorparcela)
      this.gerentectrl = 0;
      this.finForm.controls['finnparcelas'].enable();
      // this.finForm.controls['findesconto'].enable();
      this.finForm.controls['findesconto'].setValue("Sem desconto");
      this.finForm.value.findesconto = "Sem desconto";
      this.descontos = this.finForm.value.findesconto;

    }
    console.log(this.finForm.value.finoptpag);
    this.valorft = Number(this.valortot) + Number(this.adesao);
    this.finForm.value.finvalorfinaltot = this.valorft;
    this.valordesconto = Number(this.valorft) - Number(this.valorf);
  }

  saveFin() {

    console.log("Opag: " + this.opag);
    if (this.finForm.valid) {

      if (this.opag == 1) {
        this.valorf = 0;
        this.valordesconto = 0;
      }



      this.formobj = {
        vend: this.profileForm.value.vendedor,
        origem: this.profileForm.value.origemvenda,
        uni: this.profileForm.value.unidade,
        titnome: this.profileForm.value.titularnome,
        titcpf: this.profileForm.value.titularcpf,
        titrg: this.profileForm.value.titularrg,
        titorg: this.profileForm.value.titularorgao,
        titnasc: this.profileForm.value.titularnasc,
        titgen: this.profileForm.value.titulargen,
        titemail: this.profileForm.value.titularemail,
        titcel: this.profileForm.value.titularcel,
        tittel: this.profileForm.value.titulartel,
        titend: this.profileForm.value.titularendereco,
        titcep: this.profileForm.value.titularcep,
        titnum: this.profileForm.value.titularnum,
        titcomp: this.profileForm.value.titularcomp,
        titbairro: this.profileForm.value.titularbairro,
        titcidade: this.profileForm.value.titularcidade,
        titestado: this.profileForm.value.titularestado,
        finnomeplano: String(this.nomeplano),
        finvalparc: String(this.valorparcelaf),
        finvalparct: String(this.valorparcela),
        finqtdparc: String(this.qtdparcelas),
        finformapag: String(this.finForm.value.finformapag),
        finadesao: String(this.adesao),
        finvalortotal: String(this.valorft),
        finvalorfinal: String(this.valorf),
        finvaldesc: String(this.valordesconto),
        fintipodesc: this.finForm.controls['findesconto'].value,
        finoptpag: String(this.finForm.value.finoptpag),
        finvalorplano: String(this.valortot),
        finpriparc: this.finForm.get('finpriparcela')?.value,
        finvencpri: this.finForm.get('finvencpri')?.value,
        finvenc: this.finForm.get('finvenc')?.value,
        dep1: this.dep1,
        dep2: this.dep2,
        dep3: this.dep3,
        dep4: this.dep4
      }

      this.finForm.disable();
      this.tcontrato = this.tipocontrato;
      //this.finForm.disable();
      alert("Cliente " + this.titNome + " cadastrado com sucesso.")
      this.finbaenable = 1;
      this.finbbenable = 0;
      console.log(this.formobj);
      this.showcarne = 1;
    }

    else {
      alert("Preencha todos os campos");
    }
  }
  showCartao() {
    if (this.finForm.get('finformapag')?.value == "Cartão de Crédito" || this.finForm.get('finformapag')?.value == "Recorrente") {
      this.showcartao = 1;

      console.log(this.finForm.get('fincartao')?.value);
    }
    else {
      this.finForm.controls['fincartao'].reset();
      this.showcartao = 0;
    }
  }
  calcAdesao() {
    console.log(this.adesao);
    console.log(this.priparcela);


    this.adesao = this.finForm.value.finadesao;
    this.valorft = Number(this.valortot) + Number(this.adesao);


    if (this.finForm.value.findesconto == "Sem desconto") {
      //this.valorf = (Number(this.valortot) + Number(this.adesao)) * Number(100/100)
      this.valorf = Number(this.valortot) + Number(this.adesao);
      this.valorparcelaf = Number(this.valorparcela)
      this.gerentectrl = 0;

    }
    if (this.finForm.value.findesconto == "5%" || this.finForm.value.optPag == "À vista") {
      this.gerentectrl = 0;
      this.valorf = Number(this.valorft) * 0.95
      this.valorparcelaf = Number(this.valorparcela) * 0.95
    }
    if (this.finForm.value.findesconto == "10%") {
      this.valorf = Number(this.valorft) * 0.90
      this.valorparcelaf = Number(this.valorparcela) * 0.90
      this.gerentectrl = 1;

    }

    this.priparcela = Number(this.adesao) + Number(this.valorparcelaf);

    this.finForm.value.finvalorfinaltot = this.valorft;
    this.valordesconto = Number(this.valorft) - Number(this.valorf);
  }

  seeDeps() {
    //console.log(this.dependentesx.filter (this.dependentesx.id == 0));
    console.log(this.dep1);
    console.log(this.dep2);
    console.log(this.dep3);
    console.log(this.dep4);
  }


  newCadastro() {
    this.titNome = '';
    this.enabletitinc = 0;
    this.finbaenable = 0;
    this.finbbenable = 0;
    this.tcontrato = 0;
    this.finForm.disable()
    this.finForm.reset();
    this.profileForm.reset();
    this.tabindex = 0;
    this.finForm.controls['fincartao'].reset();
    this.showcartao = 0;
    this.showcarne = 0;
    //this.formobj = null;
  }

  buscaCep() {
    // Nova variável "cep" somente com dígitos.
    // cep = cep.replace(/\D/g, '');

    if (this.profileForm.controls["titularcep"].value != null && this.profileForm.controls["titularcep"].value !== '') {
      // this.cepService.buscaCep(cep).subscribe(dados => this.populaDadosForm(dados));
      this.cepService.buscaCep(this.profileForm.controls["titularcep"].value).subscribe(d => {
        console.log(d);
        this.objcep = d;

        this.profileForm.controls["titularendereco"].setValue(this.objcep.logradouro);
        this.profileForm.controls["titularcomp"].setValue(this.objcep.complemento);
        this.profileForm.controls["titularbairro"].setValue(this.objcep.bairro);
        this.profileForm.controls["titularcidade"].setValue(this.objcep.localidade);
        this.profileForm.controls["titularestado"].setValue(this.objcep.uf);
      });
    }

  }



  buscaClienteNome() {

    if (this.profileForm.controls["buscacliente"].value.length >= 3) {
      this.service.getClienteNome(this.profileForm.controls["buscacliente"].value).subscribe(c => {
        console.log(c);
        this.objbusca = c.Clientes;
        console.log(c);
      }
      );
    }
    if (this.profileForm.controls["buscacliente"].value.length < 3) {
      this.objbusca = [];
    }
  }

  buscaClienteCpf() {

    console.log(this.profileForm.controls["buscacliente"].value)
    this.service.getClienteCpf(this.profileForm.controls["buscacliente"].value).subscribe(c => {
      console.log("Cliente encontrado: ", this.objcliente);
      this.profileForm.controls["titularnome"].setValue(c.nome);
    });
  }

  fillFormCliente(cli: any, index: any) {

    console.log(this.objbusca[index]);
    console.log(this.objbusca[index].nome);
    this.objcliente = this.objbusca[index];
    console.log(this.objcliente);
    this.profileForm.controls["buscacliente"].disable();
    this.dependentes = [];
    this.service.getDependenteList(this.objcliente.id).subscribe(c => {
      console.log(this.objcliente.id);
      console.log(c);
      if (!c.dependentes) {
        this.dependentes = []
      }
      else {
        this.dependentes = c.dependentes;
      }
      console.log(this.dependentes.length);
      if (this.dependentes.length >= 4) {
        this.depForm.disable()
        this.depaddenable = 1;
      }
      if (this.dependentes.length < 4) {
        this.depForm.disable()
        this.depaddenable = 0;
      }
    });

    // this.depForm.enable();
    this.enabletitba = 1;
    this.enabletitbb = 0;
    this.enabletitbc = 0;
    this.profileForm.controls["buscacliente"].setValue('');

    // this.profileForm.controls["titularnome"].setValue(this.objbusca[index].nome);
    // this.profileForm.controls["titularcpf"].setValue(this.objbusca[index].cpf);
    // this.profileForm.controls["titularrg"].setValue(this.objbusca[index].rg);
    // this.profileForm.controls["titularorgao"].setValue(this.objbusca[index].orgao);
    // this.profileForm.controls["titularnasc"].setValue(this.objbusca[index].dtnasc);
    // this.profileForm.controls["titulargen"].setValue(this.objbusca[index].genero);
    // this.profileForm.controls["titularemail"].setValue(this.objbusca[index].email);
    // this.profileForm.controls["titularcel"].setValue(this.objbusca[index].celular);
    // this.profileForm.controls["titulartel"].setValue(this.objbusca[index].telefone);
    // this.profileForm.controls["titularendereco"].setValue(this.objbusca[index].endereco);
    // this.profileForm.controls["titularcep"].setValue(this.objbusca[index].cep);
    // this.profileForm.controls["titularnum"].setValue(this.objbusca[index].numero);
    // this.profileForm.controls["titularcomp"].setValue(this.objbusca[index].complemento);
    // this.profileForm.controls["titularbairro"].setValue(this.objbusca[index].bairro);
    // this.profileForm.controls["titularcidade"].setValue(this.objbusca[index].cidade);
    // this.profileForm.controls["titularestado"].setValue(this.objbusca[index].estado);
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

  }
  enableBusca() {

    this.profileForm.disable();
    this.profileForm.reset();
    this.profileForm.controls["buscacliente"].enable();
    this.objbusca = [];
    this.objcliente = [];
    this.depaddenable = 1;
    this.depsaveenable = 1;
    this.depeditenable = 1;
    this.depForm.disable();
    this.depForm.reset();
    this.dependentes = [];
    this.enabletitinc = 0;
    this.enabletitba = 1;
    this.enabletitbb = 1;
    this.enabletitbc = 1;
  }

  fillDep() {

  }
  editTit() {
    this.operacao = 1;
    this.profileForm.enable();
    // this.objcliente = [];
    this.objbusca = [];
    this.profileForm.controls["buscacliente"].disable()
    this.profileForm.controls["titularcpf"].disable()
    this.enabletitinc = 1;
    this.enabletitba = 0;
    this.enabletitbb = 1;
    this.enabletitbc = 1;

  }

  deleteTit() {

    this.objcliente.stats = "deletado";
    console.log(JSON.stringify(this.objcliente));
    this.service.postClienteDel(this.objcliente).subscribe(c => {
      console.log(c);
    });
    alert("Cliente apagado com sucesso.")
    console.log(this.objcliente);
    this.profileForm.reset();
    this.objbusca = [];
    this.objcliente = [];
    this.enabletitba = 1;
    this.enabletitbb = 1;
    this.enabletitbc = 1;
    this.depaddenable = 1;
    this.depsaveenable = 1;
    this.depeditenable = 1;
    this.depForm.disable();
    this.depForm.reset();
    this.dependentes = [];
  }



  get f() {
    console.log(this.profileForm);
    return this.profileForm.controls;
  }

  cpfValid() {
    const cpf = this.profileForm.controls["titularcpf"].value;
    // validate(cpf);
    if (cpf != null && !validate(cpf)) {
      this.profileForm.controls["titularcpf"].setValue(null);
      this.titcpf.nativeElement.focus();
      alert("CPF inválido")

    }
  }
  cpfDepValid() {
    const cpf = this.depForm.controls["depcpf"].value;
    // validate(cpf);
    if (cpf != null && !validate(cpf)) {
      const cpf = this.depForm.controls["depcpf"].setValue(null);
      this.depcpf.nativeElement.focus();
      alert("CPF inválido")

    }
  }


  // generateaPDF(data: any) {
  //   var data: any = document.getElementById('contentToConverta');
  //   html2canvas(data).then(canvas => {
  //     let HTML_Width = canvas.width;
  //     let HTML_Height = canvas.height;
  //     let top_left_margin = 15;

  //     let PDF_Width = HTML_Width + (top_left_margin * 2);
  //     let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  //     let canvas_image_width = HTML_Width;
  //     let canvas_image_height = HTML_Height;
  //     let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
  //     canvas.getContext('2d');
  //     let imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     let pdf = new jsPDF('p', 'mm', 'a4');
  //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, 180, 850);
  //     for (let i = 1; i <= 2; i++) {
  //       pdf.addPage('a4', 'p');

  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(300 * i) + (top_left_margin * 2), 180, 850);
  //       // pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
  //     }
  //     pdf.save("Contrato " + this.titNome + " PRAMELHOR.pdf");
  //   });
  // }
  // generatebPDF(data: any) {
  //   var data: any = document.getElementById('contentToConvertb');
  //   html2canvas(data).then(canvas => {
  //     let HTML_Width = canvas.width;
  //     let HTML_Height = canvas.height;
  //     let top_left_margin = 15;

  //     let PDF_Width = HTML_Width + (top_left_margin * 2);
  //     let PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
  //     let canvas_image_width = HTML_Width;
  //     let canvas_image_height = HTML_Height;
  //     let totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;
  //     canvas.getContext('2d');
  //     let imgData = canvas.toDataURL("image/jpeg", 1.0);
  //     let pdf = new jsPDF('p', 'mm', 'a4');
  //     pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, 180, 850);
  //     for (let i = 1; i <= 2; i++) {
  //       pdf.addPage('a4', 'p');

  //       pdf.addImage(imgData, 'JPG', top_left_margin, -(300 * i) + (top_left_margin * 2), 180, 850);
  //       // pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height * i) + (top_left_margin * 4), canvas_image_width, canvas_image_height);
  //     }
  //     pdf.save("Contrato " + this.titNome + " PRAMELHOR GOLD.pdf");
  //   });
  // }

  //  exportAsPDF()
  //     {
  //         let data = document.getElementById('divId');  
  //         html2canvas(data).then(canvas => {
  //         const contentDataURL = canvas.toDataURL('image/png')  
  //         let pdf = new jspdf('l', 'cm', 'a4'); //Generates PDF in landscape mode
  //         // let pdf = new jspdf('p', 'cm', 'a4'); Generates PDF in portrait mode
  //         pdf.addImage(contentDataURL, 'PNG', 0, 0, 29.7, 21.0);  
  //         pdf.save('Filen ame.pdf');   
  //       }); 
  //     }


  // print(data: any) {
  //   this.pdfshow = 1;
  //   console.log(data);
  //   const opt: jsPDFOptions = {
  //     orientation: 'p',
  //     unit: 'pt',
  //     format: 'a4',
  //   };
  //   const options = {
  //     background: 'white',
  //     scale: 3
  //   };


  //   html2canvas(data, options).then((canvas) => {

  //     var img = canvas.toDataURL("image/jpeg", 1.0);
  //     var doc = new jsPDF('p', 'mm', 'a4');

  //     // // Add image Canvas to PDF
  //     const bufferX = 5;
  //     const bufferY = 5;
  //     const imgProps = (<any>doc).getImageProperties(img);
  //     const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
  //     const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //     let totalPages = canvas.height / pdfHeight;
  //     // var pdf = new jsPDF('p', 'pt', [canvas.width, 842]);
  //     console.log(pdf);
  //     for (let i = 1; i <= totalPages; i++) {
  //       // var imgData = canvas.toDataURL("image/jpeg", 1.0);
  //       doc.addImage(img, 0, 0, pdfWidth, pdfHeight * i);
  //       doc.addPage([pdfWidth, pdfHeight * i]);
  //     }
  //     // doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
  //     // doc.addPage([pdfWidth,pdfHeight]);


  //     return doc;
  //   }).then((doc) => {
  //     doc.save('postres.pdf');
  //   });
  //   // let doc = new jsPDF(opt);
  //   // doc.html(data, {
  //   //   html2canvas: function
  //   //   // callback: function (doc) {
  //   //   //   doc.save();
  //   //   // },
  //   //   x: 10,
  //   //   y: 10
  //   // });
  //   // this.pdfshow = 0;
  // }
}


