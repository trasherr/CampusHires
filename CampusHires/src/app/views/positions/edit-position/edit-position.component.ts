import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { faXmark,faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit {
  faArrowAltCircleLeft = faXmark;
  deleteIcon = faTrashCan;

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  tags = [{name: 'Lemon'}];

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })

  position:any = {
    id:null,
    name:null,
    department:null,
    location:null,
    minExp:null,
    maxExp:null,
    minCTC:null,
    maxCTC:null,
    other:null,
    isTest:false,
    isOfferInHand:true,
    isNewCompany:true,
    isNewOffer:true
  }

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";


  editPosition:any = FormGroup;
  constructor(private http: HttpClient,private fb: FormBuilder,private router: Router, public dialogRef: DialogRef, @Inject(DIALOG_DATA) public positionData: any, public dialog: Dialog, private loader: LoadingService) {
    this.editPosition = this.fb.group({
      name: [this.position.name,Validators.required],
      department: [this.position.department,Validators.required],
      location: [this.position.location,Validators.required],
      minExp: [this.position.minExp,Validators.required],
      maxExp: [this.position.maxExp,Validators.required],
      minCTC: [this.position.minCTC,Validators.required],
      maxCTC: [this.position.maxCTC,Validators.required],
      other: [this.position.other],
      isTest: [this.position.isTest],
      isOfferInHand: [this.position.isOfferInHand],
      isNewComapny: [this.position.isNewCompany],
      isNewOffer: [this.position.isNewOffer],
    });
  }

  ngOnInit(): void {
    this.getPosition();
    this.tags.pop();
  }

  getPosition(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/position`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), positionId: this.positionData.id}), {
      headers: headers
    }).subscribe(result => {
      this.position = result
      this.tags = this.position.tags
    },
      ((error: HttpErrorResponse) => {
        if(error.status == 419){
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }))
  }

  onSubmit(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');
  this.http.post(`${this.baseUrl}/${this.userType}/updatePostion`, JSON.stringify({ ...{ id: localStorage.getItem("user_id"), access_token: localStorage.getItem("access_token"), positionId: this.positionData.id},  ...this.position }), {
    headers: headers
  }).subscribe(async (result: any) => {
    console.log("============================");
    console.log(result);

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

  delPosition(){
    this.loader.globalLoading(true)

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/rmPosition`, JSON.stringify(
        {
        id:localStorage.getItem("user_id"),
        access_token:localStorage.getItem("access_token"),
        positionId: this.position.id,
      }), {
      headers: headers
    }).subscribe(async () => {
      this.dialogRef.close()
      this.loader.globalLoading(false)
      this.router.navigate([`${this.dashUrl}/positions`]);
      await this.toast.fire({
        icon: 'success',
        title: 'Success'
      })
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
          text: "Not enough permissions"
        })

      }
    this.loader.globalLoading(false)

    }))

  }
}
