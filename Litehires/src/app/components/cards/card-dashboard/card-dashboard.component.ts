import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { faA, faAdd, faBolt} from '@fortawesome/free-solid-svg-icons';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { LoadingService } from 'src/app/services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-dashboard',
  templateUrl: './card-dashboard.component.html',
  styleUrls: ['./card-dashboard.component.scss']
})
export class CardDashboardComponent implements OnInit {

  faAdd = faAdd
  faBolt = faBolt
  @Input() calendar: any
  @Input() positions: any
  // @Input() notifications:any

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";


  user: any;
  constructor(
    private router: Router,
    private http: HttpClient,
    private loader: LoadingService
  ) { }

  ngOnInit(): void {

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

      this.http.post(`${this.baseUrl}/${this.userType}/profile`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
      }).subscribe(result => {
        this.user = result
        console.log(this.user);

      },
      ((error: HttpErrorResponse) => {
        this.loader.globalLoading(false)
        if(error.status == 419){
          localStorage.clear();
          this.router.navigate(['/login'])
        }
      }))

  }

  enrol(){
    this.loader.globalLoading(true)

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/enrolVendor`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
    headers: headers
    }).subscribe(result => {
      this.loader.globalLoading(false)
      this.user.isVendorApplied = true
    },
    ((error: HttpErrorResponse) => {
      this.loader.globalLoading(false)
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

  }

}
