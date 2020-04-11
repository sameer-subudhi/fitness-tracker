import { AuthRoutingModule } from './auth-routing.modules';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.modules';
import { MaterialModule } from './../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
    declarations: [
        SignupComponent,
        LoginComponent,
    ],
    imports: [
        SharedModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        AngularFireAuthModule
    ],
    exports: []
})
export class AuthModule { }