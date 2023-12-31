import { Component, OnInit } from '@angular/core';
// import { NgForm, FormsModule, NgModel } from '@angular/forms'
import { BusTrip } from '../tripdata'
// import { timestamp } from 'rxjs';
import { LocalService } from "../local.service"
// import { Directive } from '@angular/core';
// import { jsDocComment } from '@angular/compiler';


@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {

  model = new BusTrip(false, false, "", "", "", 0, "", "")
  localData = new LocalService();
  calcData: any = { 'drive': 0, 'wait': 0 };
  paused: boolean = false;
  constructor() { }

  ngOnInit(): void {
    this.model = this.localData.loadAll()
  }

  ngAfterContentInit() {
    this.hover();
    this.updateElmsStatus();
  }

  buttonClick(button: string) {
    const tripButtons = document.getElementById('tripButtonGroup');
    const parentElm = tripButtons?.parentElement;
    const going = parentElm == document.getElementById('going');
    const startTime = document.getElementById('startTime');
    const stopTime = document.getElementById('stopTime');
    const returnStartTime = document.getElementById('returnStartTime');
    const endTime = document.getElementById('endTime');
    if (button == "startButton") {
      if (going) {
        this.model.startTime = String(new Date()).slice(16, 21);
        this.localData.saveData('startTime', String(this.model['startTime']));
        this.setElmStatus(startTime, 'enabled')
      } else {
        this.model.returnStartTime = String(new Date()).slice(16, 21);
        this.localData.saveData('returnStartTime', String(this.model['returnStartTime']));
        this.setElmStatus(returnStartTime, 'enabled')
      }
    } else if (button == "pauseButton") {
      this.model.pauseTime = String(new Date()).slice(16, 21);
      this.localData.saveData('pauseTime', String(this.model['pauseTime']));
    } else if (button == 'resumeButton') {
      console.warn(String(new Date()).slice(16, 21));
      console.warn(this.model.pauseTime)
      this.model.optStop = this.model.optStop + this.timeMinutes(String(new Date()).slice(16, 21)) - this.timeMinutes(this.model.pauseTime);
      this.model.pauseTime = "";
      this.localData.saveData('optStop', String(this.model.optStop));
    } else if (button == 'endButton') {
      if (going) {
        this.model.stopTime = String(new Date()).slice(16, 21);
        this.localData.saveData('stopTime', String(this.model['stopTime']));
        this.setElmStatus(stopTime, 'enabled')
      } else {
        this.model.endTime = String(new Date()).slice(16, 21);
        this.localData.saveData('endTime', String(this.model['endTime']));
        this.setElmStatus(endTime, 'enabled')
      }
    }
    this.updateElmsStatus()
  }

  timeMinutes(time: string) {
    return ((Number(time.slice(0, 2)) * 60) + (Number(time.slice(3))));
  }

  updateElmsStatus() {
    const startBtn = document.getElementById('startButton');
    const pauseBtn = document.getElementById('pauseButton');
    const resumeBtn = document.getElementById('resumeButton');
    const endBtn = document.getElementById('endButton');
    const tripButtons = document.getElementById('tripButtonGroup');
    const parentElm = tripButtons?.parentElement;
    if (this.model.startTime == "") {
      this.moveButtons('going');
      this.setElmStatus(startBtn, 'enabled');
      this.setElmStatus(pauseBtn, 'hidden');
      this.setElmStatus(resumeBtn, 'hidden');
      this.setElmStatus(endBtn, 'hidden');
    } else if (this.model.stopTime == "") {
      this.moveButtons('going');
      this.setElmStatus(startBtn, 'hidden');
      if (this.model.pauseTime == "") {
        this.setElmStatus(pauseBtn, 'enabled');
        this.setElmStatus(resumeBtn, 'hidden');
        this.setElmStatus(endBtn, 'enabled');
      } else {
        this.setElmStatus(pauseBtn, 'hidden');
        this.setElmStatus(resumeBtn, 'enabled');
        this.setElmStatus(endBtn, 'hidden');
      }
    } else if (this.model.returnStartTime == "") {
      this.moveButtons('coming');
      this.setElmStatus(startBtn, 'enabled');
      this.setElmStatus(pauseBtn, 'hidden');
      this.setElmStatus(resumeBtn, 'hidden');
      this.setElmStatus(endBtn, 'hidden');
    } else if (this.model.endTime == "") {
      this.moveButtons('coming');
      this.setElmStatus(startBtn, 'hidden');
      if (this.model.pauseTime == "") {
        this.setElmStatus(pauseBtn, 'enabled');
        this.setElmStatus(resumeBtn, 'hidden');
        this.setElmStatus(endBtn, 'enabled');
      } else {
        this.setElmStatus(pauseBtn, 'hidden');
        this.setElmStatus(resumeBtn, 'enabled');
        this.setElmStatus(endBtn, 'hidden');
      }
    }
  }

  setElmStatus(elm: HTMLElement | null, status: string) {
    switch (status) {
      case 'disabled':
        elm?.removeAttribute('hidden');
        elm?.setAttribute('disabled', 'disabled');
        break;
      case 'hidden':
        elm?.setAttribute('hidden', 'hidden');
        break;
      case 'enabled':
        elm?.removeAttribute('disabled');
        elm?.removeAttribute('hidden');
        break;
    }
  }

  fieldUpdate(fName: keyof BusTrip) {
    this.localData.saveData(fName, String(this.model[fName]));
    this.updateElmsStatus();
  }

  hover() {
    function is_touch_enabled() {

      // Check if touch is enabled 
      return "ontouchstart"
        in window || navigator.maxTouchPoints > 0;
    }
    if (!is_touch_enabled()) {

      var b = document.getElementsByClassName('btn')
      for (let i = 0; i < b.length; i++) {
        b[i]?.classList.add("notouch");
        b[i]?.classList.remove("touch")
      }
    }
  }

  moveButtons(moveTo: string) {
    const theButtons = document.getElementById('tripButtonGroup');
    const newLocation = document.getElementById(moveTo)
    newLocation?.appendChild(theButtons!);
  }

  calculate() {
    var stopTime = this.timeStringToFloat(this.model.stopTime)
    var startTime = this.timeStringToFloat(this.model.startTime)
    var returnStartTime = this.timeStringToFloat(this.model.returnStartTime)
    var endTime = this.timeStringToFloat(this.model.endTime)
    var optStopTime = this.model.optStop / 60.0
    var driveTime = Math.max(((stopTime - startTime) + (endTime - returnStartTime) - optStopTime), 2);
    var waitTime = returnStartTime - stopTime + optStopTime
    if (isNaN(stopTime) || isNaN(startTime) || isNaN(returnStartTime) || isNaN(endTime) || stopTime < startTime || returnStartTime < stopTime || endTime < returnStartTime) {
      window.alert("ERROR: Please double check your times!")
      return
    }
    if (this.model.pretrip == true) {
      driveTime += .25;
    }
    if (this.model.warmup) {
      waitTime -= .25;
      driveTime += .25;
    }
    driveTime = Math.floor(driveTime * 100)
    if (driveTime % 25 != 0) {
      driveTime += 25
      driveTime = (driveTime - driveTime % 25)
    }
    driveTime /= 100
    waitTime = Math.floor(waitTime * 100)
    if (waitTime % 25 != 0) {
      waitTime += 25
      waitTime = (waitTime - waitTime % 25)
    }
    waitTime /= 100

    this.calcData.drive = driveTime;
    this.calcData.wait = waitTime;
  }

  timeStringToFloat(tIn: string) {
    let h = Number(tIn.split(':')[0])
    let m = Number(tIn.split(':')[1])
    return h + m / 60.0
  }

  reset() {
    this.model.endTime = "";
    this.model.optStop = 0;
    this.model.pretrip = false;
    this.model.returnStartTime = "";
    this.model.startTime = "";
    this.model.stopTime = "";
    this.model.warmup = false;
    this.model.pauseTime = "";
    this.localData.clearData();
    this.moveButtons('going')
    this.updateElmsStatus();
  }

}
