import { Dialog } from '@angular/cdk/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EditAddedMembersComponent } from '../edit-added-members/edit-added-members.component';

@Component({
  selector: 'app-add-member',
  templateUrl: './add-member.component.html',
  styleUrls: ['./add-member.component.scss']
})
export class AddMemberComponent implements OnInit {

  showAdd = false;
  showRm = false;
  @Input() position: any;

  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";
  user_id = localStorage.getItem("user_id");
  roles:any;
  users:any;
  addMember:any = FormGroup;
  rmMember:any = FormGroup;
  positionId = Number(this.route.snapshot.paramMap.get('id'))
  permissions = false

  // bindings
  amObject = {
    email:null,
    roleId:null
  };

  rmEmail ="-1";

  constructor(private http: HttpClient, private fb: FormBuilder, private router:Router, private route:ActivatedRoute, public dialog: Dialog) {
    this.addMember = this.fb.group({
      email: ['',[Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      roleId: ['',[Validators.required]]
    });
    this.rmMember = this.fb.group({
      member: ['',[Validators.required]]
    });
  }

  ngOnInit(): void {

    //get roles ===============================================
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

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

    //get users realted to the current position =========================

    this.http.post(`${this.baseUrl}/${this.userType}/positionUsers`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.positionId }), {
      headers: headers
    }).subscribe(result => {

      this.users = result
      this.users.forEach((val: any) => {
        // if (val.userId == this.user_id)
        //    if(val.role.slug == "ADMIN")
              this.permissions = true
      });

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
    this.http.post(`${this.baseUrl}/${this.userType}/addMember`, JSON.stringify({...{id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),positionId:this.positionId}, ...this.amObject }), {
      headers: headers
    }).subscribe(result => {

      console.log(result)
    },
    ((error: HttpErrorResponse) => {
      console.log(error);

      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))


  }

  //end================================

  rmMemberSubmit(){
    console.log("rm");

    console.log(this.rmEmail);

  }

  openDetailView(){
    this.dialog.open(EditAddedMembersComponent,{
      minWidth: '100%',
      minHeight: '100vh',
      data: this.position,
    });
    // console.log(candidateDetails);
  }


}
