import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faBoltLightning,faClock, faEllipsis } from '@fortawesome/free-solid-svg-icons';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent implements OnInit {

  @Output() detailEvent = new EventEmitter();
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";

  faClock = faClock;
  faBolt = faBoltLightning;
  faEllipsis=faEllipsis;
  created: any;
  updated: any;


  @Input() candidate: any;

  baseUrl = environment.BASE_URL
  imgSrc = ""

  constructor() { }

  ngOnInit(): void {
    this.created = new Date(this.candidate.createdAt);
    this.updated = new Date(this.candidate.updatedAt);
    this.imgSrc = `${this.baseUrl}/images/user/dp/${this.candidate.user.img}`
    console.log(this.candidate.user);
    
    
  }

  dateTimeAgo(time:any){
    let daysDifference = 0;
    let hoursDifference = 0;
    let minutesDifference = 0;
    let secondDifference = 0;
    let monthsDifference = 0;
    let yearDifference = 0;
    let now  = new Date();
    yearDifference = Number(now.getFullYear()) - Number(time.getFullYear());
    monthsDifference = Number(now.getMonth()) - Number(time.getMonth());
    daysDifference = Number(now.getDate()) - Number(time.getDate());
    hoursDifference = Number(now.getHours()) - Number(time.getHours());
    minutesDifference = Number(now.getMinutes()) - Number(time.getMinutes());
    secondDifference = Number(now.getSeconds()) - Number(time.getSeconds());

    if(yearDifference>0){
      return String(yearDifference)+"Y";
    }else if(monthsDifference>0){
      return String(monthsDifference)+"M";
    }else if(daysDifference>0){
      return String(daysDifference)+"D";
    } else if (hoursDifference > 0){
      return String(hoursDifference)+"hr";
    } else if (minutesDifference > 0){
      return String(minutesDifference)+"min";
    }
    return String(secondDifference)+"sec";

  }
// candidate.createdAt | date:"dd/MM/YYYY hh:mm"
// candidate.updatedAt | date:"dd/MM/YYYY hh:mm"

  getRandomRgb(): string {
    var num = Math.floor(Math.random()*16777215).toString(16)
    return `#${num},`
  }

}
