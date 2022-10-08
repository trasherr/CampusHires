import { Component, OnInit } from '@angular/core';
import { PipelineServiceService } from 'src/app/services/pipeline/pipeline-service.service';

@Component({
  selector: 'app-litehires-dashboard',
  templateUrl: './litehires-dashboard.component.html',
  styleUrls: ['./litehires-dashboard.component.scss']
})
export class LitehiresDashboardComponent implements OnInit {
  public sidebarColor: string = "red";

  constructor(private socketService: PipelineServiceService) {}
  changeSidebarColor(color:any){
    var sidebar = document.getElementsByClassName('sidebar')[0];
    var mainPanel = document.getElementsByClassName('main-panel')[0];

    this.sidebarColor = color;

    if(sidebar != undefined){
        sidebar.setAttribute('data',color);
    }
    if(mainPanel != undefined){
        mainPanel.setAttribute('data',color);
    }
  }
  changeDashboardColor(color:any){
    var body = document.getElementsByTagName('body')[0];
    if (body && color === 'white-content') {
        body.classList.add(color);
    }
    else if(body.classList.contains('white-content')) {
      body.classList.remove('white-content');
    }
  }
  ngOnInit() {
    this.socketService.setupSocketConnection();
  }

}
