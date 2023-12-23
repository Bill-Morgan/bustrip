import { Time } from "@angular/common";
import { Binary } from "@angular/compiler";

export class BusTrip {

    constructor(
        public pretrip: boolean,
        public warmup: boolean,
        public startTime: string,
        public stopTime: string,
        public returnStartTime: string,
        public optStop: number,
        public endTime: string
    ) {  }
  
}