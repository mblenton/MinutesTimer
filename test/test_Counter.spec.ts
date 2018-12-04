import { expect } from 'chai';
import sinon from 'sinon';
import { Counter } from '../Counter';

const counters: Counter[] = [];
let clock: sinon.SinonFakeTimers;

before('start one counter', done => {
  clock = sinon.useFakeTimers();
  counters.push(new Counter().getTime());
  setTimeout(() => {
    counters[0].pause();
  }, 3100);
  setTimeout(() => {
    counters[0].resume();
  }, 6100);
  setTimeout(() => {
    done();
  }, 10200);
  clock.tick(10200);
});

after(function () {
  clock.restore();
});

describe('Counter', () => {
  it('should display elapsed time', () => {
    expect(counters[0].display).to.equal('00:07');
  });

  it('should return provided seconds in initalisation in mils', done => {
    let appCounter = new Counter(60).getTime();
    setTimeout(() => {
      expect(appCounter.display).to.equal('01:02');
    }, 2200);
    clock.tick(2200);
    appCounter = new Counter().getTime();
    setTimeout(() => {
      expect(appCounter.display).to.equal('00:05');
      done();
    }, 5500);
    clock.tick(5500);
  });

  it('method stopAndChangeTime should stop counter and change display time to 00:00 for no input', () => {
    counters[0].stopAndChangeTime();
    // console.log(counters[0]);
    expect(counters[0].display).to.equal('00:00');
  });

  it('method stopAndChangeTime should stop counter and change display time', () => {
    counters[0].stopAndChangeTime(2700); // 45:00
    // console.log(counters[0]);
    expect(counters[0].display).to.equal('45:00');
  });

  it('method stopAndChangeTime should start counter and change display time', () => {
    counters[0].start(); // 45:00
    setTimeout(() => {
      expect(counters[0].display).to.equal('45:02');
    }, 2200);
    clock.tick(2200);
  });

  it('method stopAndChangeTime should start counter and change display time', () => {
    counters[0].stopAndChangeTime('45:00');
    setTimeout(() => {
      expect(counters[0].display).to.equal('45:00');
    }, 5200);
    clock.tick(5250);
  });

  it('method stopAndChangeTime should throw error for wrong input', () => {
    expect(function () {
      counters[0].stopAndChangeTime('wrong input');
    }).to.throw(Error, 'Wrong input provided, should be string or number representing time or seconds: "01:15", 12, "12"');
  });

  it('should start counter and change display time', done => {
    counters[0].resume(); // 45:00
    setTimeout(() => {
      expect(counters[0].display).to.equal('45:02');
      done();
    }, 2200);
    clock.tick(2200);
  });

  it('should add seconds to counter', done => {
    counters[0].addSeconds(4); // 45:00
    setTimeout(() => {
      expect(counters[0].display).to.equal('45:08'); // 4 + 2
      done();
    }, 2200);
    clock.tick(2200);
  });

  it('should return provided seconds in initalisation in "mm:ss"', done => {
    const appCounter = new Counter('11:11').getTime();
    setTimeout(() => {
      expect(appCounter.display).to.equal('11:13');
      done();
    }, 2200);
    clock.tick(2200);
  });

  it('should return provided seconds in initalisation in "mm:ss"', () => {
    const appCounter = new Counter('12:15').getTime();
    expect(appCounter.display).to.equal('12:15');
  });
  
  it('should return provided seconds in initalisation in "mm:ss"', (done) => {
    const appCounter = new Counter('-00:49').getTime();
    setTimeout(() => {
      expect(appCounter.display).to.equal('-00:01');
      done();
    }, 48200);
    clock.tick(48200);
  });

  it('should return brand new counter object', done => {
    const appCounter = new Counter();
    expect(appCounter.counterState).to.equal('created');
    appCounter.start();
    setTimeout(() => {
      done();
    }, 2200);
    clock.tick(2200);
    expect(appCounter.display).to.equal('00:02');
    expect(appCounter.counterState).to.equal('started');
  });
});
