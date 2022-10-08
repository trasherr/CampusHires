import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarOptions } from '@fullcalendar/angular'; // useful for typechecking
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})

export class CalendarComponent implements OnInit {
  Events: any[] = [];
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    // dateClick: this.onDateClick.bind(this),
    eventClick: this.onEventClick.bind(this),
    events: this.Events
  };

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";


  constructor(private http: HttpClient) {}

  // onDateClick(res: any) {
  //   console.log(res);
  //   alert('Clicked on date : ' + res.event);
  // }

   onEventClick(info: any) {
    info.el.classList
  }


  ngOnInit() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json');
      this.http.post(`${this.baseUrl}/${this.userType}/calendar`, JSON.stringify({ id: localStorage.getItem("user_id"), access_token: localStorage.getItem("access_token")}), {
        headers: headers
      }) .subscribe((res: any) => {
            console.log(res)
            this.Events = [];
            Object.entries(res.calendars).forEach((value: any) => {
              console.log(value);

              this.Events.push({
                title:value[1].name,
                // start:value[1].start.substring(0, 10),
                // end: value[1].end.substring(0, 10),

                start:value[1].start,
                end: value[1].end,

                // startTime: new Date(value[1].start).toTimeString().split(' ')[0],
                // endTime: new Date(value[1].end).toTimeString().split(' ')[0],
                color:['red','orange','yellow','green','blue','purple'][Math.random()*6|0]})
            })
            // this.Events = res.calendars
            this.calendarOptions.events = this.Events
            console.log(this.Events)
          });




    // setInterval(() => {
    //   return this.http.post(`${this.baseUrl}/${this.userType}/calendar`, JSON.stringify({ id: localStorage.getItem("user_id"), access_token: localStorage.getItem("access_token")}), {
    //   headers: headers
    // }) .subscribe((res: any) => {
    //       console.log(res)
    //       this.Events = res.events
    //       console.log(this.Events)
    //     });
    // }, 30000);
    // setTimeout(() => {
    //   this.calendarOptions = {
    //     initialView: 'dayGridMonth',
    //     dateClick: this.onDateClick.bind(this),
    //     events: this.Events,
    //   };
    // }, 2500);
  }

}
