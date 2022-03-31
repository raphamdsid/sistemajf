import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalcontratojf',
  templateUrl: './modalcontratojf.component.html',
  styleUrls: ['./modalcontratojf.component.scss']
})
export class ModalcontratojfComponent implements OnInit {
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
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalcontratojfComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    venda: any;
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
    if (this.data.venda.unidade == 'Partmed') {
      this.site = 'www.partmedsaude.com.br';
    }
    if (this.data.venda.unidade != 'Partmed') {
      this.site = 'www.odontocompany.com';
    }
    if (this.data.venda.financiador == 'BANCO JF') {
      this.ncontrato = this.data.venda.id;
    }
    else {
      this.ncontrato = this.data.venda.docfinanceiro;
    }
    if (this.data.venda.unidade == 'ODC Nova Iguaçu I (Centro)') {
      this.endereco = 'Rua Otávio Tarquino Nº 173';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9400';
      this.cep = 'Cep: 26215-342';
      this.cnpj = '24.476.639/0001-06';
      this.razao = 'J&F Odontologia 2016 LTDA';
    }
    if (this.data.venda.unidade == 'ODC Nova Iguaçu II (Centro)') {
      this.endereco = 'Rua Coronel Francisco Soares Nº 33 sala 101 e 102';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9401';
      this.cep = 'Cep: 26220-031';
      this.cnpj = '32.196.506/0001-04';
      this.razao = 'J&F Odontologia 2016.2 LTDA';
    }
    if (this.data.venda.unidade == 'ODC Nova Iguaçu III (Centro)') {
      this.endereco = 'Avenida Governador Roberto Silveira Nº 529';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9405';
      this.cep = 'Cep: 26210-220';
      this.cnpj = '41.506.640/0001-55';
      this.razao = 'J&F Odontologia 2021 LTDA';
    }
    if (this.data.venda.unidade == 'ODC Vilar dos Teles (Centro)') {
      this.endereco = 'Avenida Automovel Club Nº 2384 - Terreo';
      this.bairro = 'Jardim José Bonifácio';
      this.ciduf = 'São João de Meriti/RJ';
      this.cidade = 'São João de Meriti';
      this.tel = 'Telefone: (21) 2755-9403'
      this.cep = 'Cep: 25565-171';
      this.cnpj = '34.146.113/0001-11';
      this.razao = 'J&F Odontologia 2017.2 LTDA';
    }
    if (this.data.venda.unidade == 'ODC Belford Roxo (Centro)') {
      this.endereco = 'Praça Getúlio Vargas Nº 12 - Loja';
      this.bairro = 'Centro';
      this.ciduf = 'Belford Roxo/RJ';
      this.cidade = 'Belford Roxo';
      this.tel = 'Telefone: (21) 2755-9404'
      this.cep = 'Cep: 26130-070';
      this.cnpj = '39.348.134/0001-33';
      this.razao = 'J&F Odontologia 2020 LTDA';
    }
    if (this.data.venda.unidade == 'ODC São João de Meriti (Centro)') {
      this.endereco = 'Rua da Matriz Nº 117';
      this.bairro = 'Centro';
      this.ciduf = 'São João de Meriti/RJ';
      this.cidade = 'São João de Meriti';
      this.tel = 'Telefone: (21) 2755-9402';
      this.cep = 'Cep: 25525-620';
      this.cnpj = '29.151.665/0001-88';
      this.razao = 'J&F Odontologia 2017 LTDA';
    }
    if (this.data.venda.unidade == 'Partmed') {
      this.endereco = 'Travessa Irene Nº 35';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2755-9420';
      this.cep = 'Cep: 26210-120';
      this.cnpj = '41.146.008/0001-48';
      this.razao = 'J&F 2021 CLINICA MEDICA LTDA';
    }
    if (this.data.venda.unidade == 'ODC Nova Iguaçu IV (Centro)') {
      this.endereco = 'Rua Getúlio Vargas Nº 62';
      this.bairro = 'Centro';
      this.ciduf = 'Nova Iguaçu/RJ';
      this.cidade = 'Nova Iguaçu';
      this.tel = 'Telefone: (21) 2782-4729';
      this.cep = 'Cep: 26255-060';
      this.cnpj = '44.339.788/0001-30';
      this.razao = 'J & F ODONTOLOGIA 2022 LTDA';
    }
    console.log(this.ncontrato);

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
          <title>Contrato JF ${this.data.venda.id} </title>
          <style>
            .no-print{
              visibility: hidden;
            }
            
            #printarea {
              width: 270mm !important;
              visibility: visible !important;
              overflow: visible !important;
              background-color: rgb(255, 255, 255) !important;
              color: #000 !important;
              border: none !important;
              position: absolute !important;
              left: 0px !important;
              top: 0px !important;
              width: 100% !important;
              height: 100% !important;
              margin-left: 0px !important;
              margin-top: 0px !important;
              line-height: 1.5 !important;
              font-size: 14px !important;
              text-align: justify !important;
              border: solid !important;
              background-color: rgb(255, 255, 255) !important;
              width: 94% !important;
              height: 77% !important;
              color: #000 !important;
              position: fixed !important;
    
            }
            #contrato {
              margin: auto !important;
              width: 270mm !important;
              font-family: sans-serif !important;
              line-height: 1.5 !important;
              font-size: 14px !important;
            }
            #destitle {
              // border: solid 2px !important;
              justify-content: center !important;
              text-align: center !important;
              font-size: x-large !important;
              // text-decoration: underline !important;
              font-weight: bold !important;
              padding-top: 20px !important;
              padding-bottom: 20px !important;
              margin-bottom: 20px !important;
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
            .block {
                display: block !important;
            }
            .justtxt {
                text-align: justify !important;
                text-justify: inter-word !important;
            }
            .mt20 {
                margin-top: 15px !important;
            }
            .vendcol {
              padding: 0px !important;
              padding-left: 1px !important;
            }
            .vendrow {
                // outline: auto !important;
                display: flex !important;
                border-right: solid 1px !important;
                border-left: solid 1px !important;
                border-bottom: solid 1px !important;
            }
            .row {
              // width: 100% !important;
              margin-left: 0px !important;
              margin-right: 0px !important;
            }
            .lbor {
                border-left: 1px solid !important;
            }
            .flex {
              display: flex !important;
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