import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-new-position',
  templateUrl: './new-position.component.html',
  styleUrls: ['./new-position.component.scss']
})
export class NewPositionComponent implements OnInit {

  
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags = [{name: 'Lemon'}];

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  })

  position = {
    name:null,
    department:null,
    company: null,
    location:null,
    minExp:null,
    maxExp:null,
    minCtc:null,
    maxCtc:null,
    other:null,
    isTest:false,
    isOfferInHand:true,
    isNewCompany:true,
    isNewOffer:true
  }

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";


  newPosition:any = FormGroup;
  constructor(private http: HttpClient,private fb: FormBuilder,private router: Router) {
    this.newPosition = this.fb.group({
      name: ['',Validators.required],
      department: ['',Validators.required],
      company: ['',Validators.required],
      location: ['',Validators.required],
      minExp: ['',Validators.required],
      maxExp: ['',Validators.required],
      minCtc: ['',Validators.required],
      maxCtc: ['',Validators.required],
      other: [''],
      isTest: [''],
      isOfferInHand: [''],
      isNewComapny: [''],
      isNewOffer: [''],
    });
   }

  ngOnInit(): void {
    this.tags.pop()
    this.getUser()
  }

  getUser(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/profile`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token")}), {
      headers: headers
    }).subscribe(async (result: any) => {
      
      if (!result.isVendor)
      this.position.company = result.company
    })

  }

  onSubmit(){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/newPosition`, JSON.stringify({ ...{id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), tags:this.tags  }, ...this.position}), {
      headers: headers
    }).subscribe(async result => {
      this.router.navigate(['/'+this.dashUrl+'/positions'])
      await this.toast.fire({
        icon: 'success',
        title: 'Success'
      })
     
    },
    (async (error: HttpErrorResponse) => {
      console.log(error)
      await this.toast.fire({
        icon: 'error',
        title: 'Error'
      })
    }))

  }
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.tags.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(tag: any): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

}
