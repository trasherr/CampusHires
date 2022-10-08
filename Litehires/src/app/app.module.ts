import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from "@angular/cdk/drag-drop";
import { PdfViewerModule } from 'ng2-pdf-viewer';
import {DialogModule} from '@angular/cdk/dialog'
import { NgxDocViewerModule } from 'ngx-doc-viewer';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './views/index/index.component';
import { LoginComponent } from './views/auth/login/login.component';
import { RegisterComponent } from './views/auth/register/register.component';
import { IndexNavbarComponent } from './components/navbar/index-navbar/index-navbar.component';
import { IndexDropdownComponent } from './components/dropdowns/index-dropdown/index-dropdown.component';
import { FooterComponent } from './components/footers/footer/footer.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { SidebarComponent } from './components/sidebars/sidebar/sidebar.component';
import { FooterDashboardComponent } from './components/footers/footer-dashboard/footer-dashboard.component';
import { NavbarDashboardComponent } from './components/navbar/navbar-dashboard/navbar-dashboard.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ForgetComponent } from './views/auth/forget/forget.component';
import { ReadOtpComponent } from './components/verify/read-otp/read-otp.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { PipelineComponent } from './views/pipeline/pipeline.component';
import { ProfileComponent } from './views/profile/profile.component';
import { UploadImgComponent } from './components/uploads/upload-img/upload-img.component';
import { PositionsComponent } from './views/positions/positions.component';
import { NewPositionComponent } from './views/positions/new-position/new-position.component';
import { AddMemberComponent } from './views/pipeline/add-member/add-member.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddCandidateComponent } from './views/add-candidate/add-candidate.component';
import { JoinPositionComponent } from './views/positions/join-position/join-position.component';
import { CalendarComponent } from './views/calendar/calendar.component';
import { CandidateListComponent } from './views/candidate-list/candidate-list.component';
import { NotificationsComponent } from './views/notifications/notifications.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';

import { FullCalendarModule } from '@fullcalendar/angular'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // a plugin!


import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UserCardComponent } from './views/pipeline/user-card/user-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltip, MatTooltipModule } from "@angular/material/tooltip";
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';

import { ResumeUploadComponent } from './components/uploads/resume-upload/resume-upload.component';
import { ResumeComponent } from './components/view/resume/resume.component';

import { CandidateDetailsComponent } from './views/candidate-details/candidate-details.component';
import { CandidateChatComponent } from './views/candidate-chat/candidate-chat.component';

import { AboutUsComponent } from './views/about-us/about-us.component';
import { AvatarModule } from 'ngx-avatar';
import { CardDashboardComponent } from './components/cards/card-dashboard/card-dashboard.component';
import { LitehiresDashboardComponent } from './layouts/litehires-dashboard/litehires-dashboard/litehires-dashboard.component';
import { SetInterviewComponent } from './views/set-interview/set-interview.component';
import { EditAddedMembersComponent } from './views/pipeline/edit-added-members/edit-added-members.component';
import { JitsiMeetingComponent } from './components/meeting/jitsi-meeting/jitsi-meeting.component';
import { MeetingsComponent } from './views/meetings/meetings.component';
import { PricingComponent } from './views/index/pricing/pricing.component';
import { EditCandidateComponent } from './views/edit-candidate/edit-candidate.component';
import { EditPositionComponent } from './views/positions/edit-position/edit-position.component';
import { CandidateUsersChatComponent } from './components/chat/candidate-users-chat/candidate-users-chat.component';
import { UsersListComponent } from "./views/users/users-list/users-list.component";
import { AdminChartsComponent } from './components/charts/admin-charts/admin-charts.component';
import { UserChartsComponent } from './components/charts/user-charts/user-charts.component';
import { UploadChatDocsComponent } from './components/uploads/upload-chat-docs/upload-chat-docs.component';
import { EditUserComponent } from './views/users/edit-user/edit-user.component';
import { CandidateChatInviteComponent } from './views/candidate-chat-invite/candidate-chat-invite.component'
import { PipelineServiceService } from './services/pipeline/pipeline-service.service'

// import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const config: SocketIoConfig = { url: 'http://localhost:5000', options: {} };

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  interactionPlugin,
  dayGridPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    LoginComponent,
    RegisterComponent,
    IndexNavbarComponent,
    IndexDropdownComponent,
    FooterComponent,
    AdminLayoutComponent,
    SidebarComponent,
    LitehiresDashboardComponent,
    FooterDashboardComponent,
    NavbarDashboardComponent,
    LogoutComponent,
    ForgetComponent,
    ReadOtpComponent,
    DashboardComponent,
    PipelineComponent,
    ProfileComponent,
    UploadImgComponent,
    PositionsComponent,
    NewPositionComponent,
    AddMemberComponent,
    AddCandidateComponent,
    JoinPositionComponent,
    CalendarComponent,
    CandidateListComponent,
    NotificationsComponent,
    UserCardComponent,
    ResumeUploadComponent,
    ResumeComponent,
    CandidateDetailsComponent,
    CandidateChatComponent,
    AboutUsComponent,
    CardDashboardComponent,
    SetInterviewComponent,
    EditAddedMembersComponent,
    JitsiMeetingComponent,
    MeetingsComponent,
    PricingComponent,
    EditCandidateComponent,
    EditPositionComponent,
    CandidateUsersChatComponent,
    UsersListComponent,
    AdminChartsComponent,
    UserChartsComponent,
    UploadChatDocsComponent,
    EditUserComponent,
    CandidateChatInviteComponent,
    // DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
    DialogModule,
    PdfViewerModule,
    FontAwesomeModule,
    MatTooltipModule,
    FullCalendarModule,
    AvatarModule,

    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatIconModule,
    MatProgressBarModule,
    NgxDocViewerModule,

    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    NgxMatNativeDateModule,
    MatDatepickerModule,

    // SocketIoModule.forRoot(config),

    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  providers: [
    { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      JwtHelperService,
      PipelineServiceService
      
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
