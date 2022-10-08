import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { ImgServiceService } from 'src/app/services/img-service.service';

@Component({
  selector: 'app-upload-img',
  templateUrl: './upload-img.component.html',
  styleUrls: ['./upload-img.component.scss']
})
export class UploadImgComponent implements OnInit {

  @Output() imgData = new EventEmitter<string>();

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;
  constructor(private uploadService: ImgServiceService) { }
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
        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              if(this.progress == 100){
                
                
                this.fireToast(true);
              }
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              try{
                this.imgData.emit(event.body.res)
              }
              catch(e){

              }

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
