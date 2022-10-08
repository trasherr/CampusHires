import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.scss']
})
export class PositionsComponent implements OnInit {


  private baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";
  loop : any

  positions: any;

  constructor(private http: HttpClient, private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.getPositions()
    // this.loop = setInterval(() => {
    //   this.getPositions()
    // },30000)

  }

  getPositions(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/positions`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe((result: any) => {
      if(this.userType == "admin"){
        this.positions = result
      }
      else{
        this.positions = result.positions
      }
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))
  }

  approvePosition(pos: any){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post(`${this.baseUrl}/${this.userType}/approvePosition`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), positionId: pos.id, isPublic: 1}), {
      headers: headers
    }).subscribe((result) => {
        this.ngOnInit()
        console.log(result)
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

  openPosition(position:any){
    this.router.navigate([`position/${position.id}`])
  }


  ngOnDestroy() : void {
    clearInterval(this.loop);
  }



}
