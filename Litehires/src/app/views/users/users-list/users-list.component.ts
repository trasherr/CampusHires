import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EditUserComponent } from '../edit-user/edit-user.component';
import { Dialog } from '@angular/cdk/dialog';
import { faArrowLeft, faPencil, faTrashCan } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {

  faArrowAltCircleLeft = faArrowLeft;
  faPencil = faPencil;
  deleteIcon = faTrashCan;
  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  users: any;

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  })

  constructor(public dialog: Dialog, private http: HttpClient, private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.getUsers()

  }

  getUsers(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/getUsers`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
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
  }

  approveVendor(user: any){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/approveVendor`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), userId: user.id }), {
      headers: headers
    }).subscribe(async (result) => {
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

    this.getUsers()

  }

  refreshVendors(){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/refreshVendors`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe(async (result) => {
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

  updateUserDetails(userData:any){
    this.dialog.open(EditUserComponent,{
      minWidth: '60%',
      maxHeight: '60%',
      data: userData,
    });
    console.log(userData);
  }

  deleteUser(userData:any){

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/deleteUser`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), userId: userData.id }), {
      headers: headers
    }).subscribe(async (result) => {
      this.users = result
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
