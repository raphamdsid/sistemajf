import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-adminmodal',
  templateUrl: './adminmodal.component.html',
  styleUrls: ['./adminmodal.component.scss']
})
export class AdminmodalComponent implements OnInit {
  text: string = '';
  constructor(private dialogRef: MatDialogRef<AdminmodalComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: { text: string })
  {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.text = this.data.text;
  }

}
