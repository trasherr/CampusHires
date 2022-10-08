import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";
  loop1 : any
  loop2 : any

  imgVar = ""

  profile:any = FormGroup;
  changePassword:any = FormGroup;
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
  match = true

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  })

  constructor(private http: HttpClient,private fb: FormBuilder, private router: Router) {
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
    this.changePassword = this.fb.group({
      password: ["",Validators.required],
      new_password: ["", [Validators.required, Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')]],
      confirm_password: [""]
    });
   }


  ngOnInit(): void {
    this.getProfile()
    this.confirmMatch()
    this.loop1 = setInterval(() => {
      this.getProfile();
    },30000)
  }

  confirmMatch(){
    this.loop2 = setInterval(()=>{
      if(this.changePassword.get("new_password").value == this.changePassword.get("confirm_password").value)
        this.match = true;
      else
        this.match = false;
    },500)

  }

  sendNewPassword(){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/changePassword`, 
      JSON.stringify(
        {
          id:localStorage.getItem("user_id"), 
          access_token:localStorage.getItem("access_token"),
          password: this.changePassword.get("password").value,
          new_password: this.changePassword.get("new_password").value
        }
      ), 
      {
        headers: headers
      }
    ).subscribe(async (result: any) => {

      await this.toast.fire({
        icon: result.type,
        title: result.type,
        text: result.message
      })
      
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  getProfile(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/profile`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe(result => {
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
    console.log(JSON.stringify({ ...{id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token")  }, ...this.user}))

    this.http.post(`${this.baseUrl}/${this.userType}/update`, JSON.stringify({ ...{id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token")  }, ...this.user}), {
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

  ngOnDestroy() : void {
    clearInterval(this.loop1);
    clearInterval(this.loop2);
  }

}
