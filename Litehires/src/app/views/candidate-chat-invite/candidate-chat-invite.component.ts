import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faPaperPlane, faXmark } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidate-chat-invite',
  templateUrl: './candidate-chat-invite.component.html',
  styleUrls: ['./candidate-chat-invite.component.scss']
})
export class CandidateChatInviteComponent implements OnInit {

  sendIcon = faPaperPlane;
  faArrowAltCircleLeft = faXmark;
  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";
  emailData = {
    subject: null,
    message: null
  }
  toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
  })
  scheduling = false
  sendEmail: any = FormGroup;
  constructor(public dialogRef: DialogRef,private fb: FormBuilder,private http: HttpClient ,@Inject(DIALOG_DATA) public candidate: any, private router: Router ) { }

  ngOnInit(): void {
    this.sendEmail = this.fb.group({
      subject: [''],
      message: ['']
    });
  }
  onSubmit(){
    this.scheduling = true
    const headers = new HttpHeaders()
        .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/sendChatUpdateEmail`, JSON.stringify({
        id:localStorage.getItem("user_id"),
        access_token:localStorage.getItem("access_token"),
        candidateId: this.candidate,
        subject: this.emailData.subject,
        content: this.emailData.message
      }),{
        headers: headers
      }).subscribe(async (result: any) => {
        this.scheduling = false
        await this.toast.fire({
          icon: 'success',
          title: 'Success',
          text: "Email Sent"
        })

        this.dialogRef.close();
      })
    }
}
