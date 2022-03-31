import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from 'src/app/auth/auth.service';
import { ConsultaService } from 'src/app/services/consulta.service';

@Component({
  selector: 'app-modaledittaxa',
  templateUrl: './modaledittaxa.component.html',
  styleUrls: ['./modaledittaxa.component.scss']
})
export class ModaledittaxaComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    this.key = event.key;
  }
  pwdForm: any;

  constructor(private dialogRef: MatDialogRef<ModaledittaxaComponent>, private service: ConsultaService, private auth: AuthService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    oldentry: any,
    newentry: any,
    modaltxtb: string
  }) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.pwdForm = new FormGroup({
      pwd: new FormControl('')
    })
    console.log(this.data.oldentry);
    console.log(this.data.newentry);
  }

  getPass() {
  }
  sendData() {
    let result: any = [];

    let pwd = this.pwdForm.controls["pwd"].value;
    const username = this.auth.getUser();
    this.service.getUser(username).subscribe(u => {
      let user = u;
      console.log(username);
      if (user.pwd == pwd) {
        result.obj = this.data.newentry;
        result.objb = this.data.oldentry;
        result.user = username;
        this.dialogRef.close(result);
      }
      else {
        alert('Senha inválida')
      }
    });
  }
}
