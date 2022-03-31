import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';


@Component({
  selector: 'app-modalprodlist',
  templateUrl: './modalprodlist.component.html',
  styleUrls: ['./modalprodlist.component.scss']
})
export class ModalprodlistComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<ModalprodlistComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    produtos: any,
    modaltxt: string
  }) { }

  ngOnInit(): void {
  }
  onNoClick(){
    this.dialogRef.close();
  }
}
