import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { IndexComponent } from './views/index/index.component';
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { UserLoginGuard } from './guards/user-login.guard';
import { LogoutComponent } from './components/logout/logout.component';
import { PipelineComponent } from './views/pipeline/pipeline.component';
import { ForgetComponent } from './views/auth/forget/forget.component';
import { ProfileComponent } from './views/profile/profile.component';
import { PositionsComponent } from './views/positions/positions.component';
import { NewPositionComponent } from './views/positions/new-position/new-position.component';
import { AddCandidateComponent } from './views/add-candidate/add-candidate.component';
import { JoinPositionComponent } from './views/positions/join-position/join-position.component';
import { CalendarComponent } from './views/calendar/calendar.component';
import { CandidateListComponent } from './views/candidate-list/candidate-list.component';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { AboutUsComponent } from './views/about-us/about-us.component';
import { CampusHiresGuardGuard } from './guards/campusHires-guard/campusHires-guard.guard';
import { CampusHiresDashboardComponent } from './layouts/campusHires-dashboard/campusHires-dashboard/campusHires-dashboard.component';
import { MeetingsComponent } from './views/meetings/meetings.component';
import { JitsiMeetingComponent } from './components/meeting/jitsi-meeting/jitsi-meeting.component';
import { PricingComponent } from './views/index/pricing/pricing.component';
import { CandidateUsersChatComponent } from './components/chat/candidate-users-chat/candidate-users-chat.component';
import { UsersListComponent } from './views/users/users-list/users-list.component';

const routes: Routes = [
  {path: "",component:IndexComponent, title:"CampusHires"},
  {path: "login",component:LoginComponent, title:"Login"},
  {path: "forget",component:ForgetComponent, title:"Forget password"},
  {path: "register",component:RegisterComponent, title:"Register"},
  {path: "logout", component:LogoutComponent},
  {path: "aboutus", component:AboutUsComponent, title:"About Us"},
  {path: "pricing", component:PricingComponent, title:"Pricing"},
  {path: "meeting", component:JitsiMeetingComponent, title:"Metting Powered By Jitsi"},
  {path: "testpath", component:AboutUsComponent, title:"Metting Powered By Jitsi"},
  {path:"meeting/:room",component:JitsiMeetingComponent, title:"Meeting Powered By Jitsi"},
  {path:"candidateChat/:room",component:CandidateUsersChatComponent, title:"Chat"},

  {path: "userDashboard", component: AdminLayoutComponent,
    children : [
      // {path: "logout", component:LogoutComponent}
      {path:"",component:DashboardComponent, title:"Dashboard"},
      {path:"index",component:DashboardComponent, title:"Dashboard"},
      {path:"pipeline/:id", component:PipelineComponent,title:"Pipeline"},
      {path:"profile",component:ProfileComponent, title:"Profile"},
      {path:"positions",component:PositionsComponent, title:"Positions"},
      {path:"meetings/:room",component:JitsiMeetingComponent, title:"Meeting Powered By Jitsi"},
      {path:"meetings",component:MeetingsComponent, title:"Meetings"},
      {path:"joinPosition/:code",component:JoinPositionComponent, title:"Joining"},
      {path:"positions/newPosition",component:NewPositionComponent, title:"Create new position"},
      {path:"calendar",component:CalendarComponent, title:"Calender"},
      {path:"candidate_list",component:CandidateListComponent, title:"Candidates"},
      {path:"notifications",component:NotificationsComponent, title:"Notifications"},
      {path:"add-candidate/:id/:cid",component:AddCandidateComponent, title:"Add Candidate"},
      {path:"add-candidate/:id",component:AddCandidateComponent, title:"Add Candidate"},
    ],
   canActivate:[UserLoginGuard]
  },

  {path: "campusHiresDashboard", component: CampusHiresDashboardComponent,
    children : [
      // {path: "logout", component:LogoutComponent}
      {path:"",component:DashboardComponent, title:"Dashboard"},
      {path:"index",component:DashboardComponent, title:"Dashboard"},
      {path:"pipeline/:id", component:PipelineComponent,title:"Pipeline"},
      {path:"profile",component:ProfileComponent, title:"Profile"},
      {path:"positions",component:PositionsComponent, title:"Positions"},
      {path:"users",component:UsersListComponent, title:"Users"},
      {path:"meetings",component:MeetingsComponent, title:"Meetings"},
      {path:"joinPosition/:code",component:JoinPositionComponent, title:"Joining"},
      // {path:"positions/newPosition",component:NewPositionComponent, title:"Create new position"},
      {path:"calendar",component:CalendarComponent, title:"Calender"},
      {path:"candidate_list",component:CandidateListComponent, title:"Candidates"},
      {path:"notifications",component:NotificationsComponent, title:"Notifications"},
      {path:"add-candidate/:id",component:AddCandidateComponent, title:"Add Candidate"},
      {path:"add-candidate/:id/:cid",component:AddCandidateComponent, title:"Add Candidate"}
    ],
   canActivate:[CampusHiresGuardGuard]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
