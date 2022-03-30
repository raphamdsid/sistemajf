import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import jwt_decode from "jwt-decode";
import { TitleCasePipe } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { BuscaCepService } from '../services/buscacep.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { formatDate } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.scss']
})
export class DocsComponent implements OnInit {
  user: any;
  role: any;
  public id: any;
  doclist: any = [];
  constructor(private httpClient: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.files();
    this.id = this.route.snapshot.paramMap.get('id');
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
    console.log(this.id);
  }

  openDoc(docname: string) {
    window.open(location.origin + "/assets/docs/" + docname + "", "_blank");
  }

  files() {
    this.httpClient.get("assets/docs/files.json").subscribe(data => {
      console.log(data);
      this.doclist = data;
    });
    // const path = require('path');
    // const fs = require('fs');
    // //joining path of directory 
    // const directoryPath = path.join(__dirname, '/assets/docs/');
    // //passsing directoryPath and callback function
    // fs.readdir(directoryPath, function (err: any, files: any) {
    //   //handling error
    //   if (err) {
    //     return console.log('Unable to scan directory: ' + err);
    //   }
    //   //listing all files using forEach
    //   files.forEach(function (file: any) {
    //     // Do whatever you want to do with the file
    //     console.log(file);
    //   });
    // });
  }

}
