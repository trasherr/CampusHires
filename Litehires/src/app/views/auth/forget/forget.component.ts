import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SimpleResponse } from 'src/app/models/SimpleResponse.interface';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-forget',
  templateUrl: './forget.component.html',
  styleUrls: ['./forget.component.scss']
})
export class ForgetComponent implements OnInit {

  otpEmail:string = '';
  isEmail = false;
  isOTP = false;
  isPass = false;
  reset: any = FormGroup ;
  resetPassword: any = FormGroup ;
  forgetInfo:string = "";
  BASE_URL = environment.BASE_URL;

  constructor(private http: HttpClient,private fb: FormBuilder,private router:Router, private loader: LoadingService) {
    this.reset = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
        });
      this.resetPassword = this.fb.group({
        password: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$')]]
          });
   }

  ngOnInit(): void {
  }

  sendOTP(email:string){
    if(!this.reset.valid){
      return;
    }
    console.log(email);
    this.otpEmail = email;
    this.loader.globalLoading(true)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<SimpleResponse>(`${this.BASE_URL}/auth/sendOTP`, JSON.stringify({email: this.otpEmail,subject:"Reset Password" }), {
      headers: headers
    }).subscribe(result => {
      if(result.res == "success"){
        this.isEmail = true;
      }
      else if(result.res == "failed"){
        this.forgetInfo = "User doesn't exists";
      }
      else{
        this.forgetInfo = "Some error occured";
      }
      this.loader.globalLoading(false)

    })
  }

  otpSubmit(otpV:string){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.loader.globalLoading(true)

    this.http.post<SimpleResponse>(`${this.BASE_URL}/auth/verifyOTP`, JSON.stringify({email: this.otpEmail,otp:Number(otpV) }), {
      headers: headers
    }).subscribe(result => {
          console.log("res:: " + result.res);
          if(result.res == "success")
            this.isOTP = true;
          else if(result.res == "mismatch")
            this.forgetInfo = "Incorrect OTP"
          else
            this.forgetInfo = "unknown error"
        this.loader.globalLoading(false)
          
        });
  }

  resetPass(pass:string){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.loader.globalLoading(true)

    this.http.post<SimpleResponse>(`${this.BASE_URL}/auth/changePass`, JSON.stringify({email: this.otpEmail,password:pass }), {
      headers: headers
    }).subscribe(result => {
          console.log("res:: " + result.res);
          if(result.res == "success"){
            this.forgetInfo = "Password Changed";
            this.isPass = true;
            setTimeout(()=>{
              this.router.navigate(['login']);
            },2000)
          }
          else if(result.res == "failed")
            this.forgetInfo = "Error"
          else
            this.forgetInfo = "unknown error"

          this.loader.globalLoading(false)
          
        });
  }


}
