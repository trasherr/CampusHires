import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

    if(this.router.url == "/logout"){
      this.logout()
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']).then(() => location.reload())
  }

}
