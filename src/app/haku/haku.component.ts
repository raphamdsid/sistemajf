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
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { formatDate } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { ScriptService } from '../services/script.service.service';
import { ToolsService } from '../services/tools.service';
// import { NgxMercadopagoService } from 'ngx-mercadopago';

// import * as custom from './assets/Scripts/custom.js';
// import * as mp_jdk from '../../assets/Scripts/mp_sdk.js';
// import * as variavel from 'custom';
// function hello() {
//   alert('Hello!!!');
// }
declare var MercadoPago: any;
declare var cardForm: any;
declare var objetoform: any;
@Component({
  selector: 'app-haku',
  templateUrl: './haku.component.html',
  styleUrls: ['./haku.component.scss']
})
export class HakuComponent implements OnInit {
  user: any;
  role: any;
  tipo: any;
  objeto: any;
  valor_venda: number = 155.27;
  mp_public_key_test = 'TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be';
  mp_access_token_test = 'TEST-312953893385107-021412-86235922aa06185289e075afc626756c-136822540';
  mp_public_key_prod = 'APP_USR-bcbeb09f-2007-40e3-be57-f32571bfc678';
  mp_access_token_prod = 'APP_USR-312953893385107-021412-6e6cd9b715b7ccc0302541f2bcb4f90d-136822540';
  mp_access_client_id_prod = '312953893385107';
  mp_access_client_secret_prod = 'scUUqi1DPgjv9ecKg7O4DLYzoC2pjE6B';
  public id: any;
  isadmin: number = 0;
  qrcodeurl: any;
  mp: any;
  mercadoPagoVersion: any;
  mpForm: any;
  cardthumb: any = '';
  showcardform: number = 0;
  validcard: string = '';
  sloader: number = 0;
  cardmask: any = '0000 0000 0000 0000';
  pwdmask: any = '000';
  cartoes: any = [];
  card: any = [];
  amount: number = 0;
  planos: any = [];
  constructor(private httpClient: HttpClient, private tools: ToolsService, private http: HttpClient, private window: Window, private script: ScriptService, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: ConsultaService,
    private auth: AuthService) {
  }

  async ngOnInit(): Promise<void> {
    this.mpForm = new FormGroup({
      cardNumber: new FormControl('', Validators.required),
      cardExpirationDate: new FormControl('', Validators.required),
      cardholderName: new FormControl('', Validators.required),
      cardholderEmail: new FormControl('', Validators.required),
      securityCode: new FormControl('', Validators.required),
      issuer: new FormControl('', Validators.required),
      identificationType: new FormControl('', Validators.required),
      identificationNumber: new FormControl('', Validators.required),
      installment: new FormControl('', Validators.required)
    });
    this.planoList();
    // console.log(this.mpForm);
    // get("https://sdk.mercadopago.com/js/v2", () => {
    //   //Google Maps library has been loaded...
    // });
    // get("assets/Scripts/mp.js", () => {
    //   //Google Maps library has been loaded...
    // });
    // const mp = new MercadoPago(this.mp_public_key_test);
    // console.log(await mp.getPaymentMethods({ bin: '503143' }))

    // console.log(window);
    let scriptstrb = this.writeScriptB();
    let scriptc = document.createElement("script");
    scriptc.type = "text/javascript";
    scriptc.text = scriptstrb;
    await document.body.appendChild(scriptc);

    // let script = document.createElement("script");
    // script.type = "text/javascript";
    // script.src = "./assets/Scripts/mp_sdk.js";
    // await document.body.appendChild(script);

    // let scriptstr = this.writeScript();
    // let scriptb = document.createElement("script");
    // scriptb.type = "text/javascript";
    // scriptb.text = scriptstr;
    // await document.body.appendChild(scriptb);
    // this.func();
    // await this.getCards();
    // await this.getCreditCardType();
    this.amount = 1000;
    console.log(window);
    // this.getTestUserMp();

    // this.testRequest();

    // let myScript = document.createElement("script");
    // myScript.setAttribute("src", "https://sdk.mercadopago.com/js/v2");
    // document.body.appendChild(myScript);
    // let myScriptb = document.createElement("script");
    // myScriptb.setAttribute("src", "assets/Scripts/mp.js");
    // document.body.appendChild(myScriptb);


    // get("assets/Scripts/mp.js", () => {
    //   //Google Maps library has been loaded...
    // });
    // this.getId();
    // this.login('NI1');
    // this.auth.isAuth();
    // this.getSessionItem();

    // if (this.role === 'admin') {
    //   alert('Bem vindo, ' + this.user.nome + '!');
    //   //this.isadmin = 1;
    // }
    // else {
    //   alert('Este usuário não tem permissão para acessar esta página');
    //   this.router.navigate(['/home']);
    // }
    console.log(MercadoPago);
  }



  getCards() {
    //ISSO É UM CURL REQUEST//
    this.sloader = 1;
    let url: string = "https://api.mercadopago.com/v1/payment_methods";
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + this.mp_access_token_test)
    return this.http
      .get(url, { headers: headers })
      .subscribe(res => {
        console.log(res)
        this.cartoes = res;
        this.sloader = 0;
        // this.getCreditCardType();
      });
  }
  getTestUserMp() {
    //ISSO É UM CURL REQUEST//
    this.sloader = 1;
    let url: string = "https://api.mercadopago.com/users/test_user";
    const headers = new HttpHeaders()
      .set('content-type', 'application/json')
      .set('Authorization', 'Bearer ' + this.mp_access_token_prod);
    const body = {
      "site_id": "MLB"
    }
    return this.http
      .post(url, { headers: headers, body: body })
      .subscribe(res => {
        console.log(res)
        // this.getCreditCardType();
      });
  }
  planoList() {
    this.httpClient.get("assets/vendor/mp/planos.json").subscribe(data => {
      console.log(data);
      this.planos = data;
    });
  }
  // getCreditCardType(cardnumber: string) {
  //   // start without knowing the credit card type
  //   var result = "unknown";
  //   for (let x = 0; x < this.cartoes.length; x++) {
  //     if (this.cartoes[x].settings.length > 0 && this.cartoes[x].deferred_capture == 'supported') {
  //       for (let y = 0; y < this.cartoes[x].settings.length; y++) {
  //         if (this.cartoes[x].settings[y].bin.pattern != null) {
  //           let validsa = new RegExp(this.cartoes[x].settings[y].bin.pattern);
  //           let validss = (this.cartoes[x].settings[y].bin.pattern);
  //           // console.log(new RegExp(this.cartoes[x].settings[y].bin.pattern));
  //           // console.log((this.cartoes[x].settings[y].bin.pattern));
  //           if (validsa.test(cardnumber)) {
  //             // console.log(valids);
  //             // console.log(validss);
  //             console.log(validsa.test(cardnumber));
  //             console.log(this.cartoes[x].id);
  //             console.log(this.cartoes[x].name);
  //             result = this.cartoes[x].id;
  //           }
  //         }
  //         if (this.cartoes[x].settings[y].bin.exclusion_pattern != null) {
  //           let validsb = new RegExp(this.cartoes[x].settings[y].bin.exclusion_pattern);
  //           let validss = (this.cartoes[x].settings[y].bin.exclusion_pattern);
  //           // console.log(new RegExp(this.cartoes[x].settings[y].bin.pattern));
  //           // console.log((this.cartoes[x].settings[y].bin.pattern));
  //           if (validsb.test(cardnumber)) {
  //             // console.log(valids);
  //             // console.log(validss);
  //             console.log(validsb.test(cardnumber));
  //             console.log(this.cartoes[x].id);
  //             console.log(this.cartoes[x].name);
  //             result = this.cartoes[x].id;
  //           }
  //         }
  //         if (this.cartoes[x].settings[y].bin.installments_pattern != null) {
  //           let validsc = new RegExp(this.cartoes[x].settings[y].bin.installments_pattern);
  //           let validss = (this.cartoes[x].settings[y].bin.installments_pattern);
  //           // console.log(new RegExp(this.cartoes[x].settings[y].bin.pattern));
  //           // console.log((this.cartoes[x].settings[y].bin.pattern));
  //           if (validsc.test(cardnumber)) {
  //             // console.log(valids);
  //             // console.log(validss);
  //             console.log(validsc.test(cardnumber));
  //             console.log(this.cartoes[x].id);
  //             console.log(this.cartoes[x].name);
  //             result = this.cartoes[x].id;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   console.log('Result is: ' + result);
  //   return result;
  // }
  getCreditCardType(cardnumber: string) {
    // start without knowing the credit card type
    var result = {
      id: "unknown",
      name: "Unknown",
      payment_type: "",
      card_number_length: 16,
      security_code_length: 3
    }
    for (let x = 0; x < this.cartoes.length; x++) {
      if (this.cartoes[x].settings.length > 0 && this.cartoes[x].deferred_capture == 'supported') {
        for (let y = 0; y < this.cartoes[x].settings.length; y++) {
          let validexclusion = new RegExp(this.cartoes[x].settings[y].bin.exclusion_pattern);
          let validpattern = new RegExp(this.cartoes[x].settings[y].bin.pattern);
          let validinstallments = new RegExp(this.cartoes[x].settings[y].bin.installments_pattern);
          if (this.cartoes[x].settings[y].bin.exclusion_pattern != null) {
            let validss = (this.cartoes[x].settings[y].bin.exclusion_pattern);
            // console.log(new RegExp(this.cartoes[x].settings[y].bin.pattern));
            // console.log((this.cartoes[x].settings[y].bin.pattern));
            if (!(validexclusion.test(cardnumber))) {
              // console.log(valids);
              // console.log(validss);
              if (validpattern.test(cardnumber)) {
                // console.log(this.cartoes[x].id);
                // console.log(this.cartoes[x].name);
                // console.log('Card length: ' + this.cartoes[x].settings[y].card_number.length);
                result = {
                  id: this.cartoes[x].id,
                  name: this.cartoes[x].name,
                  payment_type: this.cartoes[x].payment_type_id,
                  card_number_length: this.cartoes[x].settings[y].card_number.length,
                  security_code_length: this.cartoes[x].settings[y].security_code.length
                }
              }
            }
          }
          else {
            if (validpattern.test(cardnumber)) {
              console.log(this.cartoes[x].id);
              console.log(this.cartoes[x].name);
              result = {
                id: this.cartoes[x].id,
                name: this.cartoes[x].name,
                payment_type: this.cartoes[x].payment_type_id,
                card_number_length: this.cartoes[x].settings[y].card_number.length,
                security_code_length: this.cartoes[x].settings[y].security_code.length
              }
            }
          }
        }
      }
    }
    console.log(result);
    return result;
  }

  sendPostRequest() {
    let url: string = 'https://www.wellingtonsoccer.com/lib/api/auth.cfc?returnFormat=JSON&method=Authenticate';
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('content-type', 'application/json')
      .set('postman-token', 'b408a67d-5f78-54fc-2fb7-00f6e9cefbd1');

    const body = {
      email: 'myemail@xyz.com',
      user_password: 'mypasss',
      token: 'my token'
    }

    return this.http
      .post(url, body, { headers: headers })
      .subscribe(res => res);
  }
  testRequest() {
    let url: string = 'https://api.mercadopago.com';
    const headers = new HttpHeaders()
      .set('cache-control', 'no-cache')
      .set('Request-Method', 'GET')
      .set('content-type', 'application/json')
      .set('cache-control', 'no-cache')
      .set('authority', 'api.mercadopago.com')
      .set('Referrer-Policy', 'strict-origin-when-cross-origin')
      .set('postman-token', 'b408a67d-5f78-54fc-2fb7-00f6e9cefbd1');

    const body = {
      public_key: 'TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be',
      locale: 'en',
      js_version: '2.0.0',
      referer: 'http://192.168.1.200:4200',
      marketplace: 'NONE',
      status: 'active',
      bins: 503143,
      processing_mode: 'aggregator'

    }

    return this.http
      .post(url, body, { headers: headers })
      .subscribe(res => {
        console.log(res);
      });
  }

  getId() {
    let tempid: any = this.route.snapshot.paramMap.get('id');
    console.log(tempid);
    let id = tempid.substring(1);
    console.log(id);
    this.qrcodeurl = "http://192.168.1.200:4200/#/protese/:" + id;
    let obj = {
      id: id
    }
    this.service.getVendaSingle(obj).subscribe(v => {
      console.log(v);
    });
  }
  clw() {
    console.log(cardForm);
  }
  getSessionItem() {
    let temp: any = sessionStorage.getItem('login');
    this.user = JSON.parse(temp);
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    console.log(this.role);
    console.log(this.user);
    // console.log(this.user.nome);
    console.log(token);
    let tempid: any = this.route.snapshot.paramMap.get('id');
    console.log(tempid);
    let id = tempid.substring(1);
    console.log(id);
    this.qrcodeurl = "http://192.168.1.200:4200/#/protese/:" + id;
    let obj = {
      id: id
    }
    this.service.getVendaSingle(obj).subscribe(v => {
      console.log(v);
    });
  }
  qrcodeGenerator(id: any) {
    id = 2000;
    let tempid: any = this.route.snapshot.paramMap.get('id');
    id = tempid.substring(1);
    console.log(id);
    this.qrcodeurl = "http://192.168.1.200:4200/#/protese/:" + id;
    let obj = {
      id: id
    }
  }

  login(unidade: any) {
    let obj = {
      unidade: unidade
    }
    let fobj = JSON.parse(JSON.stringify(obj));
    console.log(fobj);
    this.service.createTokenUnidade(fobj).subscribe(u => {
      console.log(u);
      this.service.authToken(u).subscribe(a => {
        console.log(a);
        let temp = {
          nome: a.nome,
          username: a.username
          //role: a.tipo
        };
        let user = JSON.stringify(temp);
        let token = a.token;
        let role = a.tipo;
        console.log(user);
        console.log(token);
        //sessionStorage.setItem("login", user);
        sessionStorage.setItem("token", token);
        // sessionStorage.setItem("role", role);
        // sessionStorage.setItem("STATE", 'true');
        // this.router.navigate(['/home']);
      },
        (error) => {
          console.log(error);
          alert("Erro de autenticação, entre em contato com o administrador do sistema.");
        });
      //   let usertemp = {
      //     username: u.username,
      //     nome: u.nome,
      //     tipo: u.tipo
      //   };
      //   let user = JSON.stringify(usertemp);
      //   let token = u.token;
      //   let check = jwt_decode(token);
      // //   console.log(check)
      //   if (jwt_decode(token)){
      //     sessionStorage.setItem("login", user);
      //     sessionStorage.setItem("token", token);
      //     this.router.navigate(['/home']);
      //   }
    },
      (error) => {
        console.log(error);
        alert("Erro de autenticação, entre em contato com o administrador do sistema.");
      });

  }
  writeScriptB() {
    let script =
      `(function() {
        function $MPC_load() {
           window.$MPC_loaded !== true && (function() {
           var s = document.createElement("script");
           s.type = "text/javascript";
           s.async = true;
           s.src = document.location.protocol + "//secure.mlstatic.com/mptools/render.js";
           var x = document.getElementsByTagName('script')[0];
           x.parentNode.insertBefore(s, x);
           window.$MPC_loaded = true;
        })();
     }
     window.$MPC_loaded !== true ? (window.attachEvent ? window.attachEvent('onload', $MPC_load) : window.addEventListener('load', $MPC_load, false)) : null;
     })();`
    return script;
  }
  writeScript() {
    let val = 100;
    let script = `
    const mp = new MercadoPago('TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be');
    // Add step #3
    // Step #3
    const cardForm = mp.cardForm({
      amount: "100.5",
      autoMount: true,
      form: {
        id: "form-checkout",
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: "Titular do cartão",
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: "E-mail",
        },
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: "Número do cartão",
        },
        cardExpirationDate: {
          id: "form-checkout__cardExpirationDate",
          placeholder: "Data de vencimento (MM/YYYY)",
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: "Código de segurança",
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: "Parcelas",
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: "Tipo de documento",
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: "Número do documento",
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: "Banco emissor",
        },
      },
      callbacks: {
        onFormMounted: (error: any) => {
          if (error) return console.warn("Form Mounted handling error: ", error);
          console.log("Form mounted");
        },
        onSubmit: (event: { preventDefault: () => void; }) => {
          event.preventDefault();

          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = cardForm.getCardFormData();
          objetoform = {
            token,
            issuer_id,
            payment_method_id,
            transaction_amount: Number(amount),
            installments: Number(installments),
            description: "Descrição do produto",
            payer: {
              email,
              identification: {
                type: identificationType,
                number: identificationNumber
              }
            }
          }
          console.log(obj);
        },

      },
    });
  }`
    return script;
  }
  func2() {
    const {
      paymentMethodId: payment_method_id,
      issuerId: issuer_id,
      cardholderEmail: email,
      amount,
      token,
      installments,
      identificationNumber,
      identificationType,
    } = cardForm.getCardFormData();
  }

  getResponseTxt(response: any, obj: any) {
    let status = response.status;
    let detail = response.status_detail;
    let id = response.id;
    let result = '';
    if (detail == 'accredited') {
      result = 'Pronto, seu pagamento foi aprovado! No resumo, você verá a cobrança do valor como ' + obj.description + '.';
    }
    if (detail == 'pending_contingency') {
      result = 'Estamos processando o pagamento. Não se preocupe, em menos de 2 dias úteis informaremos por e-mail se foi creditado.';
    }
    if (detail == 'cc_rejected_bad_filled_card_number') {
      result = 'Revise o número do cartão.';
    }
    if (detail == 'cc_rejected_bad_filled_date') {
      result = 'Revise a data de vencimento.';
    }
    if (detail == 'cc_rejected_bad_filled_other') {
      result = 'Revise os dados.';
    }
    if (detail == 'cc_rejected_bad_filled_security_code') {
      result = 'Revise o código de segurança do cartão.';
    }
    if (detail == 'cc_rejected_blacklist') {
      result = 'Não pudemos processar seu pagamento.';
    }
    if (detail == 'cc_rejected_call_for_authorize') {
      result = 'Você deve autorizar o cartão ' + this.card.name + ' o pagamento do valor ao Mercado Pago.';
    }
    if (detail == 'cc_rejected_card_disabled') {
      result = 'Ligue para o cartão ' + this.card.name + ' para ativar seu cartão. O telefone está no verso do seu cartão.';
    }
    if (detail == 'cc_rejected_card_error') {
      result = 'Não conseguimos processar seu pagamento.';
    }
    if (detail == 'cc_rejected_duplicated_payment') {
      result = 'Você já efetuou um pagamento com esse valor. Caso precise pagar novamente, utilize outro cartão ou outra forma de pagamento.';
    }
    if (detail == 'cc_rejected_high_risk') {
      result = '	Seu pagamento foi recusado. Escolha outra forma de pagamento. Recomendamos meios de pagamento em dinheiro.';
    }
    if (detail == 'cc_rejected_insufficient_amount') {
      result = 'O cartão ' + this.card.name + ' possui saldo insuficiente.';
    }
    if (detail == 'cc_rejected_invalid_installments') {
      result = 'O cartão ' + this.card.name + ' não processa pagamentos em ' + obj.finstallment + ' parcelas.';
    }
    if (detail == 'cc_rejected_max_attempts') {
      result = '	Você atingiu o limite de tentativas permitido. Escolha outro cartão ou outra forma de pagamento.';
    }
    if (detail == 'cc_rejected_other_reason') {
      result = 'O cartão ' + this.card.name + ' não processa o pagamento.';
    }
    if (detail == 'cc_rejected_card_type_not_allowed') {
      result = 'O pagamento foi rejeitado porque o usuário não tem a função crédito habilitada em seu cartão multiplo (débito e crédito).';
    }
    // if (detail == '') {
    //   result = ''
    // }
    return result;
  }

  func() {
    const mp = new MercadoPago('TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be');
    // Add step #3
    // Step #3
    const cardForm = mp.cardForm({
      amount: "100.5",
      autoMount: true,
      form: {
        id: "form-checkout",
        cardholderName: {
          id: "form-checkout__cardholderName",
          placeholder: "Titular do cartão",
        },
        cardholderEmail: {
          id: "form-checkout__cardholderEmail",
          placeholder: "E-mail",
        },
        cardNumber: {
          id: "form-checkout__cardNumber",
          placeholder: "Número do cartão",
        },
        cardExpirationDate: {
          id: "form-checkout__cardExpirationDate",
          placeholder: "Data de vencimento (MM/YYYY)",
        },
        securityCode: {
          id: "form-checkout__securityCode",
          placeholder: "Código de segurança",
        },
        installments: {
          id: "form-checkout__installments",
          placeholder: "Parcelas",
        },
        identificationType: {
          id: "form-checkout__identificationType",
          placeholder: "Tipo de documento",
        },
        identificationNumber: {
          id: "form-checkout__identificationNumber",
          placeholder: "Número do documento",
        },
        issuer: {
          id: "form-checkout__issuer",
          placeholder: "Banco emissor",
        },
      },
      callbacks: {
        onFormMounted: (error: any) => {
          if (error) return console.warn("Form Mounted handling error: ", error);
          console.log("Form mounted");
        },
        onSubmit: (event: { preventDefault: () => void; }) => {
          event.preventDefault();

          const {
            paymentMethodId: payment_method_id,
            issuerId: issuer_id,
            cardholderEmail: email,
            amount,
            token,
            installments,
            identificationNumber,
            identificationType,
          } = cardForm.getCardFormData();
          let obj = {
            token,
            issuer_id,
            payment_method_id,
            transaction_amount: Number(amount),
            installments: Number(installments),
            description: "Descrição do produto",
            payer: {
              email,
              identification: {
                type: identificationType,
                number: identificationNumber
              }
            }
          }
          console.log(obj);
          this.service.processaPagamentoMP(obj).subscribe(r => {
            console.log(r);
          });
        },
      },
    });
  }

  validId(a: any) {
    let id = this.mpForm.controls["identificationNumber"].value;
    // console.log(this.mpForm);
    // console.log(id);
    if (a == 1) {
      if (id.length > 0 && !(this.tools.validateCPF(id))) {
        alert("CPF inválido");
        this.mpForm.controls["identificationNumber"].setValue('');
      }
    }
    if (a == 2) {
      if (id.length > 0 && !(this.tools.validateCNPJ(id))) {
        alert("CNPJ inválido");
        this.mpForm.controls["identificationNumber"].setValue('');
      }
    }
  }
  validateForm() {
    let mpf = this.mpForm;
    let mpfc = this.mpForm.controls;
    let result;
    if (mpf.valid) {
      if (mpfc["cardExpirationDate"].value.length < 6) {
        result = false;
      }
      else {
        result = true;
      }
    }
    else {
      result = false;
    }
    return result;
  }
  checkFormMP() {
    // this.validateForm();
    // console.log(this.mpForm);
    if (this.validateForm()) {
      let obj = {
        fcardNumber: this.mpForm.controls["cardNumber"].value,
        fcardExpirationDate: this.mpForm.controls["cardExpirationDate"].value,
        fcardholderName: this.mpForm.controls["cardholderName"].value,
        fcardholderEmail: this.mpForm.controls["cardholderEmail"].value,
        fsecurityCode: this.mpForm.controls["securityCode"].value,
        fissuer: this.card.issuer.id,
        fissuer_name: this.card.id,
        fidentificationType: this.mpForm.controls["identificationType"].value,
        fidentificationNumber: this.mpForm.controls["identificationNumber"].value,
        finstallment: this.mpForm.controls["installment"].value,
        famount: this.amount
      }
      console.log(obj);
      this.buildMpForm(obj);
    }
    else {
      alert('Preencha todos os campos corretamente');
    }
  }
  resetId() {
    // console.log('change');
    this.mpForm.controls["identificationNumber"].setValue('');
  }

  async buildMpForm(obj: any) {

    const mp = new MercadoPago('TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be');
    // Add step #3
    // Step #3
    let cardm = String(obj.fcardExpirationDate.substring(0, 2));
    let cardy = String(obj.fcardExpirationDate.substring(2, 6));
    console.log(cardm);
    console.log(cardy);
    this.sloader = 1;
    // const cardForm = mp.cardForm({
    const cardToken = await mp.createCardToken({
      cardNumber: obj.fcardNumber,
      cardholderName: obj.fcardholderName,
      cardExpirationMonth: obj.cardm,
      cardExpirationYear: obj.cardy,
      securityCode: obj.fsecurityCode,
      identificationType: obj.fidentificationType,
      identificationNumber: obj.fidentificationNumber
    });
    console.log(cardToken);
    let token = cardToken;
    let issuer_id = obj.fissuer;
    let payment_method_id = obj.fissuer_name;
    let transaction_amount = obj.famount;
    let installments = obj.finstallment;
    let description = 'Teste de venda MP Angular';
    let email = obj.fcardholderEmail;
    let type = obj.fidentificationType;
    let number = obj.fidentificationNumber;
    let objeto = {
      token: token.id,
      issuer_id: issuer_id,
      payment_method_id: payment_method_id,
      transaction_amount: Number(transaction_amount),
      installments: Number(installments),
      description: description,
      payer: {
        email,
        identification: {
          type: type,
          number: number
        }
      }
    }
    // let object = JSON.stringify(objeto);
    console.log(objeto);
    this.service.processaPagamentoMP(objeto).subscribe(r => {
      console.log(r);
      let msg = this.getResponseTxt(r, objeto);
      console.log(msg);
      this.sloader = 0;
      alert(msg);

    },
      (error) => {
        this.sloader = 0;
        console.log(error);
        alert('Erro!');
      });


    //   amount: String(obj.famount),
    //   autoMount: true,
    //   // form: {
    //   //   id: "form-checkout",
    //   //   cardholderName: {
    //   //     id: obj.fcardholderName,
    //   //     placeholder: "Titular do cartão",
    //   //   },
    //   //   cardholderEmail: {
    //   //     id: obj.fcardholderEmail,
    //   //     placeholder: "E-mail",
    //   //   },
    //   //   cardNumber: {
    //   //     // id: "form-checkout__cardNumber",
    //   //     id: obj.fcardNumber,
    //   //     placeholder: "Número do cartão",
    //   //   },
    //   //   cardExpirationDate: {
    //   //     // id: "form-checkout__cardExpirationDate",
    //   //     id: obj.fcardExpirationDate,
    //   //     placeholder: "Data de vencimento (MM/YYYY)",
    //   //   },
    //   //   securityCode: {
    //   //     // id: "form-checkout__securityCode",
    //   //     id: obj.fsecurityCode,
    //   //     placeholder: "Código de segurança",
    //   //   },
    //   //   installments: {
    //   //     // id: "form-checkout__installments",
    //   //     id: obj.finstallment,
    //   //     placeholder: "Parcelas",
    //   //   },
    //   //   identificationType: {
    //   //     // id: "form-checkout__identificationType",
    //   //     id: obj.fidentificationType,
    //   //     placeholder: "Tipo de documento",
    //   //   },
    //   //   identificationNumber: {
    //   //     // id: "form-checkout__identificationNumber",
    //   //     id: obj.fidentificationNumber,
    //   //     placeholder: "Número do documento",
    //   //   },
    //   //   issuer: {
    //   //     // id: "form-checkout__issuer",
    //   //     id: String(obj.fissuer),
    //   //     placeholder: "Banco emissor",
    //   //   },
    //   // },
    //   callbacks: {
    //     onFormMounted: (error: any) => {
    //       if (error) return console.warn("Form Mounted handling error: ", error);
    //       console.log("Form mounted");
    //     },
    //     onSubmit: (event: { preventDefault: () => void; }) => {
    //       event.preventDefault();

    //       const {
    //         paymentMethodId: payment_method_id,
    //         issuerId: issuer_id,
    //         cardholderEmail: email,
    //         amount,
    //         token,
    //         installments,
    //         identificationNumber,
    //         identificationType,
    //       } = cardForm.getCardFormData();

    //   },
    // },
    // });
  }
  funcB() {

  }
  async buscaBandeira() {
    this.cardthumb = '';
    console.log(this.mpForm.controls["cardNumber"].value.length);
    let ccnum = this.mpForm.controls["cardNumber"].value;
    if (ccnum.length >= 6) {
      console.log(ccnum);
      let card = this.getCreditCardType(ccnum);
      // console.log(card);
      let carddata = this.tools.getCardMask(card);
      // console.log(card);
      // console.log(carddata);
      this.cardmask = carddata.cardm;
      this.pwdmask = carddata.pwdm;
      if (ccnum.length == card.card_number_length) {
        this.sloader = 1;
        const mp = new MercadoPago(this.mp_public_key_test);
        let bin = ccnum.substring(0, 6);
        try {
          let res = await mp.getPaymentMethods({ bin: bin });
          if (res.results.length > 0) {
            this.validcard = 'valid';
            this.card = res.results[0];
            this.mpForm.controls["issuer"].setValue(this.card.name);
            console.log(res);
            this.cardthumb = res.results[0].secure_thumbnail;
            console.log(res.results[0].secure_thumbnail);
            this.showcardform = 1;
          }
          else {
            this.validcard = 'invalid';
            this.card = [];
          }
          this.sloader = 0;
        } catch (error) {
          console.log(error);
          this.validcard = 'invalid';
          this.sloader = 0;
          this.card = [];
        }
      }
      else {
        this.showcardform = 0;
        this.validcard = '';
        this.card = [];
      }
    }
  }

}
