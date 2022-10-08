import { Component, OnInit, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';
import { Dialog } from '@angular/cdk/dialog';
import { faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons';
import { SetInterviewComponent } from '../set-interview/set-interview.component';
import { EditCandidateComponent } from '../edit-candidate/edit-candidate.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate-details',
  templateUrl: './candidate-details.component.html',
  styleUrls: ['./candidate-details.component.scss']
})
export class CandidateDetailsComponent implements OnInit {

  faArrowAltCircleLeft = faArrowLeft;
  faPencil = faPencil;
  userChat = "user";
  constructor(public dialogRef: DialogRef, @Inject(DIALOG_DATA) public candidateData: any, public dialog: Dialog, private router: Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

   }

  ngOnInit(): void {
    console.log(this.candidateData);
    
  }

  setAnInterview(candidateDetails:any){
    this.dialog.open(SetInterviewComponent,{
      minWidth: '60%',
      minHeight: '60%',
      data: candidateDetails,
    });
    console.log(candidateDetails);
  }
  updateCandidateDetails(candidateDetails:any){
    this.dialog.open(EditCandidateComponent,{
      minWidth: '60%',
      maxHeight: '60%',
      data: candidateDetails,
    });
    console.log(candidateDetails);
  }
}
