import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastrodep',
  templateUrl: './cadastrodep.component.html',
  styleUrls: ['./cadastrodep.component.scss']
})
export class CadastrodepComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  onSubmit() {
    
    alert("Dependente cadastrado(a) com sucesso!")
    var elements = document.getElementsByTagName("input");
for (var ii=0; ii < elements.length; ii++) {
  if (elements[ii].type == "text") {
    elements[ii].value = "";
  }
}
for (var ii=0; ii < elements.length; ii++) {
  if (elements[ii].type == "date") {
    elements[ii].value = "";
  }
}

  }
}
