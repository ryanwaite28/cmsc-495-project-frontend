import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutPageComponent } from './components/about-page/about-page.component';
import { ContactPageComponent } from './components/contact-page/contact-page.component';
import { InfoPageComponent } from './components/info-page/info-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { PostPageComponent } from './components/post-page/post-page.component';
import { PostsPageComponent } from './components/posts-page/posts-page.component';
import { SignupPageComponent } from './components/signup-page/signup-page.component';
import { UserHomePageComponent } from './components/user-home-page/user-home-page.component';
import { UserMessagesPageComponent } from './components/user-messages-page/user-messages-page.component';
import { UserNotificationsPageComponent } from './components/user-notifications-page/user-notifications-page.component';
import { UserSettingsPageComponent } from './components/user-settings-page/user-settings-page.component';
import { UsersPageComponent } from './components/users-page/users-page.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { UserAuthGuard } from './guards/auth.guard';
import { SignedOutGuard } from './guards/signed-out.guard';
import { UserResolver } from './resolvers/user.resolver';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: WelcomePageComponent },
  { path: 'welcome', pathMatch: 'full', component: WelcomePageComponent },
  { path: 'info', pathMatch: 'full', component: InfoPageComponent },
  { path: 'about', pathMatch: 'full', component: AboutPageComponent },
  { path: 'contact', pathMatch: 'full', component: ContactPageComponent },

  { path: 'users', pathMatch: 'full', component: UsersPageComponent },
  { path: 'posts', pathMatch: 'full', component: PostsPageComponent },
  { path: 'posts/:post_id', pathMatch: 'full', component: PostPageComponent },

  
  { path: 'signup', pathMatch: 'full', component: SignupPageComponent, canActivate: [SignedOutGuard] },
  { path: 'signin', pathMatch: 'full', component: LoginPageComponent, canActivate: [SignedOutGuard] },
  {
    path: 'users/:user_id',
    pathMatch: 'full',
    component: UserHomePageComponent,
    data: { authParamsProp: 'user_id' },
    resolve: { user: UserResolver },
  },
  {
    path: 'users/:user_id/settings',
    pathMatch: 'full',
    component: UserSettingsPageComponent,
    data: { authParamsProp: 'user_id' },
    canActivate: [UserAuthGuard],
  },
  {
    path: 'users/:user_id/messages',
    pathMatch: 'full',
    component: UserMessagesPageComponent,
    data: { authParamsProp: 'user_id' },
    canActivate: [UserAuthGuard],
  },
  {
    path: 'users/:user_id/notifications',
    pathMatch: 'full',
    component: UserNotificationsPageComponent,
    data: { authParamsProp: 'user_id' },
    canActivate: [UserAuthGuard],
  },

  { path: '**', redirectTo: 'welcome' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
