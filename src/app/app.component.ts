import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
//import { ValidationService } from 'app/validation.service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  title = 'Sistema JF';
  userForm: any;
  constructor(private router: Router, private formBuilder: FormBuilder) {
    this.userForm = this.formBuilder.group({
      name: ['', Validators.required],

      profile: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  saveUser() {
    if (this.userForm.dirty && this.userForm.valid) {
      alert(
        `Name: ${this.userForm.value.name} Email: ${this.userForm.value.email}`
      );
    }
  }


  ngOnInit(): void {



  }

}
