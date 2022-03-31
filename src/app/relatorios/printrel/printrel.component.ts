import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-printrel',
  templateUrl: './printrel.component.html',
  styleUrls: ['./printrel.component.scss']
})
export class PrintrelComponent implements OnInit {
  data: any;
  //route: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.data = this.route.snapshot.paramMap.get('data');
    // this.data = this.route.snapshot.paramMap.get('data');
    console.log(this.data);
    // window.print();
    // window.close();
  }

}
