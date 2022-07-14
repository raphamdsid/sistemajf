import { Component, OnInit, ElementRef, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import { formatDate, TitleCasePipe, DatePipe } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { HttpClient } from '@angular/common/http';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { ModalaComponent } from '../financeiro/modala/modala.component';
import { ModalconfigComponent } from './modalconfig/modalconfig.component';


@Component({
  selector: 'app-configuracao',
  templateUrl: './configuracao.component.html',
  styleUrls: ['./configuracao.component.scss']
})
export class ConfiguracaoComponent implements OnInit {
  role: any;
  user: any;
  userdata: any;
  resetpwdForm: any;
  newuserForm: any;
  auditForm: any;
  searchuserForm: any;
  tabindex: number = 0;
  objuser: any;
  operacao: any;
  buscausuario: any;
  auditlogs: any;
  sloader: any = 0;
  @ViewChild('newusercpf', { static: false }) usercpf: any;

  constructor(public dialog: MatDialog, private auth: AuthService, private service: ConsultaService,
    private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.auth.isAuth();
    let curruser = this.getSessionItem();
    let role = this.auth.getRole();
    console.log(role);
    this.resetpwdForm = new FormGroup({
      oldpwd: new FormControl('', Validators.required),
      newpwdconfirm: new FormControl('', Validators.required),
      newpwd: new FormControl('', Validators.required)
    });
    this.newuserForm = new FormGroup({
      username: new FormControl('', Validators.required),
      nome: new FormControl('', Validators.required),
      cpf: new FormControl(null, Validators.required),
      tipo: new FormControl('', Validators.required),
      unidade: new FormControl('', Validators.required)
    });
    this.searchuserForm = new FormGroup({
      userbusca: new FormControl(''),
      usercriteria: new FormControl('1', Validators.required)
    });
    this.auditForm = new FormGroup({
      dtinicio: new FormControl('', Validators.required),
      dtfim: new FormControl('', Validators.required),
      busca: new FormControl('')
    });
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    console.log(today);
    this.auditForm.controls["dtinicio"].setValue(today);
    this.auditForm.controls["dtfim"].setValue(today);
    this.userdata = null;
    this.objuser = [];
    this.buscausuario = null;
  }
  getSessionItem() {
    //let temp: any = sessionStorage.getItem('login');
    //this.user = JSON.parse(temp);
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    this.user = {
      nome: checktoken.nome,
      username: checktoken.username
    }
    console.log(this.role);
    console.log(this.user);
    console.log(this.user.nome);
    console.log(token);
  }
  resetPassword() {
    this.sloader = 1;
    this.getSessionItem();
    let username = this.user.username;
    console.log(username);
    let currpwda = this.resetpwdForm.controls["oldpwd"].value;
    let newpwda = this.resetpwdForm.controls["newpwd"].value;
    let newpwdb = this.resetpwdForm.controls["newpwdconfirm"].value;
    if (newpwda == newpwdb) {
      this.service.getUser(username).subscribe(u => {
        console.log(u);
        let today = new Date();
        if (currpwda == u.pwd) {
          let objuser = {
            nome: u.nome,
            cpf: u.cpf,
            username: u.username,
            pwd: this.resetpwdForm.controls["newpwd"].value,
            tipo: u.tipo,
            unidade: u.unidade,
            stats: u.stats,
            updatedat: today
          }
          const obj = JSON.stringify(objuser);
          console.log(objuser);
          console.log(obj);
          this.service.updateUser(obj).subscribe(result => {
            console.log(result);
            this.sloader = 0;
            let logobj = {
              objeto: 'Usuário',
              operacao: 'Edição',
              descricao: "Usuário atualizou sua senha de acesso"
            }
            this.service.createLogObj(logobj).subscribe(u => {
              console.log(u);
              alert("Senha atualizada com sucesso")
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('login');
              this.router.navigate(['/login']);
            });
          },
            (error) => {
              this.sloader = 0;
              alert("Erro ao atualizar senha")
            });
        }
        else {
          this.sloader = 0;
          alert("Senha incorreta");
        }

      });
    }
    else {
      this.sloader = 0;
      alert("Senhas diferentes");
    }
  }
  // resetPassword() {
  //   this.sloader = 1;
  //   this.getSessionItem();
  //   let username = this.user.username;
  //   console.log(username);
  //   let currpwda = this.resetpwdForm.controls["oldpwd"].value;
  //   let currpwdb = this.resetpwdForm.controls["oldpwdconfirm"].value;
  //   if (currpwda == currpwdb) {
  //     this.service.getUser(username).subscribe(u => {
  //       console.log(u);
  //       let today = new Date();
  //       if (currpwda == u.pwd && currpwdb == u.pwd) {
  //         let objuser = {
  //           nome: u.nome,
  //           cpf: u.cpf,
  //           username: u.username,
  //           pwd: this.resetpwdForm.controls["newpwd"].value,
  //           tipo: u.tipo,
  //           unidade: u.unidade,
  //           stats: u.stats,
  //           updatedat: today
  //         }
  //         const obj = JSON.stringify(objuser);
  //         console.log(objuser);
  //         console.log(obj);
  //         this.service.updateUser(obj).subscribe(result => {
  //           console.log(result);
  //           this.sloader = 0;
  //           let logobj = {
  //             objeto: 'Usuário',
  //             operacao: 'Edição',
  //             descricao: "Usuário atualizou sua senha de acesso"
  //           }
  //           this.service.createLogObj(logobj).subscribe(u => {
  //             console.log(u);
  //             alert("Senha atualizada com sucesso")
  //             sessionStorage.removeItem('token');
  //             sessionStorage.removeItem('login');
  //             this.router.navigate(['/login']);
  //           });
  //         },
  //           (error) => {
  //             this.sloader = 0;
  //             alert("Erro ao atualizar senha")
  //           });
  //       }
  //       else {
  //         this.sloader = 0;
  //         alert("Senha incorreta");
  //       }

  //     });
  //   }
  //   else {
  //     this.sloader = 0;
  //     alert("Senhas diferentes");
  //   }
  // }
  createNewUser() {
    if (this.newuserForm.valid) {
      this.sloader = 1;
      let unidade;
      if (this.newuserForm.controls["tipo"].value == 'admin'){
        unidade = null;
      }
      if (this.newuserForm.controls["tipo"].value != 'admin'){
        unidade = this.newuserForm.controls["unidade"].value;
      }
      
      let objuser = {
        nome: this.newuserForm.controls["nome"].value,
        cpf: this.newuserForm.controls["cpf"].value,
        username: this.newuserForm.controls["username"].value,
        pwd: this.newuserForm.controls["cpf"].value,
        tipo: this.newuserForm.controls["tipo"].value,
        stats: 'ativo',
        unidade: unidade
      }
      const username = objuser.username;
      this.service.checkUser(username).subscribe(founduser => {
        console.log(founduser);
        console.log(founduser.username);
        if (founduser.username == null || founduser.username == undefined) {
          const obj = JSON.stringify(objuser);
          console.log(objuser);
          console.log(obj);
          this.service.createUser(obj).subscribe(u => {
            this.sloader = 0;
            console.log(u);
            let user = JSON.parse(obj);

            let logobj = {
              objeto: 'Usuário',
              operacao: 'Criação',
              descricao: "Criaçao do usuário " + user.username + " - tipo: " + user.tipo + " - Unidade: " + user.unidade + ""
            }
            this.service.createLogObj(logobj).subscribe(u => {
              console.log(u);
              alert('Usuário cadastrado com sucesso');
              this.newuserForm.reset();
            });
          });
        }
        else {
          this.sloader = 0;
          alert("Usuário já encontra-se cadastrado no sistema")
        }
      });
    }
    else {
      this.sloader = 0;
      alert("Preencha todos os campos")
    }
  }
  cpfValid() {
    const cpf = this.newuserForm.controls["cpf"].value;
    console.log(this.newuserForm.controls["cpf"].value);
    console.log(cpf);
    // validate(cpf);
    if ((cpf != null || cpf == '' || cpf != undefined) && !validate(cpf)) {
      this.newuserForm.controls["cpf"].setValue(null);
      //this.usercpf.nativeElement.focus();
      alert("CPF inválido")

    }
  }
  getUserList() {
    this.buscausuario = this.searchuserForm.controls["userbusca"].value;
    let query = this.searchuserForm.controls["usercriteria"].value;
    let busca = this.buscausuario;
    if (busca != null && busca != '' && busca != undefined) {
      this.service.getUserList(busca, query).subscribe(u => {
        console.log(u.Users);
        console.log(u.Users[1]);
        this.objuser = u.Users;
        console.log(this.objuser);
      });
    }
  }
  ativaUsuario(usuario: any, index: any) {
    let text = "Deseja ativar este usuário?"

    const dialogRef = this.dialog.open(ModalconfigComponent, {
      data: { text: text }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");

      console.log(result);
      if (result) {
        usuario.stats = 'ativo';
        this.service.updateUser(usuario).subscribe(result => {
          console.log(result);
          let logobj = {
            objeto: 'Usuário',
            operacao: 'Ativação',
            descricao: "Ativação do usuário " + usuario.username + ""
          }
          this.service.createLogObj(logobj).subscribe(u => {
            console.log(u);
            alert("Usuário ativado com sucesso")
            let curruser = this.auth.getSessionItem();
            let currusername = curruser.username;
            let objusername = usuario.username;
            if (currusername == objusername) {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('login');
              this.router.navigate(['/login']);
            }
            if (currusername != objusername) {
              this.getUserList();
            }
          });
        },
          (error) => {
            alert("Erro ao ativar usuário")
          });

      }
    });
  }
  desativaUsuario(usuario: any, index: any) {
    let text = "Deseja desativar este usuário?"

    const dialogRef = this.dialog.open(ModalconfigComponent, {
      data: { text: text }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      if (result) {
        usuario.stats = 'inativo';
        this.service.updateUser(usuario).subscribe(result => {
          console.log(result);
          let logobj = {
            objeto: 'Usuário',
            operacao: 'Desativação',
            descricao: "Desativação do usuário " + usuario.username + ""
          }
          this.service.createLogObj(logobj).subscribe(u => {
            console.log(u);
            alert("Usuário desativado com sucesso")
            let curruser = this.auth.getSessionItem();
            let currusername = curruser.username;
            let objusername = usuario.username;
            if (currusername == objusername) {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('login');
              this.router.navigate(['/login']);
            }
            if (currusername != objusername) {
              this.getUserList();
            }
          });
        },
          (error) => {
            alert("Erro ao desativar usuário")
          });

      }
    });

  }

  userPwdReset(usuario: any, index: any) {
    let text = "Deseja redefinir a senha para este usuário?"

    const dialogRef = this.dialog.open(ModalconfigComponent, {
      data: { text: text }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log("The dialog was closed");
      console.log(result);
      if (result) {
        console.log(usuario);
        usuario.pwd = usuario.cpf;
        console.log(usuario);
        this.service.updateUser(usuario).subscribe(result => {
          console.log(result);
          let logobj = {
            objeto: 'Usuário',
            operacao: 'Edição',
            descricao: "Redefinição de senha de acesso do usuário " + usuario.username + ""
          }
          this.service.createLogObj(logobj).subscribe(u => {
            console.log(u);
            alert("Senha redefinida com sucesso")
            let curruser = this.auth.getSessionItem();
            let currusername = curruser.username;
            let objusername = usuario.username;
            if (currusername == objusername) {
              sessionStorage.removeItem('token');
              sessionStorage.removeItem('login');
              this.router.navigate(['/login']);
            }
            if (currusername != objusername) {
              this.getUserList();
            }
          });
        },
          (error) => {
            alert("Erro ao redefinir senha")
          });
      }
    });
  }
  getAuditList() {
    let dta = this.auditForm.controls["dtinicio"].value;
    let dtb = this.auditForm.controls["dtfim"].value;
    let query = this.auditForm.controls["busca"].value;
    this.service.getLogList(dta, dtb, query).subscribe(a => {
      console.log(a);
      this.auditlogs = a.log;
      console.log(this.auditlogs);
    });

  }
}
