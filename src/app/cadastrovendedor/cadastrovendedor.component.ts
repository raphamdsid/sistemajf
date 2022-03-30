import { Component, OnInit, ElementRef, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { ControlContainer, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';


import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import * as html2canvas from 'html2canvas';
import { ConsultaService } from '../services/consulta.service';
import { validate } from 'gerador-validador-cpf'
import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';


@Component({
  selector: 'app-cadastrovendedor',
  templateUrl: './cadastrovendedor.component.html',
  styleUrls: ['./cadastrovendedor.component.scss']
})
export class CadastrovendedorComponent implements OnInit {
  userForm: FormGroup;
  vendedorForm: any;

  objbusca: any = [];
  enablevenba: number = 1;
  enablevenbb: number = 1;
  enablevenbc: number = 1;
  objvendedor: any = [];
  operacao: number = 0;
  finbbenable: number = 0;
  enableveninc: number = 0;
  allowedroles = ['admin', 'gerente'];

  @ViewChild('vendedorcpf', { static: false }) vencpf: any;

  constructor(private auth: AuthService, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService) {
    this.userForm = this.formBuilder.group({
    });
  }

  ngOnInit(): void {
    this.auth.isAuth();
    this.auth.getSessionItem();
    this.auth.checkRole(this.allowedroles);
    this.vendedorForm = new FormGroup({
      vendedornome: new FormControl('', Validators.required),
      vendedorcpf: new FormControl('', Validators.required),
      vendedorrg: new FormControl('', Validators.required),
      vendedornasc: new FormControl('', Validators.required),
      vendedoradmissao: new FormControl('', Validators.required),
      buscavendedor: new FormControl('', Validators.required)
    });
    console.log("Obj Vendedor: " + this.objvendedor);

    this.service.getVendedor().subscribe(c => {
      this.objvendedor = c;
      console.log("Obj Vendedor: ", this.objvendedor);


    });
    this.vendedorForm.disable();
  }
  saveVend() {

    if (this.vendedorForm.valid) {

      this.objvendedor = {
        id: this.objvendedor.id,
        cpf: this.vendedorForm.controls["vendedorcpf"].value,
        nome: this.vendedorForm.controls["vendedornome"].value,
        rg: this.vendedorForm.controls["vendedorrg"].value,
        dtnasc: this.vendedorForm.controls["vendedornasc"].value,
        dtadmissao: this.vendedorForm.controls["vendedoradmissao"].value

      }
      // this.objvendedor = JSON.stringify(this.objvendedor);

      console.log(this.objvendedor);
      if (this.operacao == 1) {
        console.log(JSON.stringify(this.objvendedor));
        this.service.postVendedorEdit(this.objvendedor).subscribe(c => {
          console.log(c);
          let vendedor = this.objvendedor;
          let logobj = {
            objeto: 'Vendedor',
            operacao: 'Edição',
            descricao: "Edição dos dados do vendedor " + vendedor.nome + ""
          }
          this.service.createLogObj(logobj).subscribe(u => {
            console.log(u);
            alert("Vendedor atualizado com sucesso.")
            console.log(this.objvendedor);
            this.afterVendedor();
          });
        });

      }
      if (this.operacao == 2) {
        const cpf = this.objvendedor.cpf;
        console.log(cpf);
        this.service.getVendedorCpf(cpf).subscribe(c => {
          console.log(c);
          if (c.cpf != undefined) {
            alert("CPF já encontra-se cadastrado no sistema.")
          }
          else {
            this.objvendedor.stats = "ativo";
            console.log(JSON.stringify(this.objvendedor));
            this.service.postVendedorCreate(this.objvendedor).subscribe(c => {
              console.log(c);
              let vendedor = this.objvendedor;
              let logobj = {
                objeto: 'Vendedor',
                operacao: 'Criação',
                descricao: "Criação do vendedor " + vendedor.nome + ". CPF: " + vendedor.cpf + ""
              }
              this.service.createLogObj(logobj).subscribe(u => {
                console.log(u);
                alert("Vendedor criado com sucesso.")
                console.log(this.objvendedor);
                this.afterVendedor();
              });
            });

          }
        });
      }

    }

    else {
      alert("Preencha todos os campos.")
    }

  }
  afterVendedor() {
    this.vendedorForm.disable();
    this.enablevenba = 1;
    this.enablevenbb = 0;
    this.enablevenbc = 0;
    this.finbbenable = 1;
    this.enableveninc = 0;
  }
  deleteVend() {
    this.objvendedor = {
      cpf: this.vendedorForm.controls["vendedorcpf"].value,
      nome: this.vendedorForm.controls["vendedornome"].value,
      rg: this.vendedorForm.controls["vendedorrg"].value,
      // orgao: this.vendedorForm.controls["vendedororgao"].value,
      dtnasc: this.vendedorForm.controls["vendedornasc"].value,
      // genero: this.vendedorForm.controls["vendedorgen"].value,
      dtadmissao: this.vendedorForm.controls["vendedoradmissao"].value
    }
    this.objvendedor.stats = "deletado";
    console.log(JSON.stringify(this.objvendedor));
    this.service.postVendedorDel(this.objvendedor).subscribe(c => {
      console.log(c);
      let vendedor = this.objvendedor;
      let logobj = {
        objeto: 'Vendedor',
        operacao: 'Deleção',
        descricao: "Deleção do vendedor " + vendedor.nome + ". CPF: " + vendedor.cpf + ""
      }
      this.service.createLogObj(logobj).subscribe(u => {
        console.log(u);
        alert("Vendedor apagado com sucesso com sucesso.")
        console.log(this.objvendedor);
        this.vendedorForm.disable();
        this.vendedorForm.reset();
        this.enablevenba = 1;
        this.enablevenbb = 1;
        this.enablevenbc = 1;
        this.finbbenable = 1;
        this.objbusca = [];
        this.objvendedor = [];
      });
    });

  }
  editVend() {
    this.operacao = 1;
    this.vendedorForm.enable();
    // this.objvendedor = [];
    this.objbusca = [];
    this.vendedorForm.controls["buscavendedor"].disable()
    this.vendedorForm.controls["vendedorcpf"].disable()
    this.enablevenba = 0;
    this.enablevenbb = 1;
    this.enablevenbc = 1;
    this.enableveninc = 0;

  }
  buscaVendedorNome() {
    if (this.vendedorForm.controls["buscavendedor"].value.length >= 3) {
      this.service.getVendedorNome(this.vendedorForm.controls["buscavendedor"].value).subscribe(c => {
        console.log(c.Vendedores);
        this.objbusca = c.Vendedores;
      }
      );
    }
    if (this.vendedorForm.controls["buscavendedor"].value.length < 3) {
      this.objbusca = [];
    }
  }
  fillFormVendedor(ven: any, index: any) {
    console.log(ven);
    this.objvendedor = this.objbusca[index];
    console.log(this.objvendedor);
    this.enablevenba = 1;
    this.enablevenbb = 0;
    this.enablevenbc = 0;
    this.vendedorForm.controls["buscavendedor"].disable();
    this.vendedorForm.controls["buscavendedor"].setValue('');
    this.vendedorForm.controls["vendedornome"].setValue(ven.nome);
    this.vendedorForm.controls["vendedorcpf"].setValue(ven.cpf);
    this.vendedorForm.controls["vendedorrg"].setValue(ven.rg);
    // this.vendedorForm.controls["vendedororgao"].setValue(ven.orgao);
    this.vendedorForm.controls["vendedornasc"].setValue(ven.dtnasc);
    // this.vendedorForm.controls["vendedorgen"].setValue(ven.genero);
    this.vendedorForm.controls["vendedoradmissao"].setValue(ven.dtadmissao);

  }
  hasBusca() {
    console.log(this.objbusca);
    return this.objbusca.length > 0;

  }
  incVendedor() {
    this.operacao = 2;
    this.enablevenba = 0;
    this.enablevenbb = 1;
    this.enablevenbc = 1;
    this.vendedorForm.reset();
    this.vendedorForm.enable();
    this.vendedorForm.controls["buscavendedor"].setValue('');
    this.vendedorForm.controls["buscavendedor"].reset();
    this.vendedorForm.controls["buscavendedor"].disable();
    //    this.enableveninc = 1;
    this.objvendedor = [];
    this.objbusca = [];
  }
  cpfVenValid() {
    const cpf = this.vendedorForm.controls["vendedorcpf"].value;

    if (cpf != null && !validate(cpf)) {
      this.vendedorForm.controls["vendedorcpf"].setValue(null);
      this.vencpf.nativeElement.focus();
      alert("CPF inválido")

    }
  }

  enableBusca() {

    this.vendedorForm.disable();
    this.vendedorForm.controls["buscavendedor"].enable();
    this.enableveninc = 0;
    this.enablevenba = 1;
    this.enablevenbb = 1;
    this.enablevenbc = 1;
  }

}
