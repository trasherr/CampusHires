import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { environment } from 'src/environments/environment';
declare var JitsiMeetExternalAPI: any;

@Component({
  selector: 'app-jitsi-meeting',
  templateUrl: './jitsi-meeting.component.html',
  styleUrls: ['./jitsi-meeting.component.scss']
})
export class JitsiMeetingComponent implements OnInit {
  domain: string = "meet.jit.si"; // For self hosted use your domain
  room: any;
  options: any;
  api: any;
  user = "";

  // For Custom Controls
  isAudioMuted = false;
  isVideoMuted = false;

  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  constructor(
      private http: HttpClient,
      private router: Router,
      private route:ActivatedRoute,
      private loader: LoadingService
  ) { }

  ngOnInit(): void {

    this.room =  this.route.snapshot.paramMap.get('room'); // Set your room name
    if(!localStorage.getItem("access_token")){
        return;
    }

    this.loader.globalLoading(true)
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/profile`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token")  }), {
      headers: headers
    }).subscribe( (result: any) => {
        this.user = `${result.first_name} ${result.last_name}`
        this.initializeJitsi()
        this.loader.globalLoading(false)
    },
    (async (error: HttpErrorResponse) => {
    this.loader.globalLoading(false)
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))

      
  }

  initializeJitsi(): void {

    if(this.user){
        this.options = {
            roomName: this.room,
            height: 800,
            configOverwrite:  { 
                prejoinPageEnabled: false,
                startWithVideoMuted: true,
                startWithAudioMuted:true,
            },
            disableInviteFunctions: true,
            interfaceConfigOverwrite: {
                // overwrite interface properties
    
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: this.user,
            }
        }
        
    }
    else{

        this.options = {
            roomName: this.room,
            height: 800,
            configOverwrite: { 
                prejoinPageEnabled: false,
                startWithVideoMuted: true,
                startWithAudioMuted:true,
            },
            disableInviteFunctions: true,
            
            interfaceConfigOverwrite: {
                // overwrite interface properties
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'hangup',"chat" ,'profile', 'raisehand',
                    'videoquality'
                  ] // ok
    
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: "Participant",
            }
        }

    }
    

      this.api = new JitsiMeetExternalAPI(this.domain, this.options);

       // Event handlers
      this.api.addEventListeners({
          readyToClose: this.handleClose,
          participantLeft: this.handleParticipantLeft,
          participantJoined: this.handleParticipantJoined,
          videoConferenceJoined: this.handleVideoConferenceJoined,
          videoConferenceLeft: this.handleVideoConferenceLeft,
          audioMuteStatusChanged: this.handleMuteStatus,
          videoMuteStatusChanged: this.handleVideoStatus
      });
    }
    handleClose = () => {
      console.log("handleClose");
  }

  handleParticipantLeft = async (participant: any) => {
      console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
      const data = await this.getParticipants();
  }

  handleParticipantJoined = async (participant: any) => {
      console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
      const data = await this.getParticipants();
  }

  handleVideoConferenceJoined = async (participant: any) => {
      console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
      const data = await this.getParticipants();
  }

  handleVideoConferenceLeft = () => {
      console.log("handleVideoConferenceLeft");
      this.api.dispose();

      if(this.user){
      this.router.navigate([`/${this.dashUrl}/meetings`]);
        return;
      }
      this.router.navigate(['/']);
  }

  handleMuteStatus = (audio: any) => {
      console.log("handleMuteStatus", audio); // { muted: true }
  }

  handleVideoStatus = (video: any) => {
      console.log("handleVideoStatus", video); // { muted: true }
  }

  getParticipants() {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve(this.api.getParticipantsInfo()); // get all participants
          }, 500)
      });
  }

}
