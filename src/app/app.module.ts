import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { UserHomePageComponent } from './components/user-home-page/user-home-page.component';
import { UserSettingsPageComponent } from './components/user-settings-page/user-settings-page.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { PostsPageComponent } from './components/posts-page/posts-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { UserMessagesPageComponent } from './components/user-messages-page/user-messages-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { AlertsFragmentComponent } from './components/alerts-fragment/alerts-fragment.component';
import { UserNotificationsPageComponent } from './components/user-notifications-page/user-notifications-page.component';
import { UserCardComponent } from './components/user-card/user-card.component';
import { PostComponent } from './components/post/post.component';
import { CommentComponent } from './components/comment/comment.component';
import { PostFormComponent } from './components/post-form/post-form.component';
import { CommentFormComponent } from './components/comment-form/comment-form.component';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { TimeAgoPipe } from './pipes/time-ago.pipe';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    LoginPageComponent,
    SignupPageComponent,
    UserHomePageComponent,
    UserSettingsPageComponent,
    UsersPageComponent,
    UserMessagesPageComponent,
    PostPageComponent,
    AboutPageComponent,
    InfoPageComponent,
    ContactPageComponent,
    PostsPageComponent,
    NavbarComponent,
    FooterComponent,
    AlertsFragmentComponent,
    UserNotificationsPageComponent,
    UserCardComponent,
    PostComponent,
    CommentComponent,
    PostFormComponent,
    CommentFormComponent,
    TimeAgoPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgbTooltipModule,
    NgSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
