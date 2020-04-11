import { AngularFirestore, DocumentChangeAction } from '@angular/fire/firestore';
import { Exercise } from './exercise.module';
import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    // private availableExercises: Exercise[] = [
    //     { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
    //     { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    //     { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    //     { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
    // ];

    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    // private finishedexercises: Exercise[] = [];

    private fbSub: Subscription[] = [];

    constructor(private db: AngularFirestore) { }

    fetchAvailableExercises() {
        this.fbSub.push(
            this.db.collection('availableExercises')
                .snapshotChanges()
                .pipe(
                    map(docArray => {
                        return docArray.map((doc: DocumentChangeAction<Exercise>) => {
                            return {
                                id: doc.payload.doc.id,
                                name: doc.payload.doc.data().name,
                                duration: doc.payload.doc.data().duration,
                                calories: doc.payload.doc.data().calories
                            };
                        });
                    })
                ).subscribe((exercises: Exercise[]) => {
                    this.availableExercises = exercises;
                    this.exercisesChanged.next([...this.availableExercises]);
                }));
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
        this.runningExercise = this.availableExercises
            .find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ... this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSub.push(
            this.db.collection('finishedExercises').valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    this.finishedExercisesChanged.next(exercises);
                }));
    }

    cancelSubscriptions() {
        this.fbSub.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}