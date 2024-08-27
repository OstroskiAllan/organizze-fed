import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { HomeComponent } from './components/home/home.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { MatOptionModule } from '@angular/material/core';
import { LoginComponent } from './components/auth/login/login.component';
import { HeaderComponent } from './views/template/header/header.component';
import { FooterComponent } from './views/template/footer/footer.component';
import { NavComponent } from './views/template/nav/nav.component';
import { ProjectsComponent } from './components/project/projects/projects.component';
import { ProjectsReadComponent } from './components/project/projects-read/projects-read.component';
import { ProjectsCreateComponent } from './components/project/projects-create/projects-create.component';
import { ProjectsUpdateComponent } from './components/project/projects-update/projects-update.component';
import { ModalConfirmacaoComponent } from './views/template/modal-confirmacao/modal-confirmacao.component';
import { DashProjectComponent } from './components/dash-project/dash-project.component';
import { TaskComponent } from './components/task/task/task.component';
import { TeamComponent } from './components/team/team/team.component';
import { TaskboardComponent } from './components/taskboard/taskboard/taskboard.component';
import { TesteDashComponent } from './teste-dash/teste-dash.component';
import { TesteDragComponent } from './teste-drag/teste-drag.component';




@NgModule({
  declarations: [
    AppComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    HomeComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    ProjectsComponent,
    ProjectsReadComponent,
    ProjectsCreateComponent,
    ProjectsUpdateComponent,
    ModalConfirmacaoComponent,
    TaskComponent,
    DashProjectComponent,
    TeamComponent,
    TaskboardComponent,
    TesteDashComponent,
    TesteDragComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    DragDropModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatDialogModule,
    MatGridListModule,
    MatMenuModule,
    CdkAccordionModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
