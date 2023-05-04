import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Chart }  from "chart.js";

import {FormControl} from '@angular/forms';
// import { Y } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-user-charts',
  templateUrl: './user-charts.component.html',
  styleUrls: ['./user-charts.component.scss']
})
export class UserChartsComponent implements OnInit {

  public canvas : any;
  public ctx:any;
  public datasets: any;
  public data:any ;
  public myChartData: any;
  public clicked: boolean = true;
  public clicked1: boolean = false;
  public clicked2: boolean = false;
  mainChart: any;
  // greenChart: any;
  // userChart: any;

  userId = localStorage.getItem('user_id');


  positionControl = new FormControl('positionControl');
  @Input() allPositions: any

  // statusControl = new FormControl('statusControl');
  // statusList: any;
  // selectedStatus:any;

  trendsControl = new FormControl('trendsControl');
  trendsList: any =  [{ mid: '', title: '', type: ''}];
  selectedTrends: any;

  baseUrl = environment.BASE_URL
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "campusHiresDashboard" : "userDashboard";


  monthsNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']

  //main chart
  // mainChartLabels = ['']
  // mainChartData : any

  // //hired chart
  // hiredChartLabels = ['']
  // hiredChartData = [0]

  // //User chart
  // userChartLabels = ['']
  // userChartIds = [0]
  // userChartData = [0]

  // sumHiredCandidates = 0

  // candidates : any

  // duration = 1

  constructor(private http: HttpClient, private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }



  ngOnInit(): void {

    
    //poping initial values

    // this.mainChartLabels.pop()
    this.makeCharts()
  }

  // fetchCharts(){
  //   this.selectedStatus = this.statusControl.value
  //    //=======================

  //   const headers = new HttpHeaders()
  //   .set('Content-Type', 'application/json');

  //   this.http.post(`${this.baseUrl}/${this.userType}/getPositionData`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), positionId: this.positionControl.value  }), {
  //     headers: headers
  //   }).subscribe((result: any) => {

  //     this.candidates = result
  //     this.processChart()

  //   })
  // }


  // processChart(){
    

  //   this.makeCharts()
   
  // }

  // changeStatusCharts(){
  //   this.selectedStatus = this.statusControl.value
  //   this.updateOptions()
  // }

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

    // this.canvas = document.getElementById("chartLineGreen");
    // this.ctx = this.canvas.getContext("2d");

    // var gradientStrokeGreen = this.ctx.createLinearGradient(0, 230, 0, 50);

    // gradientStrokeGreen.addColorStop(1, 'rgba(0,233,0,0.3)');
    // gradientStrokeGreen.addColorStop(0.4, 'rgba(0,233,0,0)');
    // gradientStrokeGreen.addColorStop(0, 'rgba(0,233,0,0)'); //green colors


    // var data = {
    //   labels: this.hiredChartLabels,
    //   datasets: [{
    //     label: "Hired Candidates",
    //     fill: true,
    //     backgroundColor: gradientStrokeGreen,
    //     borderColor: '#00d6b4',
    //     borderWidth: 2,
    //     borderDash: [],
    //     borderDashOffset: 0.0,
    //     pointBackgroundColor: '#00d6b4',
    //     pointBorderColor: 'rgba(255,255,255,0)',
    //     pointHoverBackgroundColor: '#00d6b4',
    //     pointBorderWidth: 20,
    //     pointHoverRadius: 4,
    //     pointHoverBorderWidth: 15,
    //     pointRadius: 1,
    //     data: this.hiredChartData,
    //   }]
    // };

    // this.greenChart = new Chart(this.ctx, {
    //   type: 'line',
    //   data: data,
    //   options: gradientChartOptionsConfigurationWithTooltipGreen

    // });


    var chart_labels = ["No Data"];
    // var chart_labels = this.mainChartLabels;
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
            label: "Data 1",
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
            data: [0]
          },
          {
            label: "Data 2",
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
            data:  [0],
          },
          // {
          //   label: "Interview",
          //   fill: true,
          //   backgroundColor: gradientStrokePurple,
          //   borderColor: '#8A2BE2',
          //   borderWidth: 2,
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   pointBackgroundColor: '#8A2BE2',
          //   pointBorderColor: 'rgba(138,43,226,0)',
          //   pointHoverBackgroundColor: '#8A2BE2',
          //   pointBorderWidth: 20,
          //   pointHoverRadius: 4,
          //   pointHoverBorderWidth: 15,
          //   pointRadius: 1,
          //   data: (this.selectedStatus.includes('INTERVIEW')) ? this.mainChartData['interview'] : [],
          // },
          // {
          //   label: "Offer",
          //   fill: true,
          //   backgroundColor: gradientStrokeBlue,
          //   borderColor: '#0000CD',
          //   borderWidth: 2,
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   pointBackgroundColor: '#0000CD',
          //   pointBorderColor: 'rgba(0,0,205,0)',
          //   pointHoverBackgroundColor: '#0000CD',
          //   pointBorderWidth: 20,
          //   pointHoverRadius: 4,
          //   pointHoverBorderWidth: 15,
          //   pointRadius: 1,
          //   data: (this.selectedStatus.includes('OFFER')) ? this.mainChartData['offer'] : [],
          // },
          // {
          //   label: "Disqualified",
          //   fill: true,
          //   backgroundColor: gradientStrokeRed,
          //   borderColor: '#ec250d',
          //   borderWidth: 2,
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   pointBackgroundColor: '#ec250d',
          //   pointBorderColor: 'rgba(233,32,16,0)',
          //   pointHoverBackgroundColor: '#ec250d',
          //   pointBorderWidth: 20,
          //   pointHoverRadius: 4,
          //   pointHoverBorderWidth: 15,
          //   pointRadius: 1,
          //   data: (this.selectedStatus.includes('DISQUALIFIED')) ? this.mainChartData['disqualified'] : [],
          // },
          // {
          //   label: "Hired",
          //   fill: true,
          //   backgroundColor: gradientStrokeGreen,
          //   borderColor: '#00e900d9',
          //   borderWidth: 2,
          //   borderDash: [],
          //   borderDashOffset: 0.0,
          //   pointBackgroundColor: '#00e900d9',
          //   pointBorderColor: 'rgba(0,233,0,0)',
          //   pointHoverBackgroundColor: '#00e900d9',
          //   pointBorderWidth: 20,
          //   pointHoverRadius: 4,
          //   pointHoverBorderWidth: 15,
          //   pointRadius: 1,
          //   data: (this.selectedStatus.includes('HIRED')) ? this.mainChartData['hired'] : [],
          // }
        ]
      },
      options: gradientChartOptionsConfigurationWithTooltipRed
    };
    this.mainChart = new Chart(this.ctx, config);


    // this.canvas = document.getElementById("CountryChart");
    // this.ctx  = this.canvas.getContext("2d");

    // var gradientStrokePurple = this.ctx.createLinearGradient(138,43,226, 50);

    // gradientStrokePurple.addColorStop(1, 'rgba(138,43,226,0.2)');
    // gradientStrokePurple.addColorStop(0.4, 'rgba(138,43,226,0.0)');
    // gradientStrokePurple.addColorStop(0, 'rgba(138,43,226,0)'); //red colors


    // this.userChart = new Chart(this.ctx, {
    //   type: 'bar',
    //   data: {
    //     labels: this.userChartLabels,
    //     datasets: [{
    //       label: "Candidates Uploaded",
    //       fill: true,
    //       backgroundColor: gradientStrokePurple,
    //       hoverBackgroundColor: gradientStrokePurple,
    //       borderColor: '#8A2BE2',
    //       borderWidth: 2,
    //       borderDash: [],
    //       borderDashOffset: 0.0,
    //       data: this.userChartData,
    //     }]
    //   },
    //   options: gradientBarChartConfiguration
    // });
  }

  public updateOptions(update: any) {


    var gradientStroke = [] ;

    this.mainChart.data.datasets = []

    gradientStroke[0] = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke[0].addColorStop(1, 'rgba(233,32,16,0.3)');
    gradientStroke[0].addColorStop(0.4, 'rgba(233,32,16,0.0)');
    gradientStroke[0].addColorStop(0, 'rgba(233,32,16,0)'); //red colors

    gradientStroke[1] = this.ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke[1].addColorStop(1, 'rgba(0,233,0,0.3)');
    gradientStroke[1].addColorStop(0.4, 'rgba(0,233,0,0)');
    gradientStroke[1].addColorStop(0, 'rgba(0,233,0,0)'); //green colors


    gradientStroke[2] = this.ctx.createLinearGradient(138,43,226, 50);

    gradientStroke[2].addColorStop(1, 'rgba(138,43,226,0.2)');
    gradientStroke[2].addColorStop(0.4, 'rgba(138,43,226,0.0)');
    gradientStroke[2].addColorStop(0, 'rgba(138,43,226,0)'); //red colors


    gradientStroke[3] = this.ctx.createLinearGradient(0,0,205, 50);

    gradientStroke[3].addColorStop(1, 'rgba(0,0,205,0.2)');
    gradientStroke[3].addColorStop(0.4, 'rgba(0,0,205,0.0)');
    gradientStroke[3].addColorStop(0, 'rgba(0,0,205,0)'); //red colors


    gradientStroke[4] = this.ctx.createLinearGradient(255,165,0, 50);

    gradientStroke[4].addColorStop(1, 'rgba(255,165,0,0.2)');
    gradientStroke[4].addColorStop(0.4, 'rgba(255,165,0,0.0)');
    gradientStroke[4].addColorStop(0, 'rgba(255,165,0,0)'); //red colors


    gradientStroke[5] = this.ctx.createLinearGradient(221, 25, 149, 50);

    gradientStroke[4].addColorStop(1, 'rgba(221, 25, 149,0.2)');
    gradientStroke[4].addColorStop(0.4, 'rgba(221, 25, 149,0.0)');
    gradientStroke[4].addColorStop(0, 'rgba(221, 25, 149,0)'); //red colors



    let color = [{
      borderColor: '#dd1995',
      pointBackgroundColor: '#dd1995',
      pointBorderColor: 'rgba(255,165,0,0)',
      pointHoverBackgroundColor: '#dd1995',
    },
    {
      borderColor: '#FFA500',
      pointBackgroundColor: '#FFA500',
      pointBorderColor: 'rgba(255,165,0,0)',
      pointHoverBackgroundColor: '#FFA500',
    },
    {

      borderColor: '#8A2BE2',
      pointBackgroundColor: '#8A2BE2',
      pointBorderColor: 'rgba(138,43,226,0)',
      pointHoverBackgroundColor: '#8A2BE2',
    },
    {
      borderColor: '#0000CD',
      pointBackgroundColor: '#0000CD',
      pointBorderColor: 'rgba(0,0,205,0)',
      pointHoverBackgroundColor: '#0000CD',
    },
    {
      borderColor: '#ec250d',
      pointBackgroundColor: '#ec250d',
      pointBorderColor: 'rgba(233,32,16,0)',
      pointHoverBackgroundColor: '#ec250d',
    },
    {
      borderColor: '#00e900d9',
      pointBackgroundColor: '#00e900d9',
      pointBorderColor: 'rgba(0,233,0,0)',
      pointHoverBackgroundColor: '#00e900d9',

    }];

    // this.greenChart.data.datasets[0].data = this.hiredChartData;
    // this.greenChart.data.labels = this.hiredChartLabels;
    // this.greenChart.update();

    const x = update.map((element: any) => element['formattedTime']);

    const l = update[0].value.length;


    this.mainChart.data.labels = x;

    let ct = new Date()
    const strArray=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for(let i = 0 ; i < 25 ; i++){

      x.push(strArray[ct.getMonth()] + " " + ct.getFullYear())
      
      if(ct.getMonth() + 1 % 12 == 0){
        ct.setFullYear(ct.getFullYear() + 1)
      }
      ct.setMonth(ct.getMonth() + 1 % 12)
      
    }

    // this.mainChart.data.datasets[0].data = y;

    let factor = [];

    for(let k = 0 ; k < l ; k++){
      factor.push(this.linearRegression(update.slice(update.length-24,update.length),k))

    }

    for(let i = 0 ; i < l ; i++){


      this.mainChart.data.datasets[i] = {
        label: this.selectedTrends[i],
        fill: true,
        backgroundColor: gradientStroke[i%6],
        borderColor: color[i%6].borderColor,
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: color[i%6].pointBackgroundColor,
        pointBorderColor: color[i%6].pointBorderColor,
        pointHoverBackgroundColor: color[i%6].pointHoverBackgroundColor,
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        pointRadius: 1,
      }

      for(let j = 24 ; j >= 0 ; j--){

        if(i == 0)
          update.push( { value: [ ]} )

        for(let k = 0 ; k < l ; k++ ){
          let nd = new Date("1 "+x[x.length - j])
          update[update.length-1].value.push( factor[k][0] + Number(nd.getFullYear() +  ('0'+ nd.getMonth()).slice(-2) ) * factor[k][1] )
        }
      }
      this.mainChart.data.datasets[i].data = update.map((element: any) => element['value'][i]);

    }
    // this.mainChart.data.datasets[1].data = (this.selectedStatus.includes('FEEDBACK')) ? this.mainChartData['feedback'] : [];
    // this.mainChart.data.datasets[2].data = (this.selectedStatus.includes('INTERVIEW')) ? this.mainChartData['interview'] : [];
    // this.mainChart.data.datasets[3].data = (this.selectedStatus.includes('OFFER')) ? this.mainChartData['offer'] : [];
    // this.mainChart.data.datasets[4].data = (this.selectedStatus.includes('DISQUALIFIED')) ? this.mainChartData['disqualified'] : [];
    // this.mainChart.data.datasets[5].data = (this.selectedStatus.includes('HIRED')) ? this.mainChartData['hired'] : [];
    this.mainChart.update();

    // this.userChart.data.datasets[0].data = this.userChartData;
    // this.userChart.data.labels = this.userChartLabels;
    // this.userChart.update();
  }

  getTrends(keywords: any){

    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/trends`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), keyword: keywords  }), {
      headers: headers
    }).subscribe((result: any) => {

      let va = this.selectedTrends ? this.selectedTrends.map( (a:any) => { return { mid: '', title: a, type: ''} } ) : []
      
      this.trendsList = [...va , ...result.default.topics]
    })

  }

  getTrendsData(){

    
    const headers = new HttpHeaders()
    .set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/trendsData`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token"), keyword: this.selectedTrends  }), {
      headers: headers
    }).subscribe((result: any) => {

      this.updateOptions(result.default.timelineData);
    })

  }

  
  linearRegression(inputArray:any,loc:number) {
    
    const x = inputArray.map((element: any) => {    let x = new Date(Number(element["time"]+'000'));   return Number("" + x.getFullYear() +  ('0'+ x.getMonth()).slice(-2)) });
    const y = inputArray.map((element: any) => element["value"][loc]);
  
    const sumX = x.reduce((prev:any, curr:any) => prev + curr, 0);
    const avgX = sumX / x.length;
  
    const xDifferencesToAverage = x.map((value:any) => avgX - value);
    const xDifferencesToAverageSquared = xDifferencesToAverage.map(
      (value:any) => value ** 2
    );
  
    const SSxx = xDifferencesToAverageSquared.reduce(
      (prev:any, curr:any) => prev + curr,
        0
    );

    const sumY = y.reduce((prev:any, curr:any) => prev + curr, 0);
    const avgY = sumY / y.length;
    const yDifferencesToAverage = y.map((value:any) => avgY - value);
    const xAndYDifferencesMultiplied = xDifferencesToAverage.map(
      (curr:any, index:any) => curr * yDifferencesToAverage[index]
    );
    const SSxy = xAndYDifferencesMultiplied.reduce(
      (pre:any, curr:any) => pre + curr,
      0
    );
    const slope = SSxy / SSxx;
    const intercept = avgY - slope * avgX;
    return [intercept,slope ];

  }

}
