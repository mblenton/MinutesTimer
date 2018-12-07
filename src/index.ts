export default class MinutesTimer {
  public timer = 0;
  public display = '00:00';
  public counterState: 'created' | 'started' | 'resumed' | 'paused';
  private addTime: number;
  private startDate = 0;
  private pausedTime = 0;
  private minutes = '00';
  private seconds = '00';
  private timerId!: NodeJS.Timer;
  constructor (startTime?: string | number) {
    let localStartTime = 0;
    if (startTime) {
      localStartTime = this.getSecondsFromStringTime(startTime);
    }
    this.addTime = localStartTime * 1000;
    this.counterState = 'created';
  }

  public addSeconds (timeInSeconds: number) {
    this.addTime = timeInSeconds * 1000;
  }

  public stopAndChangeTime (timeInSeconds?: string | number) {
    let localTimeInSeconds = 0;
    if (timeInSeconds) {
      localTimeInSeconds = this.getSecondsFromStringTime(timeInSeconds);
    }

    this.timer = 0;
    clearInterval(this.timerId);
    this.pausedTime = localTimeInSeconds * 1000;
    this.display = this.displayMinAndSeconds(localTimeInSeconds);
  }

  public getTime () {
    // if (this.counterState !== 'started') {
      this.counterState = 'started';
      this.startDate = Date.now();
      this.display = this.displayMinAndSeconds(Math.floor(this.addTime / 1000));
      this.timerId = setInterval(() => this.countUp(), 100);
    // }
    return this;
  }

  public resume () {
    // if (this.counterState !== 'resumed') {
      this.counterState = 'resumed';
      this.getTime();
    // }
  }

  public start () { // start paused timer
    this.getTime();
  }

  public pause () {
    // if (this.counterState !== 'paused') {
      this.counterState = 'paused';
      this.pausedTime = this.timer;
      this.timer = 0;
      clearInterval(this.timerId);
      this.display = this.displayMinAndSeconds(Math.floor(this.pausedTime / 1000));
    // }
  }

  private countUp () {
    this.timer = (Date.now() - this.startDate) + this.addTime;
    this.display = this.displayMinAndSeconds(Math.floor((this.timer + this.pausedTime) / 1000));
  }

  private displayMinAndSeconds (seconds: number): string {
    let negative = '';
    if (seconds < 0) {
      negative = '-';
    }
    this.minutes = String(parseInt(String(Math.abs(seconds) / 60), 10));
    this.seconds = String(parseInt(String(Math.abs(seconds) % 60), 10));

    this.minutes = Number(this.minutes) < 10 ? `0${this.minutes}` : `${this.minutes}`;
    this.seconds = Number(this.seconds) < 10 ? `0${this.seconds}` : `${this.seconds}`;

    return `${negative}${this.minutes}:${this.seconds}`;
  }

  private getSecondsFromStringTime = (stringTime: string | number): number => {
    let negative = '';
    if (stringTime && typeof stringTime === 'string' && stringTime.indexOf(':') > -1) {
      const splitTime = stringTime.split(':');
      let min = splitTime[0];
      const sec = splitTime[1];
      if (min.charAt(0) === '-') {
        negative = '-';
        min = min.slice( 1 );
      }
      const myNumber = ((Number(min) * 60) + Number(sec)).toString();
      return Number(`${negative}${myNumber}`);
    } else if (isNaN(Number(stringTime))) {
      throw new Error('Wrong input provided, should be string or number representing time or seconds: "01:15", 12, "12"');
    }
    return Number(`${negative}${stringTime}`);
  };
}
