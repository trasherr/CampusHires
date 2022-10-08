import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRes } from 'src/app/models/LoginResponse.interface';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';
import { LoadingService } from 'src/app/services/loading.service';
import { faEnvelope, faDotCircle } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  faEnvelope = faEnvelope
  faCommentDots = faDotCircle
  user = { email :"", password : '', exp:"2h"};
  error: string ="";
  loginForm: any = FormGroup ;
  token = localStorage.getItem("access_token");
  isRemember = false;
  decoded: any;

  constructor(private http: HttpClient,private fb: FormBuilder ,private router:Router, private loader: LoadingService) {

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required]]
        });
    //   password: ['', [Validators.required,Validators.pattern(
    //     '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,12}$'
    //   )]]
    // });

  }

  ngOnInit(): void {
      if(localStorage.getItem("access_token") != null){
          this.router.navigate(['/userDashboard'])
      }
  }

  loginCall() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<LoginRes>(environment.BASE_URL+'/auth/login', JSON.stringify(this.user), {
      headers: headers
    });

  }

  onSubmit(){
      if(!this.loginForm.valid){
        return;
      }

      this.user.email = this.loginForm.get("email").value
      this.user.password = this.loginForm.get("password").value
      if(this.isRemember)
        this.user.exp = "30 days"
      else
        this.user.exp = "2h"

      this.loader.globalLoading(true)
      this.loginCall().subscribe((response)=>{
      this.loader.globalLoading(false)
        console.log('response is ', response)
        if(response == null){
          this.error = "Incorrect email or password"
        }
        else{
          let code = localStorage.getItem("join_code")
          localStorage.clear()

          if(code){
          localStorage.setItem("join_code",code)

          }


          localStorage.setItem('access_token',response.access_token)
          localStorage.setItem('user_id',String(response.id))

          this.decoded = jwt_decode(response.access_token)
          localStorage.setItem("isAdmin",this.decoded.isAdmin)

          if(localStorage.getItem("isAdmin") == "true"){
            this.router.navigate(["/litehiresDashboard/index"]);
          }

          else{
            
            this.router.navigate(["/userDashboard/index"]);
          }
        }

    },(e) => {
        console.log('error is ', e)
    })
  }

}
