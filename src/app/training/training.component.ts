import { TrainingService } from './training.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingTraning = false;
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseChanged
      .subscribe(
        exercise => {
          if (exercise) {
            this.onGoingTraning = true;
          } else {
            this.onGoingTraning = false;
          }
        });
  }

  ngOnDestroy() {
    if (this.exerciseSubscription)
      this.exerciseSubscription.unsubscribe()
  }

}
