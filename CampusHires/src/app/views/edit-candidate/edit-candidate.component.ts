import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { format } from 'date-fns';
import { faXmark,faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { LoadingService } from 'src/app/services/loading.service';
@Component({
  selector: 'app-edit-candidate',
  templateUrl: './edit-candidate.component.html',
  styleUrls: ['./edit-candidate.component.scss']
})
export class EditCandidateComponent implements OnInit {

  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";
  faArrowAltCircleLeft = faXmark;
  deleteIcon = faTrashCan;

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true
  })

  uploadNow = this.route.snapshot.paramMap.get('cid') ? true : false
  setResume = this.uploadNow ? String(this.route.snapshot.paramMap.get('cid')) : ""

  candidate:any = {
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
  editCandidate: any = FormGroup;
  // position: any;
  // positionId: number = Number(this.route.snapshot.paramMap.get('id'));

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, public dialogRef: DialogRef, @Inject(DIALOG_DATA) public candidateData: any, public dialog: Dialog, private loader: LoadingService) {
    this.editCandidate = this.fb.group({
      first_name: [this.candidate.first_name, [Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(2)]],
      last_name: [this.candidate.last_name, [Validators.required,Validators.pattern('[a-zA-Z]+$'),Validators.minLength(2)]],
      email: [this.candidate.email, [Validators.required,Validators.email]],
      phone_no: [this.candidate.phone_no, [Validators.required,Validators.pattern("[0-9]*"),Validators.minLength(10),Validators.maxLength(10)]],
      gender: [this.candidate.gender, Validators.required],
      currentCtc: [this.candidate.currentCtc, Validators.required],
      expectedCtc: [this.candidate.expectedCtc, Validators.required],
      location: [this.candidate.location, Validators.required],
      experience: [this.candidate.experience, Validators.required],
      lastDay: [this.candidate.lastDay],
      currentCompany: [this.candidate.currentCompany],
      newCompany: [this.candidate.newCompany],
      newOffer: [this.candidate.newOffer],
      position: [this.candidate.position],
      rtc: [ this.candidate.rtc ]
    });
  }


  ngOnInit(): void {
    this.getCandidateInfo()
  }

  getCandidateInfo(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/getCandidate`,JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), candidateId: this.candidateData.id }), {
      headers: headers
    }).subscribe(result => {
      this.candidate = result
      delete this.candidate.id

      console.log(result)
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  onSubmit() {

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/updateCandidateDetails`, JSON.stringify({ ...{ id: localStorage.getItem("user_id"), access_token: localStorage.getItem("access_token"),candidateId: this.candidateData.id},  ...this.candidate }), {
      headers: headers
    }).subscribe(async (result: any) => {

      this.dialogRef.close()
      await this.toast.fire({
        icon: 'success',
        title: 'Success',
        text: "Candidate Updated"
      })
    },
      (async (error: HttpErrorResponse) => {

        console.log(error);
      }))

  }

  delCandidate(){
    this.loader.globalLoading(true)

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/rmCandidate`, JSON.stringify(
        {
        id:localStorage.getItem("user_id"),
        access_token:localStorage.getItem("access_token"),
        candidateId: this.candidateData.id,
      }), {
      headers: headers
    }).subscribe(async () => {
      await this.toast.fire({
        icon: 'success',
        title: 'Success'
      })
      this.loader.globalLoading(false)

    },
    (async (error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
      if(error.status == 450){
        await this.toast.fire({
          icon: 'error',
          title: 'Error',
          text: "Candidate not found"
        })

      }
    this.loader.globalLoading(false)

    }))

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

