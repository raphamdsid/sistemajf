import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from 'src/app/auth/auth.service';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-confirmeditvendamodal',
  templateUrl: './confirmeditvendamodal.component.html',
  styleUrls: ['./confirmeditvendamodal.component.scss']
})
export class ConfirmeditvendamodalComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  pwdForm: any;
  @ViewChild('fiadorcpf', { static: false }) fiadcpf: any;
  @ViewChild('pacientecpf', { static: false }) pacicpf: any;

  constructor(private renderer: Renderer2, private tools: ToolsService, private dialogRef: MatDialogRef<ConfirmeditvendamodalComponent>, private service: ConsultaService, private auth: AuthService, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    oldentry: any,
    newentry: any,
    modaltxtb: string
  }) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.dialogRef.close();
      }
    });
    this.pwdForm = new FormGroup({
      pwd: new FormControl('')
    })
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
