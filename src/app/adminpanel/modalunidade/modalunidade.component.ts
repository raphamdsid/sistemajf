import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';


@Component({
  selector: 'app-modalunidade',
  templateUrl: './modalunidade.component.html',
  styleUrls: ['./modalunidade.component.scss']
})
export class ModalunidadeComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  uniForm: any;
  modaltxt: any;
  constructor(private renderer: Renderer2, private dialogRef: MatDialogRef<ModalunidadeComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    pass: string,
    modaltxt: string
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
    this.uniForm = new FormGroup({
      unidade: new FormControl('ODC Nova Iguaçu I (Centro)')
    });
    this.modaltxt = this.data.modaltxt;
    this.data.pass = this.uniForm.controls["unidade"].value;
  }

  getPass() {
    this.data.pass = this.uniForm.controls["unidade"].value;
  }

}
