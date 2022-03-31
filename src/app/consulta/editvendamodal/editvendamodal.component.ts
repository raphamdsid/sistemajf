import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';

@Component({
  selector: 'app-editvendamodal',
  templateUrl: './editvendamodal.component.html',
  styleUrls: ['./editvendamodal.component.scss']
})
export class EditvendamodalComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  editForm: any;
  @ViewChild('fiadorcpf', { static: false }) fiadcpf: any;
  @ViewChild('pacientecpf', { static: false }) pacicpf: any;
  constructor(private renderer: Renderer2, private dialogRef: MatDialogRef<EditvendamodalComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    cliente: any,
    fiador: any,
    cpfpaciente: any,
    cpffiador: any,
    createdathour: any,
    createdatdate: any,
    createdby: any,
    docfinanceiro: any,
    docodc: any,
    parcela: any,
    financiador: any,
    financiadores: any,
    id: any,
    isnotfiador: any,
    stats: any,
    unidade: any,
    updatedat: any,
    valortotal: any,
    valoratual: any,
    valorestorno: any
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

    this.editForm = new FormGroup({
      cliente: new FormControl(this.data.cliente, Validators.required),
      cpfpaciente: new FormControl(this.data.cpfpaciente, Validators.required),
      createdatdate: new FormControl(this.data.createdatdate, Validators.required),
      createdathour: new FormControl(this.data.createdathour, Validators.required),
      createdby: new FormControl(this.data.createdby, Validators.required),
      docfinanceiro: new FormControl(this.data.docfinanceiro, Validators.required),
      docodc: new FormControl(this.data.docodc, Validators.required),
      // parcela: new FormControl(this.data.parcela, Validators.required),
      financiador: new FormControl(this.data.financiador, Validators.required),
      id: new FormControl(this.data.id, Validators.required),
      isnotfiador: new FormControl(this.data.isnotfiador, Validators.required),
      stats: new FormControl(this.data.stats, Validators.required),
      // unidade: new FormControl(this.data.unidade, Validators.required),
      //updatedat: new FormControl(this.data.updatedat, Validators.required),
      valortotal: new FormControl(this.data.valortotal, Validators.required),
      valoratual: new FormControl(this.data.valoratual, Validators.required),
      valorestorno: new FormControl(this.data.valorestorno, Validators.required)
    });
    if (this.data.isnotfiador == 1) {
      this.editForm.addControl("cpffiador", new FormControl(this.data.cpffiador, Validators.required));
      this.editForm.addControl("fiador", new FormControl(this.data.fiador, Validators.required));
    }
    console.log(this.data);
    console.log(this.editForm);
    // if (this.editForm.controls["isnotfiador"].value == 0){
    //   alert('Não possui fiador');
    // }
    // if (this.editForm.controls["isnotfiador"].value == 1){
    //   alert('Possui fiador');
    // }
    //this.resetFiador();
  }

  getPass() {
    if (this.editForm.controls["valor"].value > this.data.valoratual) {
      this.editForm.controls["valor"].setValue(this.data.valoratual);
    }
    // this.data.result = this.editForm.controls["valor"].value;
  }
  resetFiador() {
    if (this.editForm.controls["isnotfiador"].value == 1) {
      if (this.data.isnotfiador == 1) {
        this.editForm.addControl("cpffiador", new FormControl(this.data.cpffiador, Validators.required));
        this.editForm.addControl("fiador", new FormControl(this.data.fiador, Validators.required));
      }
      else {
        this.editForm.addControl("cpffiador", new FormControl('', Validators.required));
        this.editForm.addControl("fiador", new FormControl('', Validators.required));
      }
    }
    if (this.editForm.controls["isnotfiador"].value == 0) {
      const pcpf = this.editForm.controls["cpfpaciente"].value;
      if (pcpf.length > 0 && !validate(pcpf)) {
        this.editForm.controls["cpfpaciente"].setValue('');
      }
      this.editForm.removeControl("cpffiador");
      this.editForm.removeControl("fiador");
    }
  }
  cpfValid(tipo: any) {
    // validate(cpf);
    const fcpf = this.editForm.controls["cpffiador"].value;
    const pcpf = this.editForm.controls["cpfpaciente"].value;
    if (this.editForm.controls["isnotfiador"].value == false) {
      if (tipo == 1) {
        if (pcpf.length > 0 && !validate(pcpf)) {
          this.editForm.controls["cpfpaciente"].setValue('');
          this.pacicpf.nativeElement.focus();
          alert("CPF do paciente inválido")
        }
      }
    }
    if (tipo == 2) {
      if (fcpf.length > 0 && !validate(fcpf)) {
        this.editForm.controls["cpffiador"].setValue('');
        this.fiadcpf.nativeElement.focus();
        alert("CPF do fiador inválido")
      }
    }
    if (this.editForm.controls["isnotfiador"].value == true) {
      if (pcpf == fcpf) {
        this.editForm.controls["cpfpaciente"].setValue('');
        this.editForm.controls["cpffiador"].setValue('');
        this.pacicpf.nativeElement.focus();
        alert("Fiador e paciente não podem ter o mesmo CPF.")
      }
    }
  }

  checkIfEqual(a: any, b: any) {
    if (a.cliente == b.cliente && a.fiador == b.fiador && a.cpffiador == b.cpffiador && a.financiador == b.financiador && a.cpfpaciente == b.cpfpaciente && a.isnotfiador == b.isnotfiador && a.docfinanceiro == b.docfinanceiro && a.docodc == b.docodc && a.createdatdate == b.createdatdate && a.createdathour == b.createdathour) {
      return false;
    }
    else {
      return true;
    }
  }

  fixParcela() {
    console.log('works');
    if (this.editForm.controls["parcela"].value !== parseInt(this.editForm.controls["parcela"].value)) {
      this.editForm.controls["parcela"].setValue(1);
    }
    if (this.editForm.controls["parcela"].value === parseInt(this.editForm.controls["parcela"].value)) {
      if (this.editForm.controls["parcela"].value < 1) {
        this.editForm.controls["parcela"].setValue(1);
      }
      if (this.editForm.controls["parcela"].value > 99) {
        this.editForm.controls["parcela"].setValue(99);
      }
    }
  }

  sendData() {
    if (this.editForm.valid) {
      let array: any = [];
      array.original = this.data;
      let cliente = this.editForm.controls["cliente"].value;
      let cpfpaciente = this.editForm.controls["cpfpaciente"].value;
      let fiador = this.editForm.controls["cliente"].value;
      let cpffiador = this.editForm.controls["cpfpaciente"].value;
      if (this.editForm.controls["isnotfiador"].value == 1) {
        fiador = this.editForm.controls["fiador"].value;
        cpffiador = this.editForm.controls["cpffiador"].value;
      }
      let editedobj = {
        cliente: cliente,
        fiador: fiador,
        cpfpaciente: cpfpaciente,
        cpffiador: cpffiador,
        createdatdate: this.editForm.controls["createdatdate"].value,
        createdathour: this.editForm.controls["createdathour"].value,
        createdby: this.editForm.controls["createdby"].value,
        // parcela: this.editForm.controls["parcela"].value,
        docfinanceiro: this.editForm.controls["docfinanceiro"].value,
        docodc: this.editForm.controls["docodc"].value,
        financiador: this.editForm.controls["financiador"].value,
        id: this.editForm.controls["id"].value,
        isnotfiador: this.editForm.controls["isnotfiador"].value,
        stats: this.editForm.controls["stats"].value,
        //unidade: this.editForm.controls["unidade"].value,
        //updatedat: this.editForm.controls["updatedat"].value,
        valortotal: this.editForm.controls["valortotal"].value,
        valoratual: this.editForm.controls["valoratual"].value,
        valorestorno: this.editForm.controls["valorestorno"].value
      }
      if (this.editForm.controls["isnotfiador"].value == 0) {
        editedobj.cpfpaciente = editedobj.cpffiador;
      }
      if (this.editForm.controls["isnotfiador"].value == 1) {
        editedobj.cpfpaciente = this.editForm.controls["cpfpaciente"].value;
      }
      array.new = editedobj;
      if (this.checkIfEqual(array.new, array.original)) {
        this.dialogRef.close(array);
      }
      else {
        alert('Realize alguma alteração para prosseguir');
      }
    }
    else {
      alert("Preencha todos os campos")
    }
  }
}
