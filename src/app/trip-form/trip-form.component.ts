import { Component, OnInit } from '@angular/core';
// import { NgForm } from '@angular/forms'
import { BusTrip } from '../tripdata'
// import { timestamp } from 'rxjs';
import { LocalService } from "../local.service"

@Component({
  selector: 'app-trip-form',
  templateUrl: './trip-form.component.html',
  styleUrls: ['./trip-form.component.css']
})
export class TripFormComponent implements OnInit {

  model = new BusTrip(false, false, "", "", "", 0, "")
  userData = new LocalService();
  calcData: any = { 'drive': 0, 'wait': 0 }
  constructor() { }

  ngOnInit(): void {
    this.model = this.userData.loadAll()
  }

  fieldUpdate(fName: keyof BusTrip) {
    this.userData.saveData(fName, String(this.model[fName]));
  }

  calculate() {
    var stopTime = this.timeStringToFloat(this.model.stopTime)
    var startTime = this.timeStringToFloat(this.model.startTime)
    var returnStartTime = this.timeStringToFloat(this.model.returnStartTime)
    var endTime = this.timeStringToFloat(this.model.endTime)
    var optStopTime = this.model.optStop / 60.0
    var driveTime = Math.max(((stopTime - startTime) + (endTime - returnStartTime) - optStopTime) , 2);
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

  convertQtrHr(time: number, up: boolean) {

  }

  timeStringToFloat(tIn: string) {
    let h = Number(tIn.split(':')[0])
    let m = Number(tIn.split(':')[1])
    return h + m/60.0
  }

  reset() {
    this.model.endTime = "";
    this.model.optStop = 0;
    this.model.pretrip = false;
    this.model.returnStartTime = "";
    this.model.startTime = "";
    this.model.stopTime = "";
    this.model.warmup = false;
    this.userData.clearData();
  }
}
