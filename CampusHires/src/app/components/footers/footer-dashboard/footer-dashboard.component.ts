import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer-dashboard',
  templateUrl: './footer-dashboard.component.html',
  styleUrls: ['./footer-dashboard.component.scss']
})
export class FooterDashboardComponent implements OnInit {
  test: Date = new Date();
  constructor() { }

  ngOnInit(): void {
  }

}
