import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-modala',
  templateUrl: './modala.component.html',
  styleUrls: ['./modala.component.scss']
})

export class ModalaComponent implements OnInit {
  template: any;
  constructor(private dialogRef: MatDialogRef<ModalaComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    text: string,
    paciente: string,
    fiador: string,
    cpfp: string,
    cpff: string,
    docf: string,
    doco: string,
    parcela: number,
    valortotal: number,
    financiador: string,
    isnotfiador: boolean
  }) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    console.log(this.data);
    if (this.data.isnotfiador == false) {
      this.template = 1;
    }
    if (this.data.isnotfiador == true) {
      this.template = 2;
    }
  }
  submit(val: any) {
    if (val == 1) {
      this.dialogRef.close(true);
    }
    if (val == 0) {
      this.dialogRef.close();
    }
  }

}
