import { UIService } from './../shared/ui.service';
import { TrainingService } from './../training/training.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs/internal/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    // private user: User;
    private isAuthenticated = false;

    constructor(
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService,
        private router: Router) { }


    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData) {
        // this.user = {
        //     email: authData.email,
        //     userId: Math.round(Math.random() * 10000).toString()
        // };
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth.createUserWithEmailAndPassword(
            authData.email, authData.password)
            .then(
                result => {
                    this.uiService.loadingStateChanged.next(false);
                    // console.log(result)
                    // this.authSuccessfully();
                })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.message, null, 3000);
            });
    }

    login(authData: AuthData) {
        // this.user = {
        //     email: authData.email,
        //     userId: Math.round(Math.random() * 10000).toString()
        // };
        // this.authSuccessfully();
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth.signInWithEmailAndPassword(
            authData.email, authData.password)
            .then(
                result => {
                    // console.log(result)
                    // this.authSuccessfully();
                    this.uiService.loadingStateChanged.next(false);
                })
            .catch(error => {
                // console.log(error);
                this.uiService.loadingStateChanged.next(false);
                this.uiService.showSnackbar(error.message, null, 3000);
            });
    }

    logout() {
        // this.user = null;
        // this.trainingService.cancelSubscriptions();
        // this.authChange.next(false);
        // this.router.navigate(['/login']);
        // this.isAuthenticated = false;
        this.afAuth.auth.signOut();
    };

    // getUser() {
    //     return { ...this.user };
    // }

    isAuth() {
        return this.isAuthenticated;
    }

    // private authSuccessfully() {
    //     this.isAuthenticated = true;
    //     this.authChange.next(true);
    //     this.router.navigate(['/training']);
    // }
}