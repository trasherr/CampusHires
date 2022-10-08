import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-join-position',
  templateUrl: './join-position.component.html',
  styleUrls: ['./join-position.component.scss']
})
export class JoinPositionComponent implements OnInit {

  code:any;
  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";


  constructor(private http: HttpClient,private route:ActivatedRoute,private router:Router) { }

  ngOnInit(): void {
    this.code = this.route.snapshot.paramMap.get('code')
    localStorage.removeItem("join_code")
    console.log(localStorage.getItem("join_code"));
    
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/joinMember`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"),code:this.code }), {
      headers: headers
    }).subscribe(result => {
      console.log("+====")
      this.router.navigate(['/'+this.dashUrl+'/positions'])
    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        localStorage.setItem("join_code",this.code)
        this.router.navigate(['/login'])
      }
      else{
      this.router.navigate(['/'+this.dashUrl+'/positions'])
      }
    }))
    this.router.navigate(['/'+this.dashUrl+'/positions'])

  }

}
