import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  imgVar = ""

  profile:any = FormGroup;
  user:any = {
    first_name:null,
    last_name:null,
    phone_no:null,
    city:null,
    country:null,
    img:null,
    company:null,
    position:null,
    isAdmin:null
  };

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  })

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, public dialogRef: DialogRef, @Inject(DIALOG_DATA) public userData: any, public dialog: Dialog) {
    this.profile = this.fb.group({
      email: [this.user.email],
      first_name: [this.user.first_name, [Validators.required, Validators.minLength(3)]],
      last_name: [this.user.last_name, [Validators.required, Validators.minLength(3)]],
      company: [this.user.company],
      position: [this.user.position],
      phone_no: [this.user.phone_no],
      city: [this.user.city],
      country: [this.user.country],
    });
   }
  ngOnInit(): void {
    this.getProfile();
    console.log(this.userData.id);
    
  }


  
  getProfile(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/getUserProfile`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), userId: this.userData.id }), {
      headers: headers
    }).subscribe(result => {
      console.log(result);
      
      this.user = result
      
      if(this.user.img){
        this.imgVar = `${this.baseUrl}/images/users/dp/${this.user.img}`
      }
      console.log(result)
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  setDP(imgData:string){
    this.imgVar = `${this.baseUrl}/images/users/dp/${imgData}`
  }

  onSubmit(){
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/updateUser`, JSON.stringify({ ...{id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), userId: this.userData.id  }, ...this.user}), {
      headers: headers
    }).subscribe(async result => {
      this.user = result
      if(this.user.img == null){
        this.user.img = "assets/img/anime3.png";
      }else{
        this.user.img = `${this.baseUrl}/images/users/dp/${this.user.img}`
      } 
      console.log(result)
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
      await this.toast.fire({
        icon: 'error',
        title: 'Error'
      })
    }))
  }

}
