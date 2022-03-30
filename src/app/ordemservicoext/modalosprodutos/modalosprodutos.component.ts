import { formatCurrency } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, HostListener, Renderer2 } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogActions } from '@angular/material/dialog';
import { validate } from 'gerador-validador-cpf';
import { ConsultaService } from 'src/app/services/consulta.service';
import { ToolsService } from 'src/app/services/tools.service';

@Component({
  selector: 'app-modalosprodutos',
  templateUrl: './modalosprodutos.component.html',
  styleUrls: ['./modalosprodutos.component.scss']
})
export class ModalosprodutosComponent implements OnInit {
  key: any;
  globalListenFunc: any;
  objbuscap: any = [];
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    this.key = event.key;
  }
  newProdForm: any;
  produtos: any = [];
  total = 0;
  constructor(private renderer: Renderer2, private service: ConsultaService, private tools: ToolsService, private dialogRef: MatDialogRef<ModalosprodutosComponent>, private formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA)
  public data: {
    // custo_materiais: any;
    produtos: any;
    produtolist: any;
  }
  ) { dialogRef.disableClose = true; }

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == "Escape") {
        this.globalListenFunc();
        this.onNoClick();
      }
    });
    this.produtos = this.data.produtolist;
    this.calcTotal();
    this.newProdForm = new FormGroup({
      produto: new FormControl('', Validators.required),
      qtd: new FormControl(0, Validators.required),
      obs: new FormControl(''),
      buscaproduto: new FormControl(''),
      valor: new FormControl(0, Validators.required)
    });
    console.log(this.data);
  }
  calcTotal() {
    let total = 0;
    for (let x = 0; x < this.produtos.length; x++) {
      total = Number(total) + ((Number(this.produtos[x].valor) * Number(this.produtos[x].qtd)));
    }
    this.total = total;
    console.log(total);

  }
  onNoClick() {
    if (this.produtos.length == 0) {
      this.produtos = [];
      this.total = 0;
    }
    let result = {
      total: this.total,
      produtolist: this.produtos
    }
    this.globalListenFunc();
    this.dialogRef.close(result);
  }
  setUpperCase(str: string) {
    return str.toUpperCase();
  }

  fixQtd() {
    if (Number(this.newProdForm.controls["qtd"].value) > 50) {
      console.log(this.newProdForm.controls["qtd"].value);
      this.newProdForm.controls["qtd"].setValue('');
      this.newProdForm.controls["qtd"].setValue(50);
      console.log(this.newProdForm.controls["qtd"].value);
    }
  }

  setValor() {
    let id = this.newProdForm.controls["produto"].value;
    this.newProdForm.controls["valor"].setValue(this.data.produtos[id].valor);
    console.log(this.data.produtos[id].nome);
    console.log(this.data.produtos[id].valor);

  }

  buscaProduto() {
    if (this.newProdForm.controls["buscaproduto"].value.length >= 3) {
      console.log(this.newProdForm.controls["buscaproduto"].value);
      let search = {
        busca: this.newProdForm.controls["buscaproduto"].value
      }
      this.service.searchProdutosOs(search).subscribe(c => {
        console.log(c);
        if (c.Produtos.length > 0) {
          this.objbuscap = c.Produtos;
          console.log(this.objbuscap);
        }
        else {
          this.objbuscap = [];
        }
      },
        (error) => {
          this.objbuscap = [];
        });
    }
    if (this.newProdForm.controls["buscaproduto"].value.length < 3) {
      this.objbuscap = [];
    }
  }
  addProduto(produto: any, index: any) {
    //this.produtos.tipo = 'tbl';
    // this.produtos.push(this.objbuscap[index]);
    console.log(this.produtos);
    this.objbuscap = [];
    this.newProdForm.controls["produto"].setValue(produto.nome);
    this.newProdForm.controls["valor"].setValue(produto.valor);
    this.newProdForm.controls["buscaproduto"].setValue('');
    // this.calcDesconto();
  }
  changeProd() {
    this.newProdForm.controls["produto"].setValue('');
    this.newProdForm.controls["valor"].setValue('');
    this.newProdForm.controls["buscaproduto"].setValue('');
  }
  newProduto() {
    if (this.newProdForm.controls["produto"].valid) {
      let index = this.newProdForm.controls["produto"].value;
      // let nome = this.data.produtos[index].nome;
      let obj = {
        nome: this.newProdForm.controls["produto"].value,
        valor: this.newProdForm.controls["valor"].value,
        obs: this.newProdForm.controls["obs"].value,
        qtd: this.newProdForm.controls["qtd"].value
      }
      this.produtos.push(obj);
      this.sortArray();
      this.calcTotal();
      this.resetForm();
      console.log(this.produtos);
    }
    else {
      alert("Preencha todos os campos obrigatórios")
    }

  }
  deleteProduto(index: any) {
    this.produtos.splice(index, 1);
    this.calcTotal();
    if (this.produtos.length == 0) {
      this.produtos = [];
      this.total = 0;
    }
    else {
      this.sortArray();
    }
    this.resetForm();
  }
  resetForm() {
    this.newProdForm.controls["produto"].setValue('');
    this.newProdForm.controls["obs"].setValue('');
    this.newProdForm.controls["valor"].setValue(0);
    this.newProdForm.controls["qtd"].setValue(0);
  }
  sortArray() {
    this.produtos.sort(function (a: any, b: any) {
      if (a.nome < b.nome) { return -1; }
      if (a.nome > b.nome) { return 1; }
      return 0;
    })
  }
}
