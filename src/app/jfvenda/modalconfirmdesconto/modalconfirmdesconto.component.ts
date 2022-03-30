import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-modalconfirmdesconto',
  templateUrl: './modalconfirmdesconto.component.html',
  styleUrls: ['./modalconfirmdesconto.component.scss']
})
export class ModalconfirmdescontoComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }

  constructor(private renderer: Renderer2, private dialogRef: MatDialogRef<ModalconfirmdescontoComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    //pass: string,
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
  }
  accept() {
    this.globalListenFunc();
    this.dialogRef.close("OK");
  }
  decline() {
    this.globalListenFunc();
    this.dialogRef.close();
  }
}
