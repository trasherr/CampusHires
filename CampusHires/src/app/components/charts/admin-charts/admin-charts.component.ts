import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Chart }  from "chart.js";
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-admin-charts',
  templateUrl: './admin-charts.component.html',
  styleUrls: ['./admin-charts.component.scss']
})
export class AdminChartsComponent implements OnInit {
 
  public canvas : any;
  public ctx:any;
  public datasets: any;
  public data:any ;
  public myChartData: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  mainChart: any;
  greenChart: any;
  userChart: any;

  positionControl = new FormControl('positionControl');
  userControl = new FormControl('userControl');
  @Input() allPositions: any
  @Input() allUsers: any

  statusControl = new FormControl('statusControl');
  statusList: any; 
  selectedStatus:any;

  isVendor = 0;

  loop: any
  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";


  monthsNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

  //main chart
  mainChartLabels = ['']
  mainChartData : any

  vendorChart: any
  vendorC: any

  //hired chart
  hiredChartLabels = ['']
  hiredChartData = [0]

  //User chart
  userChartLabels = ['']
  userChartIds = [0]
  userChartData = [0]

  //position chart
  positionChartLabels = ['']
  positionChartData = [0]

  //current position
  sumHiredCandidates = 0

  candidates : any

  duration = 1

  constructor(private http: HttpClient, private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  

  ngOnInit(): void {
    //poping initial values
    this.statusList = ['APPLIED', 'FEEDBACK', 'INTERVIEW', 'OFFER', 'DISQUALIFIED', 'HIRED'];

    this.mainChartLabels.pop()
    this.hiredChartData.pop()
    this.hiredChartLabels.pop()
    this.userChartData.pop()
    this.userChartLabels.pop()
    this.userChartIds.pop()

    let loop = setInterval( ()=>{
      if(this.allPositions){
        this.positionControl.setValue(this.allPositions.map((a:any) => a.id))
        this.userControl.setValue(this.allUsers.map((a:any) => a.id))
        this.statusControl.setValue(this.statusList)
        this.fetchCharts()
        clearInterval(loop)
      }
     
    }, 500)
    
    
  }

  fetchCharts(){
    this.selectedStatus = this.statusControl.value
     //=======================

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/getPositionData`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), positionId: this.positionControl.value, userId: this.userControl.value  }), {
      headers: headers
    }).subscribe((result: any) => {
    
      this.candidates = result
      this.processChart()

    })
  }

  setVendor(){
    if(this.isVendor == 1){
      this.userControl.setValue(this.allUsers.map((a:any) => { if(a.isVendorApproved) return a.id } ))
    }
    else{
      this.userControl.setValue(this.allUsers.map((a:any) => a.id ))
    }
    this.fetchCharts()
  }


  processChart(){

    this.mainChartData = { 'applied': [], 'feedback': [], 'interview': [], 'offer': [], 'disqualified': [], 'hired': []  }
    this.vendorChart = { 'applied': [], 'feedback': [], 'interview': [], 'offer': [], 'disqualified': [], 'hired': []  }

    this.mainChartLabels = []
    this.hiredChartData = []
    this.hiredChartLabels = []
    this.userChartData = []
    this.userChartLabels = []
    this.userChartIds = []

    if (this.duration == 12){
      // initializing Data for a particular position
      let empty = [0,0,0,0,0,0,0,0,0,0,0,0]

      // var tempData = [0,0,0,0,0,0,0,0,0,0,0,0]
      let tempDataHired:any = Object.assign([], empty)

      //==============================================

      // get data for all the positions

      let t:any = { 'applied': Object.assign([], empty), 'feedback': Object.assign([], empty), 'interview': Object.assign([], empty), 'offer': Object.assign([], empty), 'disqualified': Object.assign([], empty), 'hired': Object.assign([], empty)  }
      let l:any = { 'applied': Object.assign([], empty), 'feedback': Object.assign([], empty), 'interview': Object.assign([], empty), 'offer': Object.assign([], empty), 'disqualified': Object.assign([], empty), 'hired': Object.assign([], empty)  }

        Object.keys(this.candidates).forEach( (val) => {
          
          // t['applied'][new Date(this.candidates[val].createdAt).getMonth()] += 1

          Object.keys(this.candidates[val].status_changes).forEach( (value) => {
            
            switch(this.candidates[val].status_changes[value].newStatus){
              case "APPLIED" :
                t['applied'][new Date(this.candidates[val].status_changes[value].createdAt).getMonth()] += 1
                break;
              case "FEEDBACK":
                t['feedback'][new Date(this.candidates[val].status_changes[value].createdAt).getMonth()] += 1
                break;
              case "INTERVIEW":
                t['interview'][new Date(this.candidates[val].status_changes[value].createdAt).getMonth()] += 1
                break;
              case "OFFER":
                t['offer'][new Date(this.candidates[val].status_changes[value].createdAt).getMonth()] += 1
                break;
              case "DISQUALIFIED":
                t['disqualified'][new Date(this.candidates[val].status_changes[value].createdAt).getMonth()] += 1
                break;
              case "HIRED":
                t['hired'][new Date(this.candidates[val].status_changes[value].createdAt).getMonth()] += 1
                break;
            }

            if(this.candidates[val].user.position_users.some( (item:any) => item.role.slug == "LITEHIRES-VENDOR" )){
              switch(this.candidates[val].status_changes[value].newStatus){
                case "APPLIED" :
                  l['applied'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "FEEDBACK":
                  l['feedback'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "INTERVIEW":
                  l['interview'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "OFFER":
                  l['offer'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "DISQUALIFIED":
                  l['disqualified'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "HIRED":
                  l['hired'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
              }
            }

          })

          if(this.candidates[val].status == "HIRED")
            tempDataHired[new Date(this.candidates[val].updatedAt).getMonth()] += 1

          if(this.userChartIds.includes(this.candidates[val].user.id) ){
            this.userChartData[this.userChartIds.indexOf(this.candidates[val].user.id)] += 1
          }
          else{          
            // if(this.candidates[val].user.position_users.some( (item:any) => item.role.slug == "LITEHIRES-VENDOR" )){
            //   if(this.userChartIds.includes(0)){
            //     this.userChartData[this.userChartIds.indexOf(0)] += 1
            //   }
            //   else{
            //     this.userChartIds.push(0)
            //     this.userChartLabels.push('CampusHires')
            //     this.userChartData.push(1)
            //   }
            
            // }
            // else{
              this.userChartLabels.push(`${this.candidates[val].user.first_name} ${this.candidates[val].user.last_name}`)
              this.userChartData.push(1)
              this.userChartIds.push(this.candidates[val].user.id)
            }
          // }
        })

        for(var i = 11 ; i >= 0 ; i--){
          let createdAt = new Date()
          var monthNum = new Date(createdAt.getFullYear(),createdAt.getMonth()-i,createdAt.getDay())

          //hired chart
          this.hiredChartLabels.push(this.monthsNames[monthNum.getMonth()])
          this.hiredChartData.push(tempDataHired[monthNum.getMonth()])

          //bigChart
          this.mainChartLabels.push(this.monthsNames[monthNum.getMonth()])
          this.mainChartData['applied'].push(t['applied'][monthNum.getMonth()])
          this.mainChartData['feedback'].push(t['feedback'][monthNum.getMonth()])
          this.mainChartData['interview'].push(t['interview'][monthNum.getMonth()])
          this.mainChartData['offer'].push(t['offer'][monthNum.getMonth()])
          this.mainChartData['disqualified'].push(t['disqualified'][monthNum.getMonth()])
          this.mainChartData['hired'].push(t['hired'][monthNum.getMonth()])

          this.vendorChart['applied'].push(l['applied'][monthNum.getDate()-1])
          this.vendorChart['feedback'].push(l['feedback'][monthNum.getDate()-1])
          this.vendorChart['interview'].push(l['interview'][monthNum.getDate()-1])
          this.vendorChart['offer'].push(l['offer'][monthNum.getDate()-1])
          this.vendorChart['disqualified'].push(l['disqualified'][monthNum.getDate()-1])
          this.vendorChart['hired'].push(l['hired'][monthNum.getDate()-1])

        }
        this.sumHiredCandidates = this.hiredChartData.reduce((r,c) => {
          return r+c;
        },0)

    }

    else if(this.duration == 1){

      let empty = []
      for(let i = 0 ; i < 31 ; i++)
        empty.push(0)
      let tempDataHired: any = Object.assign([], empty)

      //==============================================

      // get data for all the positions

      let t:any = { 'applied': Object.assign([], empty), 'feedback': Object.assign([], empty), 'interview': Object.assign([], empty), 'offer': Object.assign([], empty), 'disqualified': Object.assign([], empty), 'hired': Object.assign([], empty)  }
      let l:any = { 'applied': Object.assign([], empty), 'feedback': Object.assign([], empty), 'interview': Object.assign([], empty), 'offer': Object.assign([], empty), 'disqualified': Object.assign([], empty), 'hired': Object.assign([], empty)  }

      let now = new Date()
        Object.keys(this.candidates).forEach( (val) => {
          
          // t['applied'][new Date(this.candidates[val].createdAt).getDate()-1] += 1

          Object.keys(this.candidates[val].status_changes).forEach( (value) => {

            
            if(new Date(this.candidates[val].status_changes[value].createdAt) > new Date(now.getFullYear(),now.getMonth()-1,now.getDate()) ){
              switch(this.candidates[val].status_changes[value].newStatus){
                case "APPLIED" :
                  t['applied'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "FEEDBACK":
                  t['feedback'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "INTERVIEW":
                  t['interview'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "OFFER":
                  t['offer'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "DISQUALIFIED":
                  t['disqualified'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
                case "HIRED":
                  t['hired'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                  break;
              }

              if(this.candidates[val].user.position_users.some( (item:any) => item.role.slug == "LITEHIRES-VENDOR" )){
                switch(this.candidates[val].status_changes[value].newStatus){
                  case "APPLIED" :
                    l['applied'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                    break;
                  case "FEEDBACK":
                    l['feedback'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                    break;
                  case "INTERVIEW":
                    l['interview'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                    break;
                  case "OFFER":
                    l['offer'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                    break;
                  case "DISQUALIFIED":
                    l['disqualified'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                    break;
                  case "HIRED":
                    l['hired'][new Date(this.candidates[val].status_changes[value].createdAt).getDate()-1] += 1
                    break;
                }
              }
            }
          })
          
          if(this.candidates[val].status == "HIRED")
            tempDataHired[new Date(this.candidates[val].updatedAt).getDate()-1] += 1

          if(this.userChartIds.includes(this.candidates[val].user.id) ){
            this.userChartData[this.userChartIds.indexOf(this.candidates[val].user.id)] += 1
          }
          else{          
            // if(this.candidates[val].user.position_users.some( (item:any) => item.role.slug == "LITEHIRES-VENDOR" )){
            //   if(this.userChartIds.includes(0)){
            //     this.userChartData[this.userChartIds.indexOf(0)] += 1
            //   }
            //   else{
            //     this.userChartIds.push(0)
            //     this.userChartLabels.push('CampusHires')
            //     this.userChartData.push(1)
            //   }
            
            // }
            // else{
              this.userChartLabels.push(`${this.candidates[val].user.first_name} ${this.candidates[val].user.last_name}`)
              this.userChartData.push(1)
              this.userChartIds.push(this.candidates[val].user.id)
            // }
          }
        })
        console.log(t);


        for(var i = 30 ; i >= 0 ; i--){
          let createdAt = new Date()
          var monthNum = new Date(createdAt.getFullYear(),createdAt.getMonth(),createdAt.getDate()-i)

          //hired chart
          this.hiredChartLabels.push(`${monthNum.getDate()}/${monthNum.getMonth()+1}`)
          this.hiredChartData.push(tempDataHired[monthNum.getDate()-1])

          //bigChart
          this.mainChartLabels.push(`${monthNum.getDate()}/${monthNum.getMonth()+1}`)
          this.mainChartData['applied'].push(t['applied'][monthNum.getDate()-1])
          this.mainChartData['feedback'].push(t['feedback'][monthNum.getDate()-1])
          this.mainChartData['interview'].push(t['interview'][monthNum.getDate()-1])
          this.mainChartData['offer'].push(t['offer'][monthNum.getDate()-1])
          this.mainChartData['disqualified'].push(t['disqualified'][monthNum.getDate()-1])
          this.mainChartData['hired'].push(t['hired'][monthNum.getDate()-1])

          this.vendorChart['applied'].push(l['applied'][monthNum.getDate()-1])
          this.vendorChart['feedback'].push(l['feedback'][monthNum.getDate()-1])
          this.vendorChart['interview'].push(l['interview'][monthNum.getDate()-1])
          this.vendorChart['offer'].push(l['offer'][monthNum.getDate()-1])
          this.vendorChart['disqualified'].push(l['disqualified'][monthNum.getDate()-1])
          this.vendorChart['hired'].push(l['hired'][monthNum.getDate()-1])

        }

        this.sumHiredCandidates = this.hiredChartData.reduce((r,c) => {
          return r+c;
        },0)

      }
      if(this.mainChart == undefined)
      this.makeCharts()
      else
      this.updateOptions()
  }

  changeStatusCharts(){
    this.selectedStatus = this.statusControl.value
    this.updateOptions()
    // this.makeCharts()
  }

  makeCharts(){
    var gradientChartOptionsConfigurationWithTooltipRed: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 10,
            suggestedMax: 30,
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(233,32,16,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9a9a9a"
          }
        }]
      }
    };

    var gradientChartOptionsConfigurationWithTooltipGreen: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.0)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 10,
            suggestedMax: 30,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: 'rgba(0,242,195,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };


    var gradientBarChartConfiguration: any = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },

      tooltips: {
        backgroundColor: '#f5f5f5',
        titleFontColor: '#333',
        bodyFontColor: '#666',
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest"
      },
      responsive: true,
      scales: {
        yAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            suggestedMin: 10,
            suggestedMax: 30,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }],

        xAxes: [{

          gridLines: {
            drawBorder: false,
            color: 'rgba(29,140,248,0.1)',
            zeroLineColor: "transparent",
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }]
      }
    };

    this.canvas = document.getElementById("chartLineGreen");
    this.ctx = this.canvas.getContext("2d");

    var gradientStrokeGreen = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStrokeGreen.addColorStop(1, 'rgba(0,233,0,0.3)');
    gradientStrokeGreen.addColorStop(0.4, 'rgba(0,233,0,0)');
    gradientStrokeGreen.addColorStop(0, 'rgba(0,233,0,0)'); //green colors


    var data = {
      labels: this.hiredChartLabels,
      datasets: [{
        label: "Hired Candidates",
        fill: true,
        backgroundColor: gradientStrokeGreen,
        borderColor: '#00d6b4',
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: '#00d6b4',
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: '#00d6b4',
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 1,
        data: this.hiredChartData,
      }]
    };

    this.greenChart = new Chart(this.ctx, {
      type: 'line',
      data: data,
      options: gradientChartOptionsConfigurationWithTooltipGreen

    });


    var chart_labels = this.mainChartLabels;
    this.canvas = document.getElementById("chartBig1");
    this.ctx = this.canvas.getContext("2d");

    var gradientStrokeRed = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStrokeRed.addColorStop(1, 'rgba(233,32,16,0.3)');
    gradientStrokeRed.addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStrokeRed.addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    var gradientStrokeGreen = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStrokeGreen.addColorStop(1, 'rgba(0,233,0,0.3)');
    gradientStrokeGreen.addColorStop(0.4, 'rgba(0,233,0,0)');
    gradientStrokeGreen.addColorStop(0, 'rgba(0,233,0,0)'); //green colors


    var gradientStrokePurple = this.ctx.createLinearGradient(138,43,226, 50);

    gradientStrokePurple.addColorStop(1, 'rgba(138,43,226,0.2)');
    gradientStrokePurple.addColorStop(0.4, 'rgba(138,43,226,0.0)');
    gradientStrokePurple.addColorStop(0, 'rgba(138,43,226,0)'); //red colors


    var gradientStrokeBlue = this.ctx.createLinearGradient(0,0,205, 50);

    gradientStrokeBlue.addColorStop(1, 'rgba(0,0,205,0.2)');
    gradientStrokeBlue.addColorStop(0.4, 'rgba(0,0,205,0.0)');
    gradientStrokeBlue.addColorStop(0, 'rgba(0,0,205,0)'); //red colors


    var gradientStrokeOrange = this.ctx.createLinearGradient(255,165,0, 50);

    gradientStrokeOrange.addColorStop(1, 'rgba(255,165,0,0.2)');
    gradientStrokeOrange.addColorStop(0.4, 'rgba(255,165,0,0.0)');
    gradientStrokeOrange.addColorStop(0, 'rgba(255,165,0,0)'); //red colors


    var gradientStrokePink = this.ctx.createLinearGradient(221, 25, 149, 50);

    gradientStrokePink.addColorStop(1, 'rgba(221, 25, 149,0.2)');
    gradientStrokePink.addColorStop(0.4, 'rgba(221, 25, 149,0.0)');
    gradientStrokePink.addColorStop(0, 'rgba(221, 25, 149,0)'); //red colors

    var config = {
      type: 'line',
      data:
      {
        labels: chart_labels,
        datasets: [
          {
            label: "Applied",
            fill: true,
            backgroundColor: gradientStrokePink,
            borderColor: '#dd1995',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#dd1995',
            pointBorderColor: 'rgba(255,165,0,0)',
            pointHoverBackgroundColor: '#dd1995',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('APPLIED')) ? this.mainChartData['applied'] : [],
          },
          {
            label: "Feedback",
            fill: true,
            backgroundColor: gradientStrokeOrange,
            borderColor: '#FFA500',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#FFA500',
            pointBorderColor: 'rgba(255,165,0,0)',
            pointHoverBackgroundColor: '#FFA500',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('FEEDBACK')) ? this.mainChartData['feedback'] : [],
          },
          {
            label: "Interview",
            fill: true,
            backgroundColor: gradientStrokePurple,
            borderColor: '#8A2BE2',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#8A2BE2',
            pointBorderColor: 'rgba(138,43,226,0)',
            pointHoverBackgroundColor: '#8A2BE2',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('INTERVIEW')) ? this.mainChartData['interview'] : [],
          },
          {
            label: "Offer",
            fill: true,
            backgroundColor: gradientStrokeBlue,
            borderColor: '#0000CD',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#0000CD',
            pointBorderColor: 'rgba(0,0,205,0)',
            pointHoverBackgroundColor: '#0000CD',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('OFFER')) ? this.mainChartData['offer'] : [],
          },
          {
            label: "Disqualified",
            fill: true,
            backgroundColor: gradientStrokeRed,
            borderColor: '#ec250d',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ec250d',
            pointBorderColor: 'rgba(233,32,16,0)',
            pointHoverBackgroundColor: '#ec250d',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('DISQUALIFIED')) ? this.mainChartData['disqualified'] : [],
          },
          {
            label: "Hired",
            fill: true,
            backgroundColor: gradientStrokeGreen,
            borderColor: '#00e900d9',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#00e900d9',
            pointBorderColor: 'rgba(0,233,0,0)',
            pointHoverBackgroundColor: '#00e900d9',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('HIRED')) ? this.mainChartData['hired'] : [],
          }
        ]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.mainChart = new Chart(this.ctx, config);


    this.canvas = document.getElementById("chartBig2");
    this.ctx = this.canvas.getContext("2d");

    var config = {
      type: 'line',
      data:
      {
        labels: chart_labels,
        datasets: [
          {
            label: "Applied",
            fill: true,
            backgroundColor: gradientStrokePink,
            borderColor: '#dd1995',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#dd1995',
            pointBorderColor: 'rgba(255,165,0,0)',
            pointHoverBackgroundColor: '#dd1995',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('APPLIED')) ? this.vendorChart['applied'] : [],
          },
          {
            label: "Feedback",
            fill: true,
            backgroundColor: gradientStrokeOrange,
            borderColor: '#FFA500',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#FFA500',
            pointBorderColor: 'rgba(255,165,0,0)',
            pointHoverBackgroundColor: '#FFA500',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('FEEDBACK')) ? this.vendorChart['feedback'] : [],
          },
          {
            label: "Interview",
            fill: true,
            backgroundColor: gradientStrokePurple,
            borderColor: '#8A2BE2',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#8A2BE2',
            pointBorderColor: 'rgba(138,43,226,0)',
            pointHoverBackgroundColor: '#8A2BE2',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('INTERVIEW')) ? this.vendorChart['interview'] : [],
          },
          {
            label: "Offer",
            fill: true,
            backgroundColor: gradientStrokeBlue,
            borderColor: '#0000CD',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#0000CD',
            pointBorderColor: 'rgba(0,0,205,0)',
            pointHoverBackgroundColor: '#0000CD',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('OFFER')) ? this.vendorChart['offer'] : [],
          },
          {
            label: "Disqualified",
            fill: true,
            backgroundColor: gradientStrokeRed,
            borderColor: '#ec250d',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#ec250d',
            pointBorderColor: 'rgba(233,32,16,0)',
            pointHoverBackgroundColor: '#ec250d',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('DISQUALIFIED')) ? this.vendorChart['disqualified'] : [],
          },
          {
            label: "Hired",
            fill: true,
            backgroundColor: gradientStrokeGreen,
            borderColor: '#00e900d9',
            borderWidth: 2,
            borderDash: [],
            borderDashOffset: 0.0,
            pointBackgroundColor: '#00e900d9',
            pointBorderColor: 'rgba(0,233,0,0)',
            pointHoverBackgroundColor: '#00e900d9',
            pointBorderWidth: 20,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 15,
            pointRadius: 1,
            data: (this.selectedStatus.includes('HIRED')) ? this.vendorChart['hired'] : [],
          }
        ]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.vendorC = new Chart(this.ctx, config);


    this.canvas = document.getElementById("CountryChart");
    this.ctx  = this.canvas.getContext("2d");

    var gradientStrokePurple = this.ctx.createLinearGradient(138,43,226, 50);

    gradientStrokePurple.addColorStop(1, 'rgba(138,43,226,0.2)');
    gradientStrokePurple.addColorStop(0.4, 'rgba(138,43,226,0.0)');
    gradientStrokePurple.addColorStop(0, 'rgba(138,43,226,0)'); //red colors


    this.userChart = new Chart(this.ctx, {
      type: 'bar',
      data: {
        labels: this.userChartLabels,
        datasets: [{
          label: "Candidates Uploaded",
          fill: true,
          backgroundColor: gradientStrokePurple,
          hoverBackgroundColor: gradientStrokePurple,
          borderColor: '#8A2BE2',
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: this.userChartData,
        }]
      },
      options: gradientBarChartConfiguration
    });
  }
  public updateOptions() {
    this.greenChart.data.datasets[0].data = this.hiredChartData;
    this.greenChart.data.labels = this.hiredChartLabels;
    this.greenChart.update();

    this.mainChart.data.labels = this.mainChartLabels;
    this.mainChart.data.datasets[0].data = (this.selectedStatus.includes('APPLIED')) ? this.mainChartData['applied'] : [];
    this.mainChart.data.datasets[1].data = (this.selectedStatus.includes('FEEDBACK')) ? this.mainChartData['feedback'] : [];
    this.mainChart.data.datasets[2].data = (this.selectedStatus.includes('INTERVIEW')) ? this.mainChartData['interview'] : [];
    this.mainChart.data.datasets[3].data = (this.selectedStatus.includes('OFFER')) ? this.mainChartData['offer'] : [];
    this.mainChart.data.datasets[4].data = (this.selectedStatus.includes('DISQUALIFIED')) ? this.mainChartData['disqualified'] : [];
    this.mainChart.data.datasets[5].data = (this.selectedStatus.includes('HIRED')) ? this.mainChartData['hired'] : [];
    this.mainChart.update();

    this.vendorC.data.labels = this.mainChartLabels;
    this.vendorC.data.datasets[0].data = (this.selectedStatus.includes('APPLIED')) ? this.vendorChart['applied'] : [];
    this.vendorC.data.datasets[1].data = (this.selectedStatus.includes('FEEDBACK')) ? this.vendorChart['feedback'] : [];
    this.vendorC.data.datasets[2].data = (this.selectedStatus.includes('INTERVIEW')) ? this.vendorChart['interview'] : [];
    this.vendorC.data.datasets[3].data = (this.selectedStatus.includes('OFFER')) ? this.vendorChart['offer'] : [];
    this.vendorC.data.datasets[4].data = (this.selectedStatus.includes('DISQUALIFIED')) ? this.vendorChart['disqualified'] : [];
    this.vendorC.data.datasets[5].data = (this.selectedStatus.includes('HIRED')) ? this.vendorChart['hired'] : [];
    this.vendorC.update();

    this.userChart.data.datasets[0].data = this.userChartData;
    this.userChart.data.labels = this.userChartLabels;
    this.userChart.update();
  }
}
