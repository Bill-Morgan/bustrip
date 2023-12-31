
export class BusTrip {

    constructor(
        public pretrip: boolean,
        public warmup: boolean,
        public btnMode: string,
        public startTime: string,
        public stopTime: string,
        public returnStartTime: string,
        public optStop: number,
        public endTime: string,
        public pauseTime: string,
    ) {  }
  
}