import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-estornamodal',
  templateUrl: './estornamodal.component.html',
  styleUrls: ['./estornamodal.component.scss']
})
export class EstornamodalComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  estornaForm: any;
  modaltxt: any;

  constructor(private renderer: Renderer2, private dialogRef: MatDialogRef<EstornamodalComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    result: number,
    modaltxt: string,
    valoratual: number,
    valortotal: number,
    valorestorno: number
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
    this.estornaForm = new FormGroup({
      valor: new FormControl('')
    });
    this.modaltxt = this.data.modaltxt;
  }

  getPass() {
    if (this.estornaForm.controls["valor"].value > this.data.valoratual) {
      this.estornaForm.controls["valor"].setValue(this.data.valoratual);
    }
    this.data.result = this.estornaForm.controls["valor"].value;
  }
  sendData() {
    if (this.estornaForm.controls["valor"].value <= 0 || this.estornaForm.controls["valor"].value == undefined) {
      alert('Valor do estorno deve ser maior que 0');
    }
    else {
      this.dialogRef.close(this.data);
    }
  }
}
