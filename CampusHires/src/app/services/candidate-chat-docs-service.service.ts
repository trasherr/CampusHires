import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidateChatDocsServiceService {
  private baseUrl = environment.BASE_URL;
  verify = localStorage.getItem("access_token")

  constructor(private http: HttpClient) { }
  upload(file: File,room:String): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append('content', file);
    // if( this.tk != null){
      const header = new HttpHeaders();
      const req = new HttpRequest('POST', `${this.baseUrl}/upload/user/candidate-chat-docs-upload?room=${room}&verify=${this.verify}`, formData, {
        reportProgress: true,
        responseType: 'json',
        headers:header

      });
    return this.http.request(req);
  }

  getFiles(name:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/users/files/${name}`);
  }
  
}
