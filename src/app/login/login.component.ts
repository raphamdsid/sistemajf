import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultaService } from '../services/consulta.service';
import { HttpClientModule } from '@angular/common/http'; // Notice it is imported from @angular/common/http instead of @angular/http
import jwt_decode from 'jwt-decode';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  inputForm: any;
  constructor(private router: Router, private formBuilder: FormBuilder, private service: ConsultaService) {
    this.loginForm = this.formBuilder.group({
    });
  }
  ngOnInit(): void {
    this.inputForm = new FormGroup({
      login: new FormControl(''),
      pwd: new FormControl('')
    });
  }

  checkUser(): void {
    // console.log(this.inputForm.login)

    if (this.inputForm.controls["login"].value != "" || this.inputForm.controls["login"].value != null) {
      let username = this.inputForm.controls["login"].value;
      let pwd = this.inputForm.controls["pwd"].value;
      this.service.getUser(username).subscribe(u => {
        console.log(u);

        if (u.username != null || u.username != undefined) {

          if (username == u.username && pwd == u.pwd) {

            // alert("Usuário "+u.nome+" autenticado!")

            let user = JSON.stringify(u);
            sessionStorage.setItem("login", user);
            sessionStorage.setItem("token", "5TR46FGY6T5YRG4T6YGH5Y6T7HUG5Y7U6Y6THGU7TY65GHU78YIJKIKJOLMU");
            this.router.navigate(['/home']);
            // //PARA CRIAR MÉTODO DE LOGOFF
            // // sessionStorage.removeItem("token");
            // // sessionStorage.removeItem("login");
          }
          else {
            alert("Usuário ou senha inválidos");
          }
        }
        else {
          alert("Usuário ou senha inválidos");
        }
        // sessionStorage.setItem("login", "1")
      });
    }
  }


  login() {
    if (this.inputForm.controls["login"].value != "" || this.inputForm.controls["login"].value != null) {
      let username = this.inputForm.controls["login"].value;
      let pwd = this.inputForm.controls["pwd"].value;
      this.service.createToken(username, pwd).subscribe(u => {
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
          this.router.navigate(['/home']);
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
          alert("Usuário ou senha inválidos");
        });
    }

    // //PARA CRIAR MÉTODO DE LOGOFF
    // // sessionStorage.removeItem("token");
    // // sessionStorage.removeItem("login");

    //  }
    //  else {
    //    alert("Usuário ou senha inválidos");
    //  }
    // sessionStorage.setItem("login", "1")

  }

  // login() {
  //   if (this.inputForm.controls["login"].value != "" || this.inputForm.controls["login"].value != null) {
  //     let username = this.inputForm.controls["login"].value;
  //     let pwd = this.inputForm.controls["pwd"].value;
  //     this.service.login(username, pwd).subscribe(u => {
  // //       console.log(u);
  //       let temp = JSON.stringify(u);
  //       let usertemp = {
  //         username: u.username,
  //         nome: u.nome,
  //         tipo: u.tipo
  //       };
  //       let user = JSON.stringify(usertemp);
  //       let token = u.token;
  //       let check = jwt_decode(token);
  // //       console.log(check)
  //       if (jwt_decode(token)){
  //         sessionStorage.setItem("login", user);
  //         sessionStorage.setItem("token", token);
  //         this.router.navigate(['/home']);
  //       }
  //     },
  //       (error) => {
  // //         console.log(error);
  //         alert("Usuário ou senha inválidos");
  //       });
  //   }

  //   // //PARA CRIAR MÉTODO DE LOGOFF
  //   // // sessionStorage.removeItem("token");
  //   // // sessionStorage.removeItem("login");

  //   //  }
  //   //  else {
  //   //    alert("Usuário ou senha inválidos");
  //   //  }
  //   // sessionStorage.setItem("login", "1")

  // }

  testInvalidJwt() {
    const token: any = sessionStorage.getItem('token');
    // let test = jwt_decode('4644ds86sa74d8a');
    // console.log(test);
    try {
      return jwt_decode('465465465');

    } catch (Error) {
      alert('erro');
    }
  }
  testValidJwt() {
    const token: any = sessionStorage.getItem('token');
    // let test = jwt_decode(token);
    // console.log(test);
    try {
      return jwt_decode(token);
      console.log(jwt_decode(token));
    } catch (Error) {
      alert('erro');
    }

  }
  onSubmit(): void {
    // console.log(this.inputForm.login)

    if (this.inputForm.controls["login"].value == "pramelhor" && this.inputForm.controls["pwd"].value == "partmed852$") {
      sessionStorage.setItem("login", "1");
      sessionStorage.setItem("token", "5TR46FGY6T5YRG4T6YGH5Y6T7HUG5Y7U6Y6THGU7TY65GHU78YIJKIKJOLMU");
      //PARA CRIAR MÉTODO DE LOGOFF
      // sessionStorage.removeItem("token");
      // sessionStorage.removeItem("login");
      this.router.navigate(['/home']);
    }
    else {
      alert("Usuário ou senha inválidos");
    }
    // sessionStorage.setItem("login", "1")
  }

}
