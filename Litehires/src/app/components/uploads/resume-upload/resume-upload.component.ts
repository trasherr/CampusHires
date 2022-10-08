import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ResumeServiceService } from 'src/app/services/resume-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-resume-upload',
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.scss']
})
export class ResumeUploadComponent implements OnInit {

  @Input() candidate: string= "";
  @Input() positionId: Number|undefined;

  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  constructor(private uploadService: ResumeServiceService, private router: Router) { }
  ngOnInit(): void { }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }
  
  upload(): void {
    this.progress = 0;
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      if (file) {
        this.currentFile = file;
        this.uploadService.upload(this.currentFile,this.candidate).subscribe(
          (event: any) => {
            
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              if(this.progress == 100){
                this.fireToast(true);
                setTimeout(() => {
                  this.router.navigate(['/'+this.dashUrl+'/pipeline',this.positionId])
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
