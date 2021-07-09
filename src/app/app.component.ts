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
  actualThrow = 0

  ngOnInit() {
    this.generatePoints(11)
    this.createSets()
  }

  createSets() {
    this.frames = []
    for (let i = 0; i < 10; i++) {
      this.frames.push({ score: [], totalScore: null })
    }
  }

  generatePoints(numbers: number) {
    this.points = [...Array(numbers).keys()]
  }

  addPoint(point: number) {
    let actualFrame = this.actualFrame
    let actualThrow = this.actualThrow
    if (actualFrame === 9) {
      if (actualThrow === 0) {
        if (point === 10) {
          this.frames[actualFrame].score.push({ point: 10, view: 'X' })
          this.actualThrow += 1
          this.generatePoints(11)
        } else {
          this.frames[actualFrame].score.push({ point: point, view: point })
          this.actualThrow += 1
          this.generatePoints(11 - point)
        }
      } else {
        if (point === 10 && (actualThrow === 0 || actualThrow === 2 ||
          (actualThrow === 1 && this.frames[actualFrame].score[0].point === 10))) {
          this.frames[actualFrame].score.push({ point: 10, view: 'X' })
        } else if (actualThrow === 1 && point + this.frames[actualFrame].score[0].point === 10) {
          this.frames[actualFrame].score.push({ point: point, view: '/' })
        } else {
          this.frames[actualFrame].score.push({ point: point, view: point })
        }
        if (actualThrow === 0 || (actualThrow === 1 &&
          (this.frames[actualFrame].score[0].view === 'X' ||
            this.frames[actualFrame].score[1].view === '/'))) {
          this.actualThrow += 1
          this.generatePoints(11)
        } else {
          this.points = []
          this.frames[actualFrame].totalScore = this.sumScore(this.frames[actualFrame].score)
        }
      }
    } else {
      if (actualThrow === 0) {
        if (point === 10) {
          this.frames[actualFrame].score.push({ point: 10, view: null })
          this.frames[actualFrame].score.push({ point: 0, view: 'X' })
          this.actualFrame += 1
          this.generatePoints(11)
        } else {
          this.frames[actualFrame].score.push({ point: point, view: point })
          this.actualThrow += 1
          this.generatePoints(11 - point)
        }
      } else if (actualThrow === 1) {
        if (point + this.frames[actualFrame].score[0].point === 10) {
          this.frames[actualFrame].score.push({ point: point, view: '/' })
        } else {
          this.frames[actualFrame].score.push({ point: point, view: point })
          this.frames[actualFrame].totalScore = this.sumScore(this.frames[actualFrame].score)
        }
        this.actualFrame += 1
        this.actualThrow = 0
        this.generatePoints(11)
      }
    }
    if (actualFrame > 0) {
      if (this.sumScore(this.frames[actualFrame - 1].score) < 30) {
        if (this.frames[actualFrame - 1].score[1].view === '/' && actualThrow === 0) {
          this.frames[actualFrame - 1].score.push({ point: point, view: point })
          this.frames[actualFrame - 1].totalScore = this.sumScore(this.frames[actualFrame - 1].score)
        } else if (this.frames[actualFrame - 1].score[1].view === 'X') {
          this.frames[actualFrame - 1].score.push({ point: point, view: point })
          if (this.frames[actualFrame - 1].score.length === 4) {
            this.frames[actualFrame - 1].totalScore = this.sumScore(this.frames[actualFrame - 1].score)
          }
          if (actualFrame > 1) {
            if (this.frames[actualFrame - 2].score[1].view === 'X' &&
              this.sumScore(this.frames[actualFrame - 2].score) < 30 && actualThrow === 0) {
              this.frames[actualFrame - 2].score.push({ point: point, view: point })
              this.frames[actualFrame - 2].totalScore = this.sumScore(this.frames[actualFrame - 2].score)
            }
          }
        }
      }
    }
  }

  getTotalScore(index: number) {
    if (this.frames[index].totalScore) {
      let totalScore = 0
      for (let i = 0; i <= index; i++) {
        totalScore += this.frames[i].totalScore
      }
      return totalScore
    }
  }

  sumScore(score: any) {
    let total = 0
    for (let i = 0; i < score.length; i++) {
      total += score[i].point || 0
    }
    return total
  }

  refreshData() {
    this.actualFrame = 0
    this.actualThrow = 0
    this.createSets()
    this.generatePoints(11)
  }

  getMaxPossible() {
    let max = 300
    for (let i = 0; i < this.frames.length; i++) {
      if (this.frames[i].totalScore) {
        max -= (30 - this.frames[i].totalScore)
      }
    }
    return max
  }

}
