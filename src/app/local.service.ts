import { Injectable } from '@angular/core';
import { BusTrip } from './tripdata';

@Injectable({
  providedIn: 'root'
})


export class LocalService {

  constructor() {
  }

  public saveData(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public getData(key: string) {
    let retVal = localStorage.getItem(key);
    if (!retVal) {
      retVal = "";
    }
    return (retVal)
  }
  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear()

  }

  public  loadAll() {
    var model = new BusTrip(false, false, "", "", "", 0, "", "");
    model.endTime = String(this.getData('endTime'));
    model.optStop = Number(this.getData('optStop'));
    model.pretrip = Boolean(this.getData('pretrip'));
    model.returnStartTime = String(this.getData('returnStartTime'));
    model.startTime = String(this.getData('startTime'));
    model.stopTime = String(this.getData('stopTime'));
    model.warmup = Boolean(this.getData('warmup'));
    return (model);
  }

}
