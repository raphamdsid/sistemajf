import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import jwt_decode from "jwt-decode";
import { TitleCasePipe, DOCUMENT } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { BuscaCepService } from '../services/buscacep.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { formatDate } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  user: any;
  role: any;
  public home = "/home";
  public partmedess = "./home";
  public venda = "/financeiro";
  public consulta = "/consulta";
  public jf = "/jfvenda";
  public relatorios = "/relatorios";
  public docs = "/docs";
  public config = "/config";
  public admin = "/adminpanel";
  public carne = "/carne";
  public crc = "/crc";
  public comunicados = "/comunicados";
  public relatorioprotese = "/relatorioprotese";
  public consultaprotese = "/consultaprotese";
  public ordemservicolabext = "/ordemservicolabext";
  @ViewChild('sidenav', { static: false }) sidenav: any;

  @ViewChild('drawer') drawer: any;
  unidade: any;
  constructor(@Inject(DOCUMENT) private document: Document, private router: Router, private service: ConsultaService) { }

  ngOnInit(): void {
    this.getSessionItem();
    console.log(location.origin);
    console.log(location.href);
    console.log(location.pathname);
    //this.setAftername();
  }
  menuNavigate(path: any) {
    if (path == 'home') {
      this.router.navigate(['/home']);
    }
    if (path == 'venda') {
      this.router.navigate(['/financeiro']);
    }
    if (path == 'consulta') {
      this.router.navigate(['/consulta']);
    }
    if (path == 'jf') {
      this.router.navigate(['/jfvenda']);
    }
    if (path == 'relatorios') {
      this.router.navigate(['/relatorios']);
    }
    if (path == 'config') {
      this.router.navigate(['/config']);
    }
    if (path == 'admin') {
      this.router.navigate(['/adminpanel']);
    }
    if (path == 'carne') {
      this.router.navigate(['/carne']);
    }
    if (path == 'crc') {
      this.router.navigate(['/crc']);
    }
    //this.sidenav.close;
    this.drawer.close;
  }
  goToUrl(): void {
    let url = this.service.getUrlPartmed();
    let token: any = sessionStorage.getItem('token');
    this.document.location.href = url + token;
  }
  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
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
    console.log(this.role);
    console.log(this.user);
    console.log(this.user.nome);
    console.log(token);
    if (this.role == 'admin') {
      this.unidade = 'ADMINISTRADOR';
    }
    if (this.role != 'admin') {
      this.unidade = this.user.unidade;
    }

  }
  goToLink(url: string) {
    window.open(url, "_blank");
  }
  openHelp() {
    // this.sidenav.toggle();
    if (this.role == 'comercial') {
      window.open(location.origin + "/assets/manual.pdf", "_blank");
    }
    if (this.role == 'gerente') {
      window.open(location.origin + "/assets/manualgerente.pdf", "_blank");
    }
  }
  setAftername() {
    if (this.role == 'admin') {
      this.unidade = 'ADMIN';
    }
    if (this.role != 'admin') {
      this.unidade = this.user.unidade;
    }
  }
}
