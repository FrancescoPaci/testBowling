import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor() { }

  title = 'test-bowling';
  points: any = []
  frames: any = []
  actualFrame = 0
  actualThrow = 1

  ngOnInit() {
    this.points = this.generateArrayOfNumbers(11)
    this.createSets()
  }

  createSets() {
    this.frames = []
    for (let i = 0; i < 10; i++) {
      this.frames.push({ number: i + 1, throw1: null, throw2: null, throw3: null, frameScore: null, spare: false, strike: false })
    }
  }

  generateArrayOfNumbers(numbers: number) {
    return [...Array(numbers).keys()]
  }

  addPoint(point: number) {
    this.frames[this.actualFrame].strike = (this.actualThrow === 1 && point === 10) || (this.actualFrame === 9 && (point === 10 || this.frames[this.actualFrame].strike))
    this.frames[this.actualFrame].spare = this.actualThrow === 2 && (this.frames[this.actualFrame].throw1 || 0) + point === 10

    if (this.actualFrame > 0) {
      if (this.frames[this.actualFrame - 1].frameScore < 30) {
        if (this.frames[this.actualFrame - 1].spare) {
          this.frames[this.actualFrame - 1].frameScore += this.actualThrow === 1 ? point : 0
        } else if (this.frames[this.actualFrame - 1].strike) {
          this.frames[this.actualFrame - 1].frameScore += point
          if (this.actualFrame > 1) {
            if (this.frames[this.actualFrame - 2].strike && this.frames[this.actualFrame - 2].frameScore < 30) {
              this.frames[this.actualFrame - 2].frameScore += point
            }
          }
        }
      }
    }
    if (this.actualFrame === 9) {
      this.frames[this.actualFrame]['throw' + this.actualThrow] = point
      let terzoTiro = this.frames[this.actualFrame].strike || this.frames[this.actualFrame].spare
      if (this.actualThrow < 2 || (terzoTiro && this.actualThrow < 3)) {
        if (this.actualThrow === 1 && point === 10) {
          this.points = this.generateArrayOfNumbers(11)
        } else if (this.actualThrow === 2 && (this.frames[this.actualFrame].spare || point === 10)) {
          this.points = this.generateArrayOfNumbers(11)
        } else {
          this.points = this.generateArrayOfNumbers(11 - point)
        }
        this.actualThrow += 1
      } else {
        this.frames[this.actualFrame].frameScore = (this.frames[this.actualFrame].throw1 || 0) + (this.frames[this.actualFrame].throw2 || 0) + (this.frames[this.actualFrame].throw3 || 0)
        this.points = []
      }
    } else if (this.actualThrow === 1 && this.remainigPoint(point)) {
      this.frames[this.actualFrame].throw1 = point
      this.actualThrow = 2
      this.points = this.generateArrayOfNumbers(11 - point)
    } else {
      this.frames[this.actualFrame].throw2 = point
      this.frames[this.actualFrame].frameScore = (this.frames[this.actualFrame].throw1 || 0) + point
      this.actualThrow = 1
      this.actualFrame += 1
      this.points = this.generateArrayOfNumbers(11)
    }
  }

  remainigPoint(point: number) {
    return 10 - point
  }

  getTotalScore(index: number) {
    if (this.frames[index].frameScore) {
      let totalScore = 0
      for (let i = 0; i <= index; i++) {
        totalScore += this.frames[i].frameScore || 0
      }
      return totalScore
    }
  }

  getSecondScoreSimbol(frame: any) {
    if (frame.throw2 === 10 && frame.throw1 === null) {
      return 'X'
    } else if (frame.throw1 + frame.throw2 === 10) {
      return '/'
    }
    return frame.throw2
  }

  getSimbolLastFrame(frame: any, position: number) {
    let point = frame['throw' + position]
    if (point) {
      if ((position === 1 && point === 10) || frame.throw3 === 10) {
        return 'X'
      } else if (position === 2 && point === 10 && frame.throw1 === 10) {
        return 'X'
      } else if (position === 2 && point + frame.throw1 === 10) {
        return '/'
      }
    }
    return point
  }

  refreshData() {
    this.actualFrame = 0
    this.actualThrow = 1
    this.createSets()
    this.points = this.generateArrayOfNumbers(11)
  }

}
