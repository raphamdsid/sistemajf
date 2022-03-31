import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalprintrequerimento',
  templateUrl: './modalprintrequerimento.component.html',
  styleUrls: ['./modalprintrequerimento.component.scss']
})
export class ModalprintrequerimentoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  confirmEstornoForm: any;
  valor: Number = 0;
  operacao: Number = 0;
  ncontrato: any;
  motivo: any;
  endereco: any;
  bairro: any;
  ciduf: any;
  tel: any;
  site: any;
  cpfcnpj: any;
  cep: any = '';
  cnpj: any = '';
  cidade: any = '';
  razao: any = '';
  dia: any;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalprintrequerimentoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    obj: any;
    tipo: any;
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.onNoClick();
      }
    });
    console.log(this.data);
    if (this.data.tipo == 'normal') {
      this.dia = this.data.obj.venda.waitestornodate;

      if (this.data.obj.venda.unidade == 'Partmed') {
        this.site = 'www.partmedsaude.com.br';
      }
      if (this.data.obj.venda.unidade != 'Partmed') {
        this.site = 'www.odontocompany.com';
      }
      if (this.data.obj.venda.financiador == 'BANCO JF') {
        this.ncontrato = String(this.data.obj.venda.id);
      }
      else {
        this.ncontrato = String(this.data.obj.venda.docfinanceiro);
      }
      if (this.data.obj.venda.unidade == 'ODC Nova Iguaçu I (Centro)') {
        this.endereco = 'Rua Otávio Tarquino Nº 173';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9400'
      }
      if (this.data.obj.venda.unidade == 'ODC Nova Iguaçu II (Centro)') {
        this.endereco = 'Rua Coronel Francisco Soares Nº 33 sala 101 e 102';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9401'
      }
      if (this.data.obj.venda.unidade == 'ODC Nova Iguaçu III (Centro)') {
        this.endereco = 'Av Governador Roberto Silveira Nº 529';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9405'
      }
      if (this.data.obj.venda.unidade == 'ODC Nova Iguaçu IV (Centro)') {
        this.endereco = 'Rua Getúlio Vargas Nº 62';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2782-4729';
      }
      if (this.data.obj.venda.unidade == 'ODC Vilar dos Teles (Centro)') {
        this.endereco = 'Avenida Automovel Club Nº 2384 - Terreo';
        this.bairro = 'Jardim José Bonifácio';
        this.ciduf = 'São João de Meriti/RJ';
        this.cidade = 'São João de Meriti';
        this.tel = 'Telefone: (21) 2755-9403'
      }
      if (this.data.obj.venda.unidade == 'ODC Belford Roxo (Centro)') {
        this.endereco = 'Praça Getúlio Vargas Nº 12 - Loja';
        this.bairro = 'Centro';
        this.ciduf = 'Belford Roxo/RJ';
        this.cidade = 'Belford Roxo';
        this.tel = 'Telefone: (21) 2755-9404'
      }
      if (this.data.obj.venda.unidade == 'São João de Meriti (Centro)') {
        this.endereco = 'Rua da Matriz Nº 117';
        this.bairro = 'Centro';
        this.ciduf = 'São João de Meriti/RJ';
        this.cidade = 'São João de Meriti';
        this.tel = 'Telefone: (21) 2755-9402'
      }
      if (this.data.obj.venda.unidade == 'Partmed') {
        this.endereco = 'Travessa Irene Nº 35';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9420'
      }
      console.log(this.ncontrato);
    }
    if (this.data.tipo == 'especial') {
      this.dia = this.data.obj.createdat;
      if (this.data.obj.unidade == 'Partmed') {
        this.site = 'www.partmedsaude.com.br';
      }
      if (this.data.obj.unidade != 'Partmed') {
        this.site = 'www.odontocompany.com';
      }
      if (this.data.obj.unidade == 'ODC Nova Iguaçu I (Centro)') {
        this.endereco = 'Rua Otávio Tarquino Nº 173';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9400'
      }
      if (this.data.obj.unidade == 'ODC Nova Iguaçu II (Centro)') {
        this.endereco = 'Rua Coronel Francisco Soares Nº 33 sala 101 e 102';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9401'
      }
      if (this.data.obj.unidade == 'ODC Nova Iguaçu III (Centro)') {
        this.endereco = 'Av Governador Roberto Silveira Nº 529';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9405'
      }
      if (this.data.obj.venda.unidade == 'ODC Nova Iguaçu IV (Centro)') {
        this.endereco = 'Rua Getúlio Vargas Nº 62';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2782-4729';
      }
      if (this.data.obj.unidade == 'ODC Vilar dos Teles (Centro)') {
        this.endereco = 'Avenida Automovel Club Nº 2384 - Terreo';
        this.bairro = 'Jardim José Bonifácio';
        this.ciduf = 'São João de Meriti/RJ';
        this.cidade = 'São João de Meriti';
        this.tel = 'Telefone: (21) 2755-9403'
      }
      if (this.data.obj.unidade == 'ODC Belford Roxo (Centro)') {
        this.endereco = 'Praça Getúlio Vargas Nº 12 - Loja';
        this.bairro = 'Centro';
        this.ciduf = 'Belford Roxo/RJ';
        this.cidade = 'Belford Roxo';
        this.tel = 'Telefone: (21) 2755-9404'
      }
      if (this.data.obj.unidade == 'São João de Meriti (Centro)') {
        this.endereco = 'Rua da Matriz Nº 117';
        this.bairro = 'Centro';
        this.ciduf = 'São João de Meriti/RJ';
        this.cidade = 'São João de Meriti';
        this.tel = 'Telefone: (21) 2755-9402'
      }
      if (this.data.obj.unidade == 'Partmed') {
        this.endereco = 'Travessa Irene Nº 35';
        this.bairro = 'Centro';
        this.ciduf = 'Nova Iguaçu/RJ';
        this.cidade = 'Nova Iguaçu';
        this.tel = 'Telefone: (21) 2755-9420'
      }
      if (this.data.obj.cpfcnpj.length == 11) {
        this.cpfcnpj = 'CPF';
      }
      if (this.data.obj.cpfcnpj.length == 14) {
        this.cpfcnpj = 'CNPJ';
      }
    }
  }
  onNoClick() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
  onPrint() {
    window.print();

  }
  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printarea')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Requerimento</title>
          <style>
            .no-print{
              visibility: hidden;
            }
            #printarea {
              visibility: visible !important;
              overflow: visible !important;
              background-color: rgb(255, 255, 255);
              color: #000;
              border: none;
              position: absolute;
              left: 0px;
              top: 0px;
              width: 100%;
              height: 100%;
              margin-left: 0px;
              margin-top: 0px;
              line-height: 1.5;
              font-size: 20px;
              text-align: justify;
              border: solid;
              background-color: rgb(255, 255, 255);
              width: 94%;
              height: 77%;
              color: #000;
              position: fixed;
              left: 22%;
              top: 33%;
              margin-left: -20%;
              margin-top: -15%;
            }
            .title {
                font-size: 40px !important;
                font-weight: bold !important;
                text-decoration: underline !important;
                line-height: 4 !important;
            }
            
            .rowdados {
              border-bottom: solid 2px !important;
              border-left: solid 2px !important;
              border-right: solid 2px !important;
            }
            p {
              font-size: x-large !important;
            }
            .row {
              width: 100% !important;
              margin-left: 0px !important;
              margin-right: 0px !important;
            }
            #destitle {
              border: solid 2px !important;
              justify-content: center !important;
              font-size: x-large !important;
              // text-decoration: underline !important;
              font-weight: bold !important;
              padding-top: 10px !important;
              padding-bottom: 10px !important;
            }
            .rbor {
              border-right: solid 2px !important;
            }
            .col {
              padding-left: 3px !important;
              padding-right: 3px !important;
              padding-top: 10px !important;
              padding-bottom: 10px !important;
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
}