import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.scss']
})
export class MeetingsComponent implements OnInit {

  
  private baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";
  loop : any
  meetings: any

  constructor(private http: HttpClient, private router:Router, private loader: LoadingService) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.getMeetings()
    // this.loop = setInterval(() => {
    //   this.getPositions()
    // },30000)
  }

  getMeetings(){
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.loader.globalLoading(true)

    this.http.post(`${this.baseUrl}/${this.userType}/meetings`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe((result: any) => {

      if(this.userType == "admin"){
        
        this.meetings = result
      }
      else{
        this.meetings = result.meetings
      }
      this.loader.globalLoading(false)

    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
      this.loader.globalLoading(false)
    }))
  }

}
