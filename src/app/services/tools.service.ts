import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { formatDate } from '@angular/common';
import { FormControl } from '@angular/forms';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from '../auth/auth.service';
import { ConsultaService } from './consulta.service';

@Injectable({
  providedIn: 'root'
})
export class ToolsService {

  constructor(public httpClient: HttpClient, private auth: AuthService, private service: ConsultaService) { }
  splitNome(nome: any) {
    let fullname = nome.split(' ');
    let lastname: string = '';
    for (let i = 1; i < fullname.length; i++) {
      let string = this.titleCaseWord(String(fullname[i]));
      if (i == 1) {
        lastname += string;
      }
      if (i > 1) {
        lastname += " " + string;
      }
    }
    let firstname = this.titleCaseWord(String(fullname[0]));
    let objname = {
      firstname: firstname,
      lastname: lastname
    }
    return objname;
  }
  setUpperCase(str: string) {
    return str.toUpperCase();
  }
  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  decimalFix(val: any) {
    let value = Number((Math.round(val * 100) / 100).toFixed(2));
    return value;
  }
  decimalFixNoRound(val: any) {
    var value = Math.trunc(val * 100) / 100;
    return value;
  }
  trimStr(str: string) {
    let result = str.trim();
    return result;
  }
  public whiteSpaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  sortArrayByNumber(array: any) {
    let numericArray = array;
    var sortedArray = numericArray.sort((n1: number, n2: number) => n1 - n2);
    return sortedArray;
  }
  sortArrayByString(array: any) {
    let stringArray = array;
    var sortedArray = stringArray.sort((n1: string, n2: string) => {
      if (n1 > n2) {
        return 1;
      }

      if (n1 < n2) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }
  sortObjArrayByNumber(array: any, param: any) {
    let objectArray = array;
    var sortedArray = objectArray.sort((n1: any, n2: any) => {
      if (n1[param] > n2[param]) {
        return 1;
      }

      if (n1[param] < n2[param]) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }
  sortObjArrayByString(array: any, param: any) {
    let objectArray = array;
    var sortedArray = objectArray.sort((n1: string, n2: string) => {
      if (n1[param] > n2[param]) {
        return 1;
      }

      if (n1[param] < n2[param]) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }
  sortObjArray(array: any, param: any) {
    let objectArray = array;
    var sortedArray = objectArray.sort((n1: any, n2: any) => {
      if (n1[param] > n2[param]) {
        return 1;
      }

      if (n1[param] < n2[param]) {
        return -1;
      }

      return 0;
    });
    return sortedArray;
  }
  validateCPF(c: any) {
    // const cpf = c;
    if (validate(c)) {
      return (true);
    }
    else {
      return (false);
    }
  }
  validateCNPJ(c: any) {
    var b = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    if ((c = c.replace(/[^\d]/g, "")).length != 14)
      return false;

    if (/0{14}/.test(c))
      return false;

    for (var j = 0; j < 2; ++j) {
      for (var i = 0, n = 0; i < 12 + j; n += c[i] * b[++i - j]);
      if (c[12 + j] != ((n %= 11) < 2) ? 0 : 11 - n)
        return false;
    }

    return true;
  };
  stringContainsNumber(_string: any) {
    let matchPattern = _string.match(/\d+/g);
    if (matchPattern != null) {
      return true;
    }
    else {
      return false;
    }
  }
  getNumbersFromString(_string: any) {
    let matchPattern = _string.match(/\d+/g);
    return matchPattern.join('');
  }

  getCreditCardType(creditCardNumber: any) {
    // start without knowing the credit card type
    var result = "unknown";
    let visa = new RegExp('^4');
    // first check for MasterCard
    if (/^502121/.test(creditCardNumber)) {
      result = "mastercard";
    }
    // then check for Visa

    else if (visa.test(creditCardNumber)) {
      result = "visa";
    }
    // then check for AmEx
    else if (/^3/.test(creditCardNumber)) {
      result = "amex";
    }
    // then check for Diners
    else if (/3(?:0[0-5]|[68][0-9])[0-9]{11}/.test(creditCardNumber)) {
      result = "diners"
    }
    // then check for Discover
    else if (/6(?:011|5[0-9]{2})[0-9]{12}/.test(creditCardNumber)) {
      result = "discover";
    }
    // then check for Hyper
    else if (/6(?:011|5[0-9]{2})[0-9]{12}/.test(creditCardNumber)) {
      result = "hyper";
    }
    else if (/^(?!(506721))|(506718|(506720)|(50672[4-9])|(50673[0-3])|506739|(50674[1-3])|(50674[5-7])|506753|(50677[4-5])|(50677[7-8])|(50900[0-2])|(50900[4-7])|509009|509014|(50902[0-9])|509030|(50903[5-9])|(50904[0-2])|(50904[4-9])|(50905[0-3])|509064|(50906[6-9])|509072|(50907[4-9])|(50908[0-3])|(50908[5-6])|(50909[1-2])|(50909[5-9])|(50910[0-1])|(50910[7-9])|(50911[0-9])|(50912[0-9])|(50913[0-9])|(50914[0-9])|(50915[0-9])|(50916[0-9])|(50917[0-9])|(50918[0-9])|(50919[0-9])|(50920[0-9])|(50921[0-9])|(50922[0-9])|(50923[0-9])|(50924[0-9])|(50925[0-6])|(50950[7-9])|(50951[0-9])|(50952[0-9])|(50953[0-9])|(50954[0-9])|(50955[0-9])|(50956[0-9])|(50957[0-9])|(50958[0-9])|(50959[0-9])|(50960[0-9])|(50961[0-9])|(50962[0-9])|(50963[0-9])|(50964[0-9])|(50965[0-9])|(50966[0-9])|(50967[0-9])|(50968[0-9])|(50969[0-9])|(50970[0-9])|(50971[0-9])|(50972[0-9])|(50973[0-9])|(50974[0-9])|(50975[0-9])|(50976[0-9])|(50977[0-9])|(50978[0-9])|(50979[0-9])|(50980[0-7])|636368|(65048[5-9])|(65049[0-9])|(65050[0-4])|(65050[6-9])|(65051[0-3])|(65051[8-9])|(65052[0-9])|(65053[0-8])|(65055[2-9])|(65056[0-9])|(65057[0-9])|(65058[0-9])|(65059[0-8])|(65072[0-7])|(65090[1-9])|(65091[0-9])|(65092[0-2])|650928|650939|(65094[6-9])|(65095[0-9])|(65096[0-9])|(65097[0-8])|(65165[2-9])|(65166[0-1])|(65166[3-9])|(65167[0-9])|(65168[0-9])|(65169[0-9])|(65170[0-4])|(65500[0-9])|(65501[0-1])|(65501[3-9])|(65502[1-9])|(65503[0-9])|(65504[0-9])|(65505[0-7]))/.test(creditCardNumber)) {
      result = "elo";
    }

    return result;
  }
  getMaskType(cardType: any) {
    var masks = {
      'master': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'visa': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'amex': {
        mask: '0000 000000 00000',
        size: 15
      },
      'diners': {
        mask: '0000 0000 0000 00',
        size: 14
      },
      'discover': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'hipercard': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'hyper': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'elo': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'debelo': {
        mask: '0000 0000 0000 0000',
        size: 16
      },
      'unknown': {
        mask: '0000 0000 0000 0000',
        size: 16
      }
    };
    let bandeira = cardType as keyof typeof masks;
    return masks[bandeira];
  }
  getCardMask(card: any) {
    let size = card.card_number_length;
    let pwsize = card.security_code_length;
    let cardmask = '0000 0000 0000 0000';
    let pwmask = '000';
    if (card.id != 'unknown') {
      if (size == 14) {
        cardmask = '0000 0000 0000 00';
      }
      if (size == 15) {
        cardmask = '0000 000000 00000';
      }
      if (size == 16) {
        cardmask = '0000 0000 0000 0000';
      }
      if (pwsize == 3) {
        pwmask = '000';
      }
      if (pwsize == 4) {
        pwmask = '0000';
      }
      if (pwsize == 5) {
        pwmask = '00000';
      }
      if (pwsize == 6) {
        pwmask = '000000';
      }
    }
    let result = {
      cardm: cardmask,
      pwdm: pwmask
    }
    return result;
  }
  getKeyPress(event: KeyboardEvent, type: any) {
    let ek = event.key;
    // console.log(event, event.charCode);
    let letras = ek.match(/^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/);
    let num = ek.match(/^[0-9]*$/);
    let barra = ek.match(/^[\/]*$/);
    if (type == 'nome') {
      if (!(letras)) {
        event.preventDefault();
        console.log(ek);
      }
    }
    if (type == 'num') {
      if (!(num)) {
        event.preventDefault();
        console.log(ek);
      }
    }
    if (type == 'docfin') {
      if (!(letras || num)) {
        event.preventDefault();
        console.log(ek)
      }
    }
    if (type == 'docodc') {
      if (!(num || barra)) {
        event.preventDefault();
        console.log(ek);
      }
    }
  }
  public uniList() {
    let array: any = [];
    let result: any = [];
    this.httpClient.get("assets/vendor/unidades.json").subscribe(data => {
      array = data;
      for (let x = 0; x < array.length; x++) {
        if (array[x].ativo == 1) {
          result.push(array[x]);
        }
      }
      console.log(result);
      return (result);
    });
  }
  public unidList(): Observable<any> {
    return this.httpClient.get("assets/vendor/unidades.json");
  }
  public usertypeList(): Observable<any> {
    return this.httpClient.get("assets/vendor/usertype.json");
  }
  // confirmaSenha(pwd: any): Observable<any> {
  //   const username = this.auth.getUser();
  //   let response: any;
  //   this.service.getUser(username).subscribe(u => {
  //     let user = u;
  //     console.log(username);
  //     return (user.pwd);
  //   },
  //     (error) => {
  //       return ('error');
  //     });

  // }
}
