import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.scss']
})
export class ResumeComponent implements OnInit {

  @Input() pdfSrc = "";
  safeUrl : any;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    this.safeUrl = `${environment.BASE_URL}/resume/${this.pdfSrc}`
  }
}
