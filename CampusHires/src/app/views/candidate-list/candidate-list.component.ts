import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Dialog } from '@angular/cdk/dialog';
import { faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons';
import { EditCandidateComponent } from '../edit-candidate/edit-candidate.component';

@Component({
  selector: 'app-candidate-list',
  templateUrl: './candidate-list.component.html',
  styleUrls: ['./candidate-list.component.scss']
})
export class CandidateListComponent implements OnInit {

  faArrowAltCircleLeft = faArrowLeft;
  faPencil = faPencil;
  private baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";

  candidates_list:any;
  // loop: any

  constructor( public dialog: Dialog,private http: HttpClient, private router:Router) { 
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
   }

  ngOnInit(): void {
    this.getCandidates()

    // this.loop = setInterval( ()=> {
    //   this.getCandidates()
    // },30000 )
   
  }

  getCandidates(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

  this.http.post(`${this.baseUrl}/${this.userType}/getAllCandidates`, JSON.stringify({ id: localStorage.getItem("user_id"), access_token: localStorage.getItem("access_token") }), {
    headers: headers
  }).subscribe((result: any) => {
    console.log(result);
    
    if(this.userType == "admin"){
      this.candidates_list = result
    }else{
      this.candidates_list = result.candidates
    }
  },
    ((error: HttpErrorResponse) => {
      if (error.status == 419) {
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))
  }

  // ngOnDestroy() : void {
  //   clearInterval(this.loop);
  // }

  updateCandidateDetails(candidateDetails:any){
    this.dialog.open(EditCandidateComponent,{
      minWidth: '60%',
      maxHeight: '60%',
      data: candidateDetails,
    });
    console.log(candidateDetails);
  }
}
