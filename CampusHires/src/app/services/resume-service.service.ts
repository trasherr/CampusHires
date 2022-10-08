import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResumeServiceService {
  private baseUrl = environment.BASE_URL;
  tk = localStorage.getItem("access_token")

  constructor(private http: HttpClient) { }
  upload(file: File, candidate:string): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('resume', file);
    if( this.tk != null){
      const header = new HttpHeaders().set("auth",this.tk).set("candidate",candidate);
      const req = new HttpRequest('POST', `${this.baseUrl}/upload/user/resume-upload`, formData, {
        reportProgress: true,
        responseType: 'json',
        headers:header

      });
    return this.http.request(req);

    }
    else{
      const req = new HttpRequest('POST', `${this.baseUrl}/upload/user/resume-upload`, formData, {
        reportProgress: true,
        responseType: 'json'
      });
    return this.http.request(req);
    }
    
  }
  getFiles(name:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/resume/${name}`);
  }
}
