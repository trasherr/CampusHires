import { Component, Inject, Input, OnInit } from '@angular/core';
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faArrowCircleRight,faPaperclip, faDownload } from "@fortawesome/free-solid-svg-icons";
import { ActivatedRoute  } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DOCUMENT } from '@angular/common';
import { UploadChatDocsComponent } from 'src/app/components/uploads/upload-chat-docs/upload-chat-docs.component';
import { Dialog } from '@angular/cdk/dialog';
import { FileDownloadServiceService } from 'src/app/services/file-download-service.service';

@Component({
  selector: 'app-candidate-users-chat',
  templateUrl: './candidate-users-chat.component.html',
  styleUrls: ['./candidate-users-chat.component.scss']
})
export class CandidateUsersChatComponent implements OnInit {


  attachIcon = faPaperclip;
  faArrow = faArrowCircleRight;
  sendIcon = faPaperPlane;
  downloadFileIcon = faDownload
  baseUrl = environment.BASE_URL;

  // userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  // dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  chat:any[any];
  userId = localStorage.getItem("user_id");
  loop:any;
  room = this.route.snapshot.paramMap.get('room');

  @Input() cid = 0;
  @Input() pid = 0

  constructor(private downloads: FileDownloadServiceService,@Inject(DOCUMENT) private document: Document, private http: HttpClient, private route:ActivatedRoute, public dialog: Dialog) { }

  ngOnInit(): void {
    if (this.cid != 0 && this.pid != 0){

      const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

        this.http.post(`${this.baseUrl}/user/getRoom`, JSON.stringify({
          id: localStorage.getItem("user_id"),
          access_token: localStorage.getItem("access_token"),
          candidateId : this.cid,
          positionId: this.pid
        }), {
          headers: headers
        }).subscribe((result: any) => {
          this.room = result?.room

          if(this.room){
            this.getChat()
            this.loop = setInterval(() => {
              this.getChat()

            },5000)
          }
        })

    }
    else{
      this.getChat()

      this.loop = setInterval(() => {
        this.getChat()

      },5000)

    }
  }


  getChat(){
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    if(this.cid != 0 && this.pid != 0){
      this.http.post(`${this.baseUrl}/user/getCandidateChat`, JSON.stringify({
        candidateId : this.cid,
        positionId : this.pid,
        id: localStorage.getItem("user_id"),
        access_token: localStorage.getItem("access_token")
      }), {
        headers: headers
      }).subscribe(result => {
        this.chat = result
        this.chatScrollBottom()
      })
      return ;
    }


    this.http.post(`${this.baseUrl}/home/getCandidateChat`, JSON.stringify({
      room : this.room
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

    if(this.cid != 0 && this.pid != 0){
      this.http.post(`${this.baseUrl}/user/sendCandidateChat`, JSON.stringify({
        candidateId : this.cid,
        positionId : this.pid,
        id: localStorage.getItem("user_id"),
        access_token: localStorage.getItem("access_token"),
        content:message
      }), {
      headers: headers
      }).subscribe(result => {
        this.chat = result
        this.chatScrollBottom()
        let chatBox: any = this.document.getElementById('message-box')
        chatBox.value = "";
      })
      return ;

    }

    this.http.post(`${this.baseUrl}/home/sendCandidateChat`, JSON.stringify({
      room : this.room,
      isCandidate: (this.cid)? false : true ,
      content:message
    }), {
    headers: headers
    }).subscribe(result => {
      this.chat = result,
      this.chatScrollBottom()
      let chatBox: any = this.document.getElementById('message-box')
      chatBox.value = "";
    })
  }

  ngOnDestroy() : void {
    clearInterval(this.loop);
  }

  uploadFile(){
    this.dialog.open(UploadChatDocsComponent,{
      maxHeight: '60%',
      data: {room: this.room},
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
