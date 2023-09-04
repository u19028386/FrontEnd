import { NgModule } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { APIService } from 'src/app/services/api.service';
import { UserDetailsComponent } from './user-details/user-details.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
//import { TokenInterceptor } from 'src/app/interceptor/token.interceptor';
import { ConsultantComponent } from './consultant/consultant.component';
import { NgToastModule } from 'ng-angular-popup';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { TasksComponent } from './Components/tasks/tasks.component';
import { EmployeeTypeComponent } from './Components/employee-type/employee-type.component';
import { ConfigurationComponent } from './Components/configuration/configuration.component';
import { AddEmployeeComponent } from './Components/employee/add-employee/add-employee.component';
import { AddEmployeeTypeComponent } from './Components/employee-type/add-employee-type/add-employee-type.component';
import { EditEmployeeTypeComponent } from './Components/employee-type/edit-employee-type/edit-employee-type.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { AddCalendarComponent } from './Components/calendar/add-calendar/add-calendar.component';
import { EditCalendarComponent } from './Components/calendar/edit-calendar/edit-calendar.component';
import { NotificationComponentComponent } from './Components/notification-component/notification-component.component';
import { GHelpComponent } from './Components/g-help/g-help.component';
import { AddHelpComponent } from './Components/g-help/add-help/add-help.component';
import { EditHelpComponent } from './Components/g-help/edit-help/edit-help.component';
import { HelpTypeComponent } from './Components/help-type/help-type.component';
import { AddHelpTypeComponent } from './Components/help-type/add-help-type/add-help-type.component';
import { EditHelpTypeComponent } from './Components/help-type/edit-help-type/edit-help-type.component';
import { LogItCallComponent } from './Components/log-it-call/log-it-call.component';
import { EmailUserComponent } from './Components/email-user/email-user.component';
import { UserHelpComponent } from './Components/user-help/user-help.component';
import { ProjectComponent } from './Components/project/project.component';
import { ResourceComponent } from './Components/resource/resourceview/resource.component';
import { ResourceTypeComponent } from './Components/resource/resource-type/resource-type.component';
import { AddResourceTypeComponent } from './Components/resource/resource-type/add-resource-type/add-resource-type.component';
import { EditResourceTypeComponent } from './Components/resource/resource-type/edit-resource-type/edit-resource-type.component';
import { RolesComponent } from './Components/roles/roles.component';
import { ClientComponent } from './Components/client/client.component';
import { ResetComponent } from './authentication/reset/reset.component';
import { InactiveWarningComponent } from './Components/inactive-warning/inactive-warning.component';
import { ChunkPipe } from './Components/chunk.pipe';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { TimesheetetComponent } from './timesheetet/timesheetet.component';
import { DataService } from './timesheetet/data.Service';
import {DayPilotModule} from 'daypilot-pro-angular';
import { UserUpdateComponent } from './authentication/user-update/user-update.component';
import { UpdatePasswordComponent } from './authentication/update-password/update-password.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { AdministratorComponent } from './Components/administrator/administrator.component';
import { OperationsManagerComponent } from './Components/operations-manager/operations-manager.component';
import { ProjectManagerComponent } from './Components/project-manager/project-manager.component';
import { AddRolesComponent } from './Components/roles/add-roles/add-roles.component';
import { EditRoleComponent } from './Components/roles/edit-role/edit-role.component';
import { TeamHoursReportComponent } from './Components/team-hours-report/team-hours-report.component';
import { LogProjectRequestComponent } from './Components/log-project-request/log-project-request.component';
import { ProjectProgressComponent } from './Components/project-progress/project-progress.component';
import { NgChartsModule } from 'ng2-charts';
import { AddProjectComponent } from './Components/project/add-project.component';
import { EditProjectComponent } from './Components/project/edit-project.component';
import { AddClientComponent } from './Components/client/add-client/add-client.component';
import { EditClientComponent } from './Components/client/edit-client.component';
import { ProjectAllocationComponent } from './projectallocation/projectallocation.component';
import { AddProjectAllocationComponent } from './projectallocation/add-projectallocation.component';
import { ReportsComponent } from './reports/reports.component';
import { DataTablesModule } from 'angular-datatables';
import { AuthInterceptor } from './auth.interceptor';
import { UsersComponent } from './Components/users/users.component';
import { ProjectRequestsComponent } from './Components/project-requests/project-requests.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { ConfirmationDialogComponent } from './Components/confirmation-dialog/confirmation-dialog.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';
import { ClaimComponent } from './Components/claim/claim.component';
import { ClaimTypeComponent } from './Components/claim-type/claim-type.component';
import { ClaimItemComponent } from './Components/claim-item/claim-item.component';
import { EditClaimItemComponent } from './Components/claim-item/edit-claim-item/edit-claim-item.component';
import { AddClaimTypeComponent } from './Components/claim-type/add-claim-type/add-claim-type.component';
import { EditClaimTypeComponent } from './Components/claim-type/edit-claim-type/edit-claim-type.component';
import { AddClaimItemComponent } from './Components/claim-item/add-claim-item/add-claim-item.component';
import { EditConfirmationModalComponent } from './Components/edit-confirmation-modal/edit-confirmation-modal.component';
import { DeleteConfirmationModalComponent } from './Components/delete-confirmation-modal/delete-confirmation-modal.component';
import { EditEmployeeComponent } from './Components/employee/edit-employee/edit-employee.component';
import { AddResourceComponent } from './Components/resource/add-resource/add-resource.component';
import { EditResourceComponent } from './Components/resource/edit-resource/edit-resource.component';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ClientUploadComponent } from './Components/client-upload/client-upload.component';
import { TimeSheetApprovalComponent } from './time-sheet-approval/time-sheet-approval.component';
import { ClaimCaptureComponent } from './claim-capture/claim-capture.component';
import { ProjectReportComponent } from './Components/project-report/project-report.component';
import { EmployeeReportComponent } from './Components/employee-report/employee-report.component';
import { ClientReportComponent } from './Components/client-report/client-report.component';
import { ConsolidatedProjectReportComponent } from './Components/consolidated-report/consolidated-report.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    UserDetailsComponent,
    ConsultantComponent,
    ResetPasswordComponent,
    EmployeeComponent,
    TasksComponent,
    EmployeeTypeComponent,
    ConfigurationComponent,
    AddEmployeeComponent,
    AddEmployeeTypeComponent,
    EditEmployeeTypeComponent,
    CalendarComponent,
    AddCalendarComponent,
    EditCalendarComponent,
    NotificationComponentComponent,
    HelpTypeComponent,
    LogItCallComponent,
    EmailUserComponent,
    ProjectComponent,
    AddRolesComponent,
    EditRoleComponent,
    ResourceComponent,
    ResourceTypeComponent,
    AddResourceTypeComponent,
    EditResourceTypeComponent,
    RolesComponent,
    ClientComponent,
    ResetComponent,
    InactiveWarningComponent,
    GHelpComponent,
    AddHelpTypeComponent,
    EditHelpComponent,
    AddHelpComponent,
    EditHelpTypeComponent,
    UserHelpComponent, 
    ChunkPipe,
    TimesheetetComponent,
    UserUpdateComponent,
    UpdatePasswordComponent,
    ProfileComponent,
    SafeUrlPipe,
    AdministratorComponent,
    OperationsManagerComponent,
    ProjectManagerComponent,
    TeamHoursReportComponent,
    LogProjectRequestComponent,
    ProjectProgressComponent,
    ProjectComponent,
    AddProjectComponent,
    EditProjectComponent,
    AddClientComponent,
    EditClientComponent,
    ProjectAllocationComponent,
    AddProjectAllocationComponent,
    ReportsComponent,
    UsersComponent,
    ProjectRequestsComponent,
    SideBarComponent,
    ConfirmationDialogComponent,
    VideoPlayerComponent,
    ClaimComponent,
    ClaimTypeComponent,
    ClaimItemComponent,
    EditClaimItemComponent,
    AddClaimTypeComponent,
    EditClaimTypeComponent,
    AddClaimItemComponent,
    EditConfirmationModalComponent,
    DeleteConfirmationModalComponent,
    EditEmployeeComponent,
    AddResourceComponent,
    EditResourceComponent,
    ClientUploadComponent,
    TimeSheetApprovalComponent,
    ClaimCaptureComponent,
    ProjectReportComponent,
    EmployeeReportComponent,
    ClientReportComponent,
    ConsolidatedProjectReportComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right', // Set the desired position here
      timeOut: 2000,
      enableHtml: true
    }),
    AppRoutingModule,
    MaterialModule,
    FormsModule,
    TimepickerModule.forRoot(),
    HttpClientModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgToastModule,
    CommonModule,
    NgChartsModule,
    DataTablesModule,
    DayPilotModule,
  ],
  providers: [APIService, DatePipe, DataService, DataService, {
    provide:HTTP_INTERCEPTORS,
    useClass:AuthInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
