import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-modalfin',
  templateUrl: './modalfin.component.html',
  styleUrls: ['./modalfin.component.scss']
})
export class ModalfinnComponent implements OnInit {
  text: string = '';
  parcdata: string = '';
  constructor(private dialogRef: MatDialogRef<ModalfinnComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { text: string, parcdata: string }) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.text = this.data.text;
    this.parcdata = this.data.parcdata;

  }

}
