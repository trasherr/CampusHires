import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class UserLoginGuard implements CanActivate {
  userLoggedIn: string|null = "";
  token: string|null = "";
  code: string|null = ""

  constructor( public router: Router,private jwtHelper: JwtHelperService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      
      this.userLoggedIn = localStorage.getItem('user_id');
      this.token = localStorage.getItem('access_token');

      if (this.userLoggedIn == null || this.token == null ) { 
        this.router.navigate(["login"]);

        let params = state.url.split("/").length == 4 ? state.url.split("/") : state.url.split("\\")
        if( params[1] == "userDashboard" && params[2] == "joinPosition" && params[3] != undefined){
          this.code = params[3]
        }
        if(this.code){
          localStorage.setItem("join_code",this.code)
        }

        return false;
       } 
      if(this.jwtHelper.isTokenExpired(this.token)){
    
        this.router.navigate(['logout'])
        return false
      }
      return true;
       
  }
  
}
