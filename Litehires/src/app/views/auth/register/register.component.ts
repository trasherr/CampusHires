import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CreateUser } from 'src/app/models/CreateUser.interface';
import { User } from 'src/app/models/User.interface';
import { environment } from 'src/environments/environment';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {


  signupForm:any = FormGroup;
  errors = "";
  success = "";
  createUser:any;
  match:boolean = true;
  matchStart:boolean = false;
  baseUrl = environment.BASE_URL;
  loop: any;
  isVendor = false;

  constructor(private http: HttpClient,private fb: FormBuilder ,private router:Router, private loader: LoadingService) {
    this.signupForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required,Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,32}$')]],
      confirm_password: [''],
      phone_no: ['',[Validators.required, Validators.pattern("[0-9 ]{10}")]],
      company: ['',Validators.required],
      customCheckRegister: ['',Validators.required]
    });
   }

   registerCall(u:any) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

      return this.http.post<User>(`${this.baseUrl}/auth/register`, JSON.stringify(u), {
      headers: headers
    });

  }

  startMatch(){
    if(this.matchStart){
      return;
    }
    this.confirmMatch()
    this.matchStart = true;
  }

  confirmMatch(){
    this.loop = setInterval(()=>{
      if(this.signupForm.get("password").value == this.signupForm.get("confirm_password").value)
        this.match = true;
      else
        this.match = false;
    },500)

  }

  ngOnInit(): void {
    console.log(localStorage.getItem("join_code"));
    
  }

  onSubmit(firstName: string, lastName: string, email: string, password: string, phone_no: string, company: string){
    if(!this.signupForm.valid){
      return;
    }

    this.createUser = <CreateUser>{
      first_name : firstName,
      last_name : lastName,
      email : email,
      password : password,
      phone_no : phone_no,
      company : company,
      isVendor: this.isVendor
    }

    this.loader.globalLoading(true)
    this.registerCall(this.createUser).subscribe((response)=>{
      this.loader.globalLoading(false)

      console.log('response is ', response)

      if(response.id != null && response.id != 0){
        this.success = "Account created"
        setTimeout(()=>{
          this.router.navigate(['/userDashboard'])
        },2000)
        return;
      }else{
        this.errors = "Account already exists"
        return;
      }

    },(error) => {
        console.log('error is ', error)
    })

  }
  ngOnDestroy(){
    clearInterval(this.loop)
  }

  setVendor(val: boolean){
    this.isVendor = val
  }
}
