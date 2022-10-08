import { Component, OnInit } from '@angular/core';
import { faCheck } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  faCheck = faCheck
  isAnnual: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

  togglePricing(){
    if (this.isAnnual === true) {
      this.isAnnual = false
    } else {
      this.isAnnual = true
    }
  }
}
