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



@Component({
  selector: 'app-cadastrotype',
  templateUrl: './cadastrotype.component.html',
  styleUrls: ['./cadastrotype.component.scss']
})
export class CadastrotypeComponent implements OnInit {
  role: any;
  user: any;
  userdata: any;
  resetpwdForm: any;
  newuserForm: any;
  tabindex: number = 0;
  constructor(private auth: AuthService, private service: ConsultaService, private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.auth.isAuth();
    this.auth.getSessionItem();
    //alert(this.auth.user.nome);
  }

}
