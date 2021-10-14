import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Data } from './shared/data.model';
import { DataService } from './shared/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
 
  inputCtrl: FormControl = new FormControl('');
  data: Data[] = [];
  sortedData: Data[] = [];
  active: boolean = false;
  completed: boolean = false;
  indexValue: any;
  itemLeft: number = 0;
  darkMode: boolean = false;
  darkModeSubscription: Subscription;
  
  constructor(
    private dataService: DataService
  ) {

  }

  ngOnInit() {
    this.getDarkMode();
    this.loadData();
    this.dataService.darkMode$.subscribe(data => {
      this.darkMode = data;
    });
  }

  ngOnDestroy() {
    if (this.darkModeSubscription) this.darkModeSubscription.unsubscribe();
  }

  getDarkMode() {
    if (localStorage.getItem('darkMode') == null || (localStorage.getItem('darkMode') == 'false')) {
      this.dataService.darkMode$.next(false);
    } else {
      this.dataService.darkMode$.next(true);
    }
  }

  setDarkMode(active) {
    this.dataService.darkMode$.next(active);
    localStorage.setItem('darkMode', active);
  }

  loadData() {
    if (localStorage.getItem('data') != null) {
      let data = localStorage.getItem('data');
      if (data) this.data = JSON.parse(data);
      this.sortedData = this.data;
      this.itemLeft = 0;
      this.sortedData.forEach(element => {
        if (element.done == false) {
          this.itemLeft += 1;
        }
      });
      this.active = false;
      this.completed = false;
    }
  }

  addItem(event) {
    if (event.keyCode == 13 && this.inputCtrl.value != '') {
      this.data.push({ id: this.data.length + 1, name: this.inputCtrl.value, date: new Date(), done: false });
      localStorage.setItem('data', JSON.stringify(this.data));
      this.inputCtrl.setValue('');
      this.loadData();
    }
  }

  deleteItem(event, element) {
    event.stopPropagation();
    this.data = this.data.filter(value => {
      return value != element;
    });
    localStorage.setItem('data', JSON.stringify(this.data));
    this.loadData();
  }

  setDoneItem(element) {
    this.data.forEach(value => {
      if (value.name == element.name && value.id == element.id) {
        if (value.done == false) {
          value.done = true;
        } else {
          value.done = false;
        }
      }
    });
    localStorage.setItem('data', JSON.stringify(this.data));
    this.loadData();
  }

  sortDataDone(active: boolean) {
    this.active = false;
    this.completed = false;
    this.itemLeft = 0;
    if (active == true) {
      this.sortedData = this.data.filter(element => {
        return element.done == false;
      });
      this.sortedData.forEach(element => {
        if (element.done == false) {
          this.itemLeft += 1;
        }
      });
      this.active = true;
    } else {
      this.sortedData = this.data.filter(element => {
        return element.done == true;
      });
      this.sortedData.forEach(element => {
        if (element.done == true) {
          this.itemLeft += 1;
        }
      });
      this.completed = true;
    }
  }

  deleteCompleted() {
    this.data = this.data.filter(element => {
      return element.done == false;
    });
    localStorage.setItem('data', JSON.stringify(this.data));
    this.loadData();
  }
}