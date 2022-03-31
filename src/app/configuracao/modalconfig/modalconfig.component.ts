import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-modalconfig',
  templateUrl: './modalconfig.component.html',
  styleUrls: ['./modalconfig.component.scss']
})
export class ModalconfigComponent implements OnInit {
  text: string = '';
  constructor(private dialogRef: MatDialogRef<ModalconfigComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { text: string }) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.text = this.data.text;
  }

}
