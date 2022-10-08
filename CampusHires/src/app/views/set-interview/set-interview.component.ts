import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-set-interview',
  templateUrl: './set-interview.component.html',
  styleUrls: ['./set-interview.component.scss']
})
export class SetInterviewComponent implements OnInit {

  @ViewChild('picker') picker: any;
  minDate: any;
  minTime: any;
  
  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  })

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  durationControl = new FormControl('durationControl');
  formatControl = new FormControl('formatControl');

  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";
  scheduling = false
  
  filteredEmails: Observable<string[]> | any;
  emails: string[] = [];
  allEmails: string[] = [];

  emailCtrl = new FormControl('');
  interviewForm:any = FormGroup;
  meetingFormat: String = "ONLINE"
  duration = 15

  @ViewChild('close') close: ElementRef<HTMLElement> | any;
  @ViewChild('emailInput') emailInput: ElementRef<HTMLInputElement> | any;

  faArrowAltCircleLeft = faXmark;
  constructor(private router: Router, private http: HttpClient, private fb: FormBuilder, public dialogRef: DialogRef, @Inject(DIALOG_DATA) public candidateData: any) { 
   
    this.interviewForm = this.fb.group({
      start: ['',[Validators.required]],
      name: [ `${candidateData.position.name} interview   (${candidateData.first_name} ${candidateData.last_name})` ,[Validators.required]],
      des: [''],
      members: [''],
      value1: ['',[Validators.minLength(10),Validators.minLength(10)]],
      value2: [''],

    });

  }

  ngOnInit(): void {  

    this.minDate = new Date()
    this.minTime = [12,0,0]

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/positionUsers`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.candidateData.positionId }), {
      headers: headers
    }).subscribe((result: any )=> {
      
      Object.entries(result).forEach( (value: any)  => {
        this.allEmails.push(value[1].user.email)
      })

      this.filteredEmails = this.emailCtrl.valueChanges.pipe(
        startWith(null),
        map((user: string | null) => (user ? this._filter(user) : this.allEmails.slice())),
      );
      
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    
    // Add our fruit
    if ( (value) && !this.emails.includes(value) ) {
      this.emails.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.emailCtrl.setValue(null);
  }

  remove(user: string): void {
    const index = this.emails.indexOf(user);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.emails.push(event.option.viewValue);
    if (this.emailInput != undefined)
    this.emailInput.nativeElement.value = '';
    this.emailCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allEmails.filter(user => user.toLowerCase().includes(filterValue));
  }

  scheduleInterview(){
        
    this.scheduling = true
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    let endTime = new Date(this.interviewForm.get("start").value)
    endTime.setMinutes(endTime.getMinutes() + this.duration)

    let value = ""

    if (this.meetingFormat == "PHONE")
    value  = this.interviewForm.get("value1").value

    if(this.meetingFormat == "F2F")
    value  = this.interviewForm.get("value2").value


    this.http.post(`${this.baseUrl}/${this.userType}/interview`, JSON.stringify({
      id:localStorage.getItem("user_id"), 
      access_token:localStorage.getItem("access_token"),
      positionId: this.candidateData.positionId,
      candidateId:this.candidateData.id,
      userId: localStorage.getItem("user_id"),
      start: this.interviewForm.get("start").value,
      duration: Number(this.duration),
      end: endTime,
      type: this.meetingFormat,
      value: value ,
      name: this.interviewForm.get("name").value,
      des: this.interviewForm.get("des").value,
      members: this.emails.join(",")
      
    }), 
    {
      headers: headers
    }).subscribe(async (result: any )=> {
      let el: HTMLElement = this.close.nativeElement;
      el.click()
      await this.toast.fire({
        icon: 'success',
        title: 'Success',
        text: "Interview Scheduled"
      })
      console.log(result);
      this.scheduling = false
      
    })
    
  }

  closePicker() {
    this.picker.cancel();
  }
}
