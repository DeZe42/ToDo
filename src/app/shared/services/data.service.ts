import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  darkMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {

  }
}