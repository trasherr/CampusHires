import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class CampusHiresGuardGuard implements CanActivate {
  userLoggedIn: string|null = "";
  token: string|null = "";

  constructor( public router: Router,private jwtHelper: JwtHelperService) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      this.userLoggedIn = localStorage.getItem('user_id');
      this.token = localStorage.getItem('access_token');
      if (this.userLoggedIn == null || this.token == null ) {
        console.log("================");
        console.log(this.token);
        
        
        this.router.navigate(["login"]);
        return false;
       } 
      if(this.jwtHelper.isTokenExpired(this.token)){
    
        this.router.navigate(['logout'])
        return false
      }

      if(localStorage.getItem("isAdmin") != "true"){
        return false;
      }
      return true;
       
  }
  
}

