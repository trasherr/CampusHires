import { Component, Inject, Input, OnInit } from '@angular/core';
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleRight, faPaperclip, faMailBulk, faDownload} from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { UploadChatDocsComponent } from 'src/app/components/uploads/upload-chat-docs/upload-chat-docs.component';
import { Dialog } from '@angular/cdk/dialog';
import { FileDownloadServiceService } from 'src/app/services/file-download-service.service';
import { CandidateChatInviteComponent } from '../candidate-chat-invite/candidate-chat-invite.component';

@Component({
  selector: 'app-candidate-chat',
  templateUrl: './candidate-chat.component.html',
  styleUrls: ['./candidate-chat.component.scss']
})
export class CandidateChatComponent implements OnInit {
  downloadFileIcon = faDownload
  faArrow = faArrowCircleRight;
  sendIcon = faPaperPlane;
  attachIcon = faPaperclip;
  mailIcon = faMailBulk
  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";
  chat:any[any];
  userId = localStorage.getItem("user_id");
  loop:any;

  chatLock = true
  chatCheck = true
  meeting : any
  enableMail = false

  @Input() candidateId = 0;
  @Input() positionId = 0;

  constructor(private downloads: FileDownloadServiceService,@Inject(DOCUMENT) private document: Document ,private http: HttpClient, private route:ActivatedRoute, public dialog: Dialog) { }

  ngOnInit(): void {

    if(this.userType == "admin"){
      this.getChat()
      this.chatCheck = false
      this.chatLock = false
    }
    else
      this.chatDisable()
  }

  chatDisable(){

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/meetingNoResponse`, JSON.stringify({
      id:localStorage.getItem("user_id"),
      access_token:localStorage.getItem("access_token"),
      candidateId: this.candidateId,
    }), {
      headers: headers
    }).subscribe( (result: any) => {
      console.log(result);

      if(result == null){
        this.chatLock = false
      }
      else{
        this.meeting = result
      }
      this.chatCheck = false
      if(!this.chatLock){
        this.getChat()
        this.loop = setInterval(() => {
          this.getChat()
        },5000)
      }
    })
  }

  getChat(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/getChat`, JSON.stringify({
      id:localStorage.getItem("user_id"),
      access_token:localStorage.getItem("access_token"),
      positionId : this.positionId,
      candidateId: this.candidateId,
    }), {
      headers: headers
    }).subscribe(result => {
      this.chat = result
      this.chatScrollBottom()
    })

  }

  chatScrollBottom(){
    let scroll_to_bottom: any = this.document.getElementById('chat-section');
		scroll_to_bottom.scrollTop = scroll_to_bottom.scrollHeight;
  }

  sendMessage(message:String){

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

      if(message != ""){
        this.http.post(`${this.baseUrl}/${this.userType}/sendChat`, JSON.stringify({
        id:localStorage.getItem("user_id"),
        access_token:localStorage.getItem("access_token"),
        positionId : this.positionId,
        candidateId: this.candidateId,
        content:message
        }), {
        headers: headers
        }).subscribe(result => {
          this.chat = result
          this.chatScrollBottom()
          let chatBox: any = this.document.getElementById('message-box')
          chatBox.value = "";
        })

        if(this.enableMail){
          this.http.post(`${this.baseUrl}/${this.userType}/sendChatUpdateEmail`, JSON.stringify({
            id:localStorage.getItem("user_id"),
            access_token:localStorage.getItem("access_token"),
            candidateId: this.candidateId,
            content: message
          }),{
            headers: headers
          }).subscribe(result => {
            this.chat = result
          })
        }
    } else{
      console.log("Empty message");
    }
  }

  ngOnDestroy() : void {
    clearInterval(this.loop);
  }

  meetingResponse(val: string){

    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/meetingResponse`, JSON.stringify({
    id:localStorage.getItem("user_id"),
    access_token:localStorage.getItem("access_token"),
    meetingId: this.meeting.id,
    response:val
    }), {
    headers: headers
    }).subscribe(result => {
      this.ngOnInit()
    })

  }

  uploadFile(){
    this.dialog.open(UploadChatDocsComponent,{
      maxHeight: '60%',
      data: { candidateId: this.candidateId},
    });
  }

  sendEmail(){
    this.dialog.open(CandidateChatInviteComponent,{
      maxHeight: '60%',
      data: this.candidateId,
    });
  }

  download(filename: String): void {
    this.downloads
      .download(`${this.baseUrl}/files/${filename}`)
      .subscribe(blob => {
        const a = document.createElement('a')
        const objectUrl = URL.createObjectURL(blob)
        a.href = objectUrl
        a.download = `${filename}`;
        a.click();
        URL.revokeObjectURL(objectUrl);
      })
  }
}
