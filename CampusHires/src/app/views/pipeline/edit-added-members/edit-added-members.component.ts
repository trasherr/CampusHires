import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import {  faXmark } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-added-members',
  templateUrl: './edit-added-members.component.html',
  styleUrls: ['./edit-added-members.component.scss']
})
export class EditAddedMembersComponent implements OnInit {


  faArrowAltCircleLeft = faXmark;
  showAdd = false;
  showRm = false;

  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";

  roles:any;
  users:any;
  addMember:any = FormGroup;
  rmMember:any = FormGroup;
  invites: any;

  // bindings
  amObject = {
    email:null,
    roleId:null
  };

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 5000,
    timerProgressBar: true
  })



  rmEmail ="-1";

  constructor(public dialogRef: DialogRef, @Inject(DIALOG_DATA) public position: any,private http: HttpClient, private fb: FormBuilder, private router:Router, private route:ActivatedRoute) {
    this.addMember = this.fb.group({
      email: ['',[Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      roleId: ['',[Validators.required]]
    });
    this.rmMember = this.fb.group({
      member: ['',[Validators.required]]
    });
  }

  ngOnInit(): void {
    console.log(this.position);


    //get roles ===============================================
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") })

    this.http.post(`${this.baseUrl}/${this.userType}/roles`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe(result => {
      this.roles = result

    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

    //end==========================================================

    this.getMembers()
    this.getInvites()

  }


  // get Members function

  getMembers(){
     //get users realted to the current position =========================
     const headers = new HttpHeaders().set('Content-Type', 'application/json');

     this.http.post(`${this.baseUrl}/${this.userType}/positionUsers`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id }), {
      headers: headers
    }).subscribe((result: any) => {
      this.users = result
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

    //end ========================================
  }

  // Add candidate =========================

  addMemberSubmit(){
    console.log("add");

    console.log(this.amObject);

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/addMember`, JSON.stringify({...{id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id}, ...this.amObject }), {
      headers: headers
    }).subscribe(async (result: any) => {
      this.dialogRef.close()

      if(result.res == "success"){
        await this.toast.fire({
          icon: 'success',
          title: 'Success',
          text: "Invitation Sent"
        })
      }
      else if(result.res == "joined"){
        await this.toast.fire({
          icon: 'success',
          title: 'Success',
          text: "User added to the position"
        })
      }
      else{
        await this.toast.fire({
          icon: 'success',
          title: 'Success'
        })
      }
      
      console.log(result)

    },
    (async (error: HttpErrorResponse) => {
      
      if(error.status == 550){
        await this.toast.fire({
          icon: 'error',
          title: 'Failed',
          text: "Invitation already sent"
        })
        return ;
      }
      await this.toast.fire({
        icon: 'error',
        title: 'Failed',
        text: "This might be because have already sent the invite once"
      })

      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
      
    }))

    this.getMembers()
  }

  //end================================

  rmMemberSubmit(userId: Number){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/rmMember`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id, userId: userId }), {
      headers: headers
    }).subscribe(result => {

      console.log(result)
    },
    (async (error: HttpErrorResponse) => {
      console.log(error);

      
      if(error.status == 550){
        await this.toast.fire({
          icon: 'error',
          title: 'Failed',
          text: "Position must have atleast one user"
        })
      }
      if(error.status == 550){
        await this.toast.fire({
          icon: 'error',
          title: 'Failed',
          text: "Position must have atleast one member"
        })
      }


      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

    this.getMembers()

  }

  changeStatus(val: string){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/positionStatusChange`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id, status: val }), {
      headers: headers
    }).subscribe(async result => {
      this.position.status = val

      await this.toast.fire({
        icon: 'success',
        title: 'Success'
      })
    },
    ((error: HttpErrorResponse) => {
      console.log(error);


      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }
  changeVisibility(val: boolean){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/positionVisibilityChange`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id, isPublic: val }), {
      headers: headers
    }).subscribe(async result => {
      this.position.isPublic = val
      await this.toast.fire({
        icon: 'success',
        title: 'Success'
      })
    },
    ((error: HttpErrorResponse) => {
      console.log(error);


      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  getInvites(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/getInvites`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id }), {
      headers: headers
    }).subscribe((result: any) => {      
      this.invites = result
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  resendinvite(invite: any){
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/resendInvite`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.position.id, email:invite.email }), {
    headers: headers
    }).subscribe(async result => {      
      await this.toast.fire({
        icon: 'success',
        title: 'Success'
      })
    },
    ((error: HttpErrorResponse) => {
    if(error.status == 419){
      localStorage.clear();
      this.router.navigate(['/login'])
    }
    }))


  }

}
