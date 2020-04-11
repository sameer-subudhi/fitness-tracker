import { UIService } from './../../shared/ui.service';
import { Exercise } from './../exercise.module';
import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // @Output() trainingStart = new EventEmitter<void>();

  exercises: Exercise[] = [];
  // exercises: Observable<Exercise[]>;
  private exerciseSubscription: Subscription;
  private loadingSub: Subscription;

  isLoading = true;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService) { }

  // ngOnInit(): void {
  //   this.exercises = this.trainingService.getAvailableExercises();
  // }

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged
      .subscribe(
        isLoading => this.isLoading = isLoading
      )

    this.exerciseSubscription = this.trainingService.exercisesChanged
      .subscribe(exercises => {
        this.exercises = exercises
      });
    this.trainingService.fetchAvailableExercises();
  }

  // onStartTraning() {
  //   this.trainingStart.emit();
  // }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    if (this.loadingSub)
      this.loadingSub.unsubscribe();
    if (this.exerciseSubscription)
      this.exerciseSubscription.unsubscribe();
  }

}
