import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { ConsultaService } from '../services/consulta.service';
import { Router } from '@angular/router';

// import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable()
export class AuthService {
  role: any;
  user: any
  roleAs: any;
  isLogin = false;

  constructor(private service: ConsultaService, private router: Router) { }
  // ...
  public isAuthenticated(): boolean {
    const token: any = sessionStorage.getItem('token');
    try {
      jwt_decode(token);
      return token;
    }
    catch (error) {
      return false;
    }

    // Check whether the token is expired and return
    // true or false
    // return !this.jwtHelper.isTokenExpired(token);

  }

  decodePayloadJWT(): any {
    const token: any = sessionStorage.getItem('token');
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
  // login(value: string) {
  //   this.isLogin = true;
  //   this.roleAs = value;
  //   localStorage.setItem('STATE', 'true');
  //   localStorage.setItem('ROLE', this.roleAs);
  //   return ({ success: this.isLogin, role: this.roleAs });
  // }

  isAuth() {
    let u = sessionStorage.getItem('token');
    this.service.authToken(u).subscribe(a => {
      console.log(a);
      this.isActive();
      return a;
    },
      (error) => {
        console.log(error);
        alert("Erro de autenticação, faça login novamente.");
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('login');
        this.router.navigate(['/login']);
      });

  }

  isActive() {
    let u = sessionStorage.getItem('token');
    let token: any = u;
    let jwt = JSON.parse(JSON.stringify(jwt_decode(token)));
    let user = {
      nome: jwt.nome,
      username: jwt.username
    }
    this.service.getUser(user.username).subscribe(u => {
      if (u.stats != 'ativo') {
        alert("Esta conta foi desativada, para mais informações contate um administrador");
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('login');
        this.router.navigate(['/login']);
      }
    });

  }

  logout() {
    this.isLogin = false;
    this.roleAs = '';
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    return ({ success: this.isLogin, role: '' });
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true')
      this.isLogin = true;
    else
      this.isLogin = false;
    return this.isLogin;
  }

  getRole() {
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    return this.role;
  }

  getUser() {
    let token: any = sessionStorage.getItem('token');
    let jwt = JSON.parse(JSON.stringify(jwt_decode(token)));
    let user = jwt.username;
    return user;
  }



  checkRole(allowedroles: any) {
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    const isallowed = allowedroles.includes(this.role);
    if (!isallowed) {
      this.router.navigate(['/home']);
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
      username: checktoken.username
    }
    console.log(this.role);
    console.log(this.user);
    console.log(this.user.nome);
    console.log(token);
    return this.user;

  }
}
