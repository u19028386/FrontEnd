import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component'
import { RegisterComponent } from './authentication/register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { AuthGuard } from 'src/app/gards/auth.guard';
import { ConsultantComponent } from './consultant/consultant.component';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { EmployeeTypeComponent } from 'src/app/Components/employee-type/employee-type.component';
import { AddEmployeeTypeComponent } from 'src/app/Components/employee-type/add-employee-type/add-employee-type.component';
import { EditEmployeeTypeComponent } from 'src/app/Components/employee-type/edit-employee-type/edit-employee-type.component';
import { EmployeeComponent } from './Components/employee/employee.component';
import { ConfigurationComponent } from 'src/app/Components/configuration/configuration.component';
import { AddEmployeeComponent } from 'src/app/Components/employee/add-employee/add-employee.component';
// import { EditEmployeeComponent } from 'src/app/Components/calendar/edit-employee/edit-employee.component';
import { AddCalendarComponent } from './Components/calendar/add-calendar/add-calendar.component';
import { EditCalendarComponent } from './Components/calendar/edit-calendar/edit-calendar.component';
import { ResetComponent } from './authentication/reset/reset.component';
import { ClientComponent } from './Components/client/client.component';
import { AddClientComponent } from './Components/client/add-client/add-client.component';
import { EmailUserComponent } from './Components/email-user/email-user.component';
import { GHelpComponent } from './Components/g-help/g-help.component';
import { AddHelpComponent } from './Components/g-help/add-help/add-help.component';
import { EditHelpComponent } from './Components/g-help/edit-help/edit-help.component';
import { HelpTypeComponent } from './Components/help-type/help-type.component';
import { AddHelpTypeComponent } from './Components/help-type/add-help-type/add-help-type.component';
import { EditHelpTypeComponent } from './Components/help-type/edit-help-type/edit-help-type.component';
import { UserHelpComponent } from './Components/user-help/user-help.component';
import { ResourceComponent } from './Components/resource/resourceview/resource.component';
import { ResourceTypeComponent } from './Components/resource/resource-type/resource-type.component';
import { AddResourceTypeComponent } from './Components/resource/resource-type/add-resource-type/add-resource-type.component';
import { EditResourceTypeComponent } from './Components/resource/resource-type/edit-resource-type/edit-resource-type.component';
import { RolesComponent } from './Components/roles/roles.component';
import { AddRolesComponent } from './Components/roles/add-roles/add-roles.component';
import { EditRoleComponent } from './Components/roles/edit-role/edit-role.component';
import { TasksComponent } from './Components/tasks/tasks.component';
import { AddTaskComponent } from './Components/tasks/add-task/add-task.component';
import { EditTaskComponent } from './Components/tasks/edit-task/edit-task.component';
import { TimesheetetComponent } from './timesheetet/timesheetet.component';
import { ViewemployeeComponent } from './Components/employee/view-employee/view-employee.component';
import { UserUpdateComponent } from './authentication/user-update/user-update.component';
import { UpdatePasswordComponent } from './authentication/update-password/update-password.component';
import { ProfileComponent } from './authentication/profile/profile.component';
import { AdministratorComponent } from './Components/administrator/administrator.component';
import { OperationsManagerComponent } from './Components/operations-manager/operations-manager.component';
import { ProjectManagerComponent } from './Components/project-manager/project-manager.component';
import { TeamHoursReportComponent } from './Components/team-hours-report/team-hours-report.component';
import { LogProjectRequestComponent } from './Components/log-project-request/log-project-request.component';
import { ProjectProgressComponent } from './Components/project-progress/project-progress.component';
import { ProjectComponent } from './Components/project/project.component';
import { AddProjectComponent } from './Components/project/add-project.component';
import { EditProjectComponent } from './Components/project/edit-project.component';
import { EditClientComponent } from './Components/client/edit-client.component';
import { AddProjectAllocationComponent } from './projectallocation/add-projectallocation.component';
import { ProjectAllocationComponent } from './projectallocation/projectallocation.component';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './Components/users/users.component';
import { ProjectRequestsComponent } from './Components/project-requests/project-requests.component';
import { SideBarComponent } from './Components/side-bar/side-bar.component';
import { ConfirmationDialogComponent } from './Components/confirmation-dialog/confirmation-dialog.component';
import { VideoPlayerComponent } from './Components/video-player/video-player.component';
import { ClaimItemComponent } from './Components/claim-item/claim-item.component';
import { AddClaimTypeComponent } from './Components/claim-type/add-claim-type/add-claim-type.component';
import { EditClaimTypeComponent } from './Components/claim-type/edit-claim-type/edit-claim-type.component';
import { EditClaimItemComponent } from './Components/claim-item/edit-claim-item/edit-claim-item.component';
import { ClaimTypeComponent } from './Components/claim-type/claim-type.component';
import { AddClaimItemComponent } from './Components/claim-item/add-claim-item/add-claim-item.component';
import { EditEmployeeComponent } from './Components/employee/edit-employee/edit-employee.component';
import { AddResourceComponent } from './Components/resource/add-resource/add-resource.component';
import { EditResourceComponent } from './Components/resource/edit-resource/edit-resource.component';
import { ClientUploadComponent } from './Components/client-upload/client-upload.component';
import { TimeSheetApprovalComponent } from './time-sheet-approval/time-sheet-approval.component';
import { ClaimCaptureComponent } from './claim-capture/claim-capture.component';
import { ClientReportComponent } from './Components/client-report/client-report.component';
import { ConsolidatedProjectReportComponent } from './Components/consolidated-report/consolidated-report.component';
import { EmployeeReportComponent } from './Components/employee-report/employee-report.component';
import { ProjectReportComponent } from './Components/project-report/project-report.component';


const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'register', component:RegisterComponent},
  { path: 'reset-password', component: ResetPasswordComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'update-user/:id', component: UserUpdateComponent },
  {path: 'users', component: UsersComponent},
  { path: 'user-details', component: UserDetailsComponent },
  { path: 'update-password/:id', component: UpdatePasswordComponent },
  { path: 'profile/:userId', component: ProfileComponent },
  { path: 'consultant', component: ConsultantComponent,canActivate:[AuthGuard] },
  { path: 'admin', component: AdministratorComponent, canActivate:[AuthGuard]},
  { path: 'operations-manager', component: OperationsManagerComponent, canActivate:[AuthGuard] },
  { path: 'project-manager', component: ProjectManagerComponent,canActivate:[AuthGuard] },
  { path : 'mycalendar', component: CalendarComponent },
  {path: 'sidebar', component: SideBarComponent},
  {path: 'client-upload', component: ClientUploadComponent},
  { path : 'employee-types', component:EmployeeTypeComponent},
  {path : 'addemployeetype', component:AddEmployeeTypeComponent},
  {path : 'editemployeetype/:id', component:EditEmployeeTypeComponent},
  {path : 'employees', component:EmployeeComponent},
  {path : 'employee/:employeeId', component:ViewemployeeComponent },
  {path : 'config', component:ConfigurationComponent},
  {path : 'addemployee', component : AddEmployeeComponent},
  {path : 'eemployee/:id', component:EditEmployeeComponent},
  {path : 'addresource', component:AddResourceComponent},
  {path : 'resource/:id', component:EditResourceComponent},
{path : 'addcalendaritem', component : AddCalendarComponent},
{path : 'editcalendaritem/:calendarItemId', component : EditCalendarComponent},
{path: 'reset', component: ResetComponent},
{path: 'client', component: ClientComponent},
{path: 'emailuser', component: EmailUserComponent},
{path: 'addclient', component:AddClientComponent},
{path: 'video-player/:helpId', component: VideoPlayerComponent},
{path: 'help/add', component:AddHelpComponent},
{path:'help',component:GHelpComponent},
{path: 'help/edit/:id',component:EditHelpComponent},
{path:'help-type', component: HelpTypeComponent},
{path:'help-type/add',component: AddHelpTypeComponent},
{path: 'add-claimitem', component: AddClaimItemComponent},
{path:'Claim-item',component:ClaimItemComponent},
{path: 'edit-claimitem',component:EditClaimItemComponent},
{path:'Claim-type', component: ClaimTypeComponent},
{path:'add-claimtype',component: AddClaimTypeComponent},
{path:'edit-claimtype',component:EditClaimTypeComponent},
{path: 'confirmation', component:ConfirmationDialogComponent},
{path:'user-help',component: UserHelpComponent},
{path:'resource', component:ResourceComponent},
{path: 'resourcetype',component:ResourceTypeComponent},
{path:'addresourcetype',component:AddResourceTypeComponent},
{path:'resourcetype/:id',component:EditResourceTypeComponent},
{path:'roles',component:RolesComponent},
{path:'add-role',component:AddRolesComponent},
{path:'edit-role',component:EditRoleComponent},
{path:'task', component:TasksComponent},
{path:'add-task', component:AddTaskComponent},
{path: 'add-task', component:EditTaskComponent},
{path: 'timecard', component: TimesheetetComponent},
{path: 'team-hours', component: TeamHoursReportComponent},
{path: 'project-progress', component: ProjectProgressComponent},
{path: 'project-request', component: LogProjectRequestComponent},
{path: 'project-requests', component: ProjectRequestsComponent},
{path : 'eemployee/:id', component:EditEmployeeComponent},
{path: 'project', component: ProjectComponent},
{path: 'addproject', component: AddProjectComponent},
{path: 'project/:id', component: EditProjectComponent},
{path: 'client/:id', component: EditClientComponent},
  {path: 'addclient', component: AddClientComponent},
  {path: 'addprojectAllocation', component: AddProjectAllocationComponent},
  {path: 'claimCapture', component: ClaimCaptureComponent},
  {path: 'projectAllocation', component: ProjectAllocationComponent},
  {path: 'report', component: ReportsComponent},
  {path : 'timesheet', component : TimeSheetApprovalComponent},
  {path : 'clientReport', component : ClientReportComponent },
  {path : 'consolidatedReport', component : ConsolidatedProjectReportComponent},
  {path : 'employeeReport', component : EmployeeReportComponent},
  {path : 'projectReport', component : ProjectReportComponent},
  {path: '', redirectTo: '/login', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
