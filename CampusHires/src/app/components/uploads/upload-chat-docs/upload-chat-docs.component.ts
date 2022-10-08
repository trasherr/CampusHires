import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateChatDocsServiceService } from 'src/app/services/candidate-chat-docs-service.service';
import { faArrowLeft, faPencil } from '@fortawesome/free-solid-svg-icons';
import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { ChatDocsServiceService } from 'src/app/services/chat-docs-service.service';

@Component({
  selector: 'app-upload-chat-docs',
  templateUrl: './upload-chat-docs.component.html',
  styleUrls: ['./upload-chat-docs.component.scss']
})
export class UploadChatDocsComponent implements OnInit {

  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";
  faArrowAltCircleLeft = faArrowLeft;
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  constructor( private route:ActivatedRoute, public dialogRef: DialogRef,@Inject(DIALOG_DATA) public data: any,private uploadService: CandidateChatDocsServiceService,private uploadInternal: ChatDocsServiceService, private router: Router ) { 
    
  }
  ngOnInit(): void { }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0); //edit here for multiple file support
      if (file) {
        this.currentFile = file;
        let uploader;
        // console.log(this.isCandidateRoom);
        
        if (this.data?.candidateId){
         uploader  = this.uploadInternal;
        }
        else{
          uploader = this.uploadService
        }
        
        uploader.upload(this.currentFile,(this.data?.candidateId) ? this.data.candidateId+"" : this.data.room).subscribe(
          (event: any) => {

            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              if(this.progress == 100){
                this.fireToast(true);
                setTimeout(() => {
                  // this.router.navigate(['/'+this.dashUrl+'/pipeline',this.positionId])
                  this.dialogRef.close();
                })
              }
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;

            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }
            this.currentFile = undefined;
          });
      }
      this.selectedFiles = undefined;
    }
  }

  fireToast(c:boolean){
    Swal.mixin({
      toast: true,
      position: 'top-right',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    }).fire(
      c? "success":"error",
      c? "Success":"Error"
    )
  }

}
