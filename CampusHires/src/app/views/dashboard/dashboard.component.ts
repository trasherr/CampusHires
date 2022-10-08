import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


export class DashboardComponent implements OnInit {

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";

  calendar: any

  allPositions : any
  recentCandidates: any
  allUsers: any

  constructor(private http: HttpClient, private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {
    this.getCards()
  }

  getCards(){

    // get data for all the positions
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/positions`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe((result: any) => {
      if(this.userType == "admin"){
        this.allPositions = result
      }
      else{
        this.allPositions = result.positions
      }
    })

    this.http.post(`${this.baseUrl}/${this.userType}/recentEvents`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe((result: any) => {
      this.calendar = result?.calendars
      // }
    })

    this.http.post(`${this.baseUrl}/${this.userType}/getAllCandidates`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe((result: any) => {
      console.log(result);
      if(this.userType == "admin"){
        this.recentCandidates = result
      }
      else{
        this.recentCandidates = result?.candidates
      }
      
      // }
    })

    if(this.userType == "admin"){
      this.http.post(`${this.baseUrl}/admin/getUsers`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
        headers: headers
      }).subscribe((result: any) => {
        console.log(result);
          this.allUsers = result        
      })
    }
  }
}
