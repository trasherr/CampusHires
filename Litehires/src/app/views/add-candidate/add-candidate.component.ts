import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import {MatChipInputEvent} from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.scss']
})
export class AddCandidateComponent implements OnInit {

  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  })

  uploadNow = this.route.snapshot.paramMap.get('cid') ? true : false
  setResume = this.uploadNow ? String(this.route.snapshot.paramMap.get('cid')) : ""

  addOnBlurMain = true;
  addOnBlurOther = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  mainSkill = ['Lemon'];
  otherSkill = ['Lemon'];

  candidate = {
    first_name: null,
    last_name: null,
    email: null,
    phone_no: null,
    gender: null,
    currentCtc: null,
    expectedCtc: null,
    location: null,
    rtc: false,
    experience: null,
    notice: false,
    unemployed: true,
    lastDay: Date,
    currentCompany: null,
    offerInHand: false,
    newCompany: null,
    newOffer: null,
    pincode: null,
    company: null,
    position: null,
  }

  baseUrl = environment.BASE_URL
  newCandidate: any = FormGroup;
  position: any;
  positionId:number = Number(this.route.snapshot.paramMap.get('id'));

  constructor(private http: HttpClient, private fb: FormBuilder, private router:Router, private route:ActivatedRoute) {
    this.newCandidate = this.fb.group({
      first_name: ['', [Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(2)]],
      last_name: ['', [Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(2)]],
      email: ['', [Validators.required,Validators.email]],
      phone_no: ['', [Validators.required,Validators.pattern("[0-9]*"),Validators.minLength(10),Validators.maxLength(10)]],
      gender: ['', Validators.required],
      currentCtc: ['', Validators.required],
      expectedCtc: ['', Validators.required],
      location: ['', Validators.required],
      experience: ['', Validators.required],
      lastDay: [''],
      rtc: [''],
      currentCompany: [''],
      newCompany: [''],
      newOffer: [''],
      position: ['']
    });
  }

  get first_name(){
    return this.newCandidate.get('first_name');
  }
  get last_name(){
    return this.newCandidate.get('last_name');
  }
  get email(){
    return this.newCandidate.get('email');
  }
  get phone_no(){
    return this.newCandidate.get('phone_no');
  }
  get gender(){
    return this.newCandidate.get('gender');
  }
  get currentCtc(){
    return this.newCandidate.get('currentCtc');
  }
  
  get expectedCtc(){
    return this.newCandidate.get('expectedCtc');
  }
  
  get experience(){
    return this.newCandidate.get('experience');
  }
  get location(){
    return this.newCandidate.get('location');
  }
  get currentCompany(){
    return this.newCandidate.get('currentCompany');
  }
  


  ngOnInit(): void {
    this.mainSkill.pop()
    this.otherSkill.pop()
  }

  onSubmit() {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/addCandidate`, JSON.stringify(
      { 
        ...{ id: localStorage.getItem("user_id"), access_token: localStorage.getItem("access_token"), positionId: this.positionId },  
      ...this.candidate ,
      mainSkill: this.mainSkill[0],
      otherSkill: this.otherSkill
    }
    ), {
      headers: headers
    }).subscribe(async (result: any) => {
      this.uploadNow = true
      this.setResume = String(result.candidateId)
      
      await this.toast.fire({
        icon: 'success',
        title: 'Success',
        text: "Candidate uploaded"
      })
    },
      (async (error: HttpErrorResponse) => {
        
        error.error?.errors.forEach(async (element : any) => {

          if(element.type == "NOT_ACTIVE"){
            await this.toast.fire({
              icon: 'error',
              title: 'Error',
              text: "Position is not active"
            })
          }
          
          else if(element.type == "unique violation"){
            await this.toast.fire({
              icon: 'error',
              title: 'Error',
              text: "Candidate already exists"
            })
          }
          else{
            await this.toast.fire({
              icon: 'error',
              title: 'Error'
            })
          }
        });
        
      }))

  }

  addMain(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value && this.mainSkill.length < 1) {
      this.mainSkill.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeMain(tag: any): void {
    const index = this.mainSkill.indexOf(tag);

    if (index >= 0) {
      this.mainSkill.splice(index, 1);
    }
  }
  addOther(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value && this.otherSkill.length < 4) {
      this.otherSkill.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  removeOther(tag: any): void {
    const index = this.otherSkill.indexOf(tag);

    if (index >= 0) {
      this.otherSkill.splice(index, 1);
    }
  }

  setUnemployed(isSetUnemp: boolean){
    this.candidate.unemployed = isSetUnemp
    this.candidate.notice = !isSetUnemp
  }

  setNotice(isSetUnemp: boolean){
    this.candidate.unemployed = !isSetUnemp
    this.candidate.notice = isSetUnemp
  }

}
