import { Component, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-modalb',
  templateUrl: './modalb.component.html',
  styleUrls: ['./modalb.component.scss']
})
export class ModalbComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  pwdForm: any;
  modaltxt: any;
  constructor(private renderer: Renderer2, private dialogRef: MatDialogRef<ModalbComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
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
    this.pwdForm = new FormGroup({
      pwd: new FormControl('')
    });
    this.modaltxt = this.data.modaltxt;
  }
  confirm() {
    let resultb = this.pwdForm.controls["pwd"].value;
    this.globalListenFunc();
    this.dialogRef.close(resultb);
  }
  cancel() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
}
