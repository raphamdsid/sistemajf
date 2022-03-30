import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from '../services/consulta.service';
import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";
import { formatDate, TitleCasePipe, DatePipe, formatCurrency } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  role: any;
  test = ['banana', 'apple', 'juice'];

  constructor(private router: Router, private formBuilder: FormBuilder, private service: ConsultaService, 
    private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.isAuth();
    this.getSessionItem();
    // console.log(this.test.includes('banana'));
    // console.log(this.test.includes('penis'));
    console.log(this.user);
  }
  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
  }


  showContent(){
    alert("Working!");
  }
  menuNavigate(path: any) {
    if (path == 'venda') {
      this.router.navigate(['/financeiro']);
    }
    if (path == 'consulta') {
      this.router.navigate(['/consulta']);
    }
    if (path == 'jf') {
      this.router.navigate(['/jfvenda']);
    }
    if (path == 'relatorio') {
      this.router.navigate(['/relatorios']);
    }

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

  }
  testFunction(){
    let obj = [
      { 
        venda_id: 44,
        parcela: 1,
        valor_pago: 29.9,
        forma_pag: "Credz"
      },
      {
        venda_id: 44,
        parcela: 1,
        valor_pago: 4.0,
        forma_pag: "Dinheiro"
      },
      {
        venda_id: 44,
        parcela: 1,
        valor_pago: 4.0,
        forma_pag: "Dinheiro"
      }
      
    ]
    // //console.log(obj);
    // //console.log(JSON.stringify(obj));
    // //console.log(JSON.parse(JSON.stringify(obj)));
    let pag = JSON.stringify(obj);
    // //console.log(pag);
    this.service.postFormaPagamentoCreate(obj).subscribe (u=>{
      console.log(u);
    });
    // let today = new Date('2021-12-18')
    // today.setHours(today.getHours()+4);
    // let month = today.getMonth()+1;
    // let thisday = formatDate(today, 'yyyy-MM-dd', 'en');
    // console.log(today);
    // console.log(thisday);
    // console.log(month);


    // const username = this.auth.getUser()
    // this.service.getUser(username).subscribe(u=>{
    //   let user = u;
    // //   console.log(username);
    // //   console.log(user);
    // });
  }

}
