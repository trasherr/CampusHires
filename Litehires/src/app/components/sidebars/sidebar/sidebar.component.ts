import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  subMenu: any;
}
export const USER_ROUTES: RouteInfo[] = [
  {
    path: "/userDashboard/index",
    title: "Dashboard",
    icon: "icon-chart-pie-36",
    class: "",
    subMenu: []
  },
  {
    path: "/userDashboard/calendar",
    title: "Calendar",
    icon: "icon-calendar-60",
    class: "" ,
    subMenu: []
  },
  {
      path: "/userDashboard/candidate_list",
      title: "Candidate List",
      icon: "icon-bullet-list-67",
      class: "",
      subMenu: []
  },
  // {
  //   path: "/userDashboard/notifications",
  //   title: "Notifications",
  //   icon: "icon-bell-55",
  //   class: "",
  //   subMenu: null
  // },
  {
    path: "/userDashboard/meetings",
    title: "Meetings",
    icon: "icon-bell-55",
    class: "",
    subMenu: []
  },
  {
    path: "/userDashboard/profile",
    title: "User Profile",
    icon: "icon-single-02",
    class: "",
    subMenu: []
  },{
    path: "/userDashboard/positions",
    title: "Positions",
    icon: "icon-tie-bow",
    class: "",
    subMenu: []
  },

];

export const ADMIN_ROUTES: RouteInfo[] = [
  {
    path: "/litehiresDashboard/index",
    title: "Dashboard",
    icon: "icon-chart-pie-36",
    class: "",
    subMenu: []
  },
  {
    path: "/litehiresDashboard/calendar",
    title: "Calendar",
    icon: "icon-calendar-60",
    class: "" ,
    subMenu: []
  },
  {
      path: "/litehiresDashboard/candidate_list",
      title: "Candidate List",
      icon: "icon-bullet-list-67",
      class: "",
      subMenu:[]
  },
  {
    path: "/litehiresDashboard/notifications",
    title: "Notifications",
    icon: "icon-bell-55",
    class: "",
    subMenu: []
  },
  {
    path: "/litehiresDashboard/profile",
    title: "User Profile",
    icon: "icon-single-02",
    class: "",
    subMenu:[]
  },
  {
    path: "/litehiresDashboard/users",
    title: "Users",
    icon: "icon-single-02",
    class: "",
    subMenu: []
  },
  {
    path: "/litehiresDashboard/positions",
    title: "Positions",
    icon: "icon-tie-bow",
    class: "",
    subMenu: []
  },

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  menuItems: any[any];
  baseUrl = environment.BASE_URL;
  userType = localStorage.getItem("isAdmin") == "true" ? "admin" : "user";
  dashUrl = localStorage.getItem("isAdmin") == "true" ? "litehiresDashboard" : "userDashboard";

  isVendor = false;

  constructor(private http: HttpClient, private router:Router) {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit() {

    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    this.http.post(`${this.baseUrl}/${this.userType}/positions`, JSON.stringify({id:localStorage.getItem("user_id"), access_token:localStorage.getItem("access_token") }), {
      headers: headers
    }).subscribe((result: any) => {

      if(this.userType == "admin"  && result?.length > 0){
        this.menuItems[this.menuItems.length-1].subMenu = result
      }
      else if(this.userType == "user" && result?.positions.length > 0){
        this.menuItems[this.menuItems.length-1].subMenu = result.positions ? result.positions : []
          this.isVendor = result.isVendor
      }

    },
    ((error: HttpErrorResponse) => {
      if(error.status == 419){
        localStorage.clear();
        this.router.navigate(['/login'])
      }
    }))
    if(this.userType == "admin")
    this.menuItems = ADMIN_ROUTES.filter(menuItem => menuItem);

    else
      this.menuItems = USER_ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }

}
