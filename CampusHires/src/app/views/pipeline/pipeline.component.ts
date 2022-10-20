import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Dialog } from '@angular/cdk/dialog';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CandidateDetailsComponent } from '../candidate-details/candidate-details.component';
import { LoadingService } from 'src/app/services/loading.service';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { EditPositionComponent } from '../positions/edit-position/edit-position.component';
import Swal from 'sweetalert2';
import { PipelineServiceService } from 'src/app/services/pipeline/pipeline-service.service';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.scss']
})

export class PipelineComponent implements OnInit {

  faEllipsis =faEllipsis;
  applied = ["NONE"]
  feedback = ["NONE"]
  interview = ["NONE"]
  offer = ["NONE"]
  disqualified = ["NONE"]
  hired = ["NONE"]

  cdkList = {
    0: "APPLIED",
    1:"FEEDBACK",
    2:"INTERVIEW",
    3:"OFFER",
    4:"DISQUALIFIED",
    5:"HIRED"
  }

  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  })

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";

  cardDisable = false;

  user: any;
  positionId:number = Number(this.route.snapshot.paramMap.get('id'));
  position: any
  role : any = undefined

  socket: any;

  constructor(private http: HttpClient, private router:Router, private route:ActivatedRoute, public dialog: Dialog, private loader: LoadingService,private socketService: PipelineServiceService) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {

    this.socket = this.socketService.getSocketConnection();
    let reconnect: any = null;

    this.socket.on('disconnect',() => {
        reconnect = setInterval( ()=> {

          this.socketService.setupSocketConnection();
          this.socket = this.socketService.getSocketConnection();
          
        this.toast.fire({
          icon: 'error',
          title: 'Reconnecting'
        })
          
        },4000 )
      });

    this.socket.on('connect',() => {

      
      if(reconnect != null){
        clearInterval(reconnect);
        this.toast.fire({
          icon: 'success',
          title: 'Connected'
        })

        this.getCandidates();
      }

    });

    this.socket.on(`updatePipeline-${this.positionId}`,(data: any) => {
      this.cardDisable = false
    });


    this.applied.pop()
    this.feedback.pop()
    this.interview.pop()
    this.offer.pop()
    this.disqualified.pop()
    this.hired.pop()
    
    this.getCandidates()

  }

  getCandidates(){

    this.applied = []
    this.feedback = []
    this.interview = []
    this.offer = []
    this.disqualified = []
    this.hired = []

    this.loader.globalLoading(true)

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/position`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), positionId : this.positionId }), {
      headers: headers
    }).subscribe((result: any)  => {
      this.position  = result?.position ? result?.position : undefined;
      this.role = result?.role ? result?.role : undefined;
      console.log(this.role);
      
    })
    this.http.post(`${this.baseUrl}/${this.userType}/profile`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token")}), {
      headers: headers
    }).subscribe(result  => {
      this.user  = result
    })

    this.http.post(`${this.baseUrl}/${this.userType}/getCandidates`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), positionId : this.positionId }), {
      headers: headers
    }).subscribe(result  => {
      
      Object.entries(result).forEach(([key, value], index) => {
        value["position"] = this.position
        switch(value.status){
          case "APPLIED" :
            this.applied.push(value)
            break;
          case "FEEDBACK":
            this.feedback.push(value)
            break;
          case "INTERVIEW":
            this.interview.push(value)
            break;
          case "OFFER":
            this.offer.push(value)
            break;
          case "DISQUALIFIED":
            this.disqualified.push(value)
            break;
          case "HIRED":
            this.hired.push(value)
            break;
          default:
            this.applied.push(value)
            break;
        }

      });
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

  updatedStatus(event: CdkDragDrop<string[]>,status: any){

    this.cardDisable = true

    let  updatedCandidate:any = undefined;
    this.loader.globalLoading(true)

    let container:any = event.container.data
    console.log(status,container);
    
    Object.keys(container).forEach((value : any)=> {
      
      if(container[value].status != status){
        updatedCandidate = event.container.data[value]
        container[value].status = status
      }
    })

    // if(!updatedCandidate){
    //   this.loader.globalLoading(false)

    //   return;
    // }

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/updateCandidateStatus`, JSON.stringify({
        id:localStorage.getItem("user_id"),
        access_token:localStorage.getItem("access_token"),
        positionId : this.positionId,
        candidateId: updatedCandidate.id,
        status: status,
      }), {
      headers: headers
    }).subscribe((result:any) => {
      // if(result.status != status){
      //   this.toast.fire({
      //     icon: 'error',
      //     title: 'Reconnecting'
      //   })
  
      //   setTimeout(() => this.updatedStatus(event,status),500  )
      //   return ;
      // }
      
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


  updatePriority(event: CdkDragDrop<string[]>){
    this.cardDisable = true
    this.loader.globalLoading(true)

    var priorities = [0]
    priorities.pop()
    Object.entries(event.container.data).forEach((value : any)=> {
        priorities.push(value[1].id)

    })

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/updateCandidatePriority`, JSON.stringify({
      id:localStorage.getItem("user_id"),
      access_token:localStorage.getItem("access_token"),
      positionId : this.positionId,
      priorities:priorities
    }), {
    headers: headers
    }).subscribe(result => {
    this.loader.globalLoading(false)
    

    },
    ((error: HttpErrorResponse) => {
    this.loader.globalLoading(false)

    if(error.status == 419){
      localStorage.clear();
      this.router.navigate(['/login'])
    }
    }))
  }


  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      switch(Number(event.container.id.replace("cdk-drop-list-",""))%6){
        case 0:
          this.updatedStatus(event,"APPLIED");
          break;
        case 1:
          this.updatedStatus(event,"FEEDBACK");
          break;
        case 2:
          this.updatedStatus(event,"INTERVIEW");
          break;
        case 3:
          this.updatedStatus(event,"OFFER");
          break;
        case 4:
          this.updatedStatus(event,"DISQUALIFIED");
          break;
        case 5:
          this.updatedStatus(event,"HIRED");
          break;
        default:
          this.toast.fire({
            icon: 'error',
            title: 'Reconnecting'
          })
    
          this.ngOnInit()

      }
    }
    this.updatePriority(event)

  }

  openDetailView(candidateDetails:any){
    this.dialog.open(CandidateDetailsComponent,{
      minWidth: '100%',
      minHeight: '100vh',
      data: candidateDetails,
    });
  }
  openEditDialog(position:any){
    this.dialog.open(EditPositionComponent,{
      minWidth: '60%',
      maxHeight: '60%',
      data: position,
    });
  }

}
