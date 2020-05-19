import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, Inject, NgModule } from '@angular/core';
import io from "socket.io-client";
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
// import { ModalComponent } from '/modal/modal.component';
import { NgModel } from '@angular/forms';


enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}

@Component({
  templateUrl: './game.component.html',
  styleUrls: ['./game.complonent.css']
})
export class GameComponent implements OnInit, AfterViewInit {

  // constructor(public matDialog: MatDialog) { }

  @ViewChild("game")
  private gameCanvas: ElementRef;

  timeLeft: number = 1;
  duration = new Date(this.timeLeft * 1000).toISOString().substr(11, 8)
  remainingWay = 0
  exitPostionX = 9
  exitPostionY = 1

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (this.showUsers) {
      switch (event.keyCode) {
        case KEY_CODE.RIGHT_ARROW:
          this.move("right")
          break;
        case KEY_CODE.LEFT_ARROW:
          this.move("left")
          break;
        case KEY_CODE.UP_ARROW:
          this.move("up")
          break;
        case KEY_CODE.DOWN_ARROW:
          this.move("down")
          break;
      }
    }
  }

  private context: any;
  private canvas: any;
  private socket: any;
  private board: any;
  public myData: any;
  public dialog: any;
  public showUsers = true;
  interval;
  public width = 640

  public readonly colors: Array<string> = ['green', 'red']

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0 && this.showUsers == true) {
        this.timeLeft++;
        this.duration = new Date(this.timeLeft * 1000).toISOString().substr(11, 8)
      }
    }, 1200)
  }

  public ngAfterViewInit() {
    this.canvas = this.gameCanvas
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.socket.emit("new player")

    this.socket.on('maze', maze => {
      this.board = maze
      // this.countExit()
      this.exitPostionX = (this.width / this.board.length) * 10 - 25
      this.exitPostionY = ((this.width / this.board.length) * 1) + ((this.width / this.board.length) / 2) - 10
      this.draw()
      if (this.timeLeft == 1) { 
        console.log("tick")
        this.startTimer() 
      }
    })


    this.socket.on('win', id => {
      this.showUsers = false
      this.context.clearRect(0, 0, 640, 640);
      this.context.font = "30px Comic Sans MS";
      this.context.fillStyle = "red";
      this.context.textAlign = "center";
      this.context.fillText("Congratulations!\nYour time is " + this.duration + " ", 320, 320);
    })

    this.socket.on('old', oldPosition => {
      this.context.clearRect(oldPosition.x, oldPosition.y, 20, 20)
    })

    this.socket.on('state', players => {
      if (this.showUsers) {
        for (var id in players) {
          var player = players[id];
          this.context.fillStyle = player.color
          this.context.fillRect(player.x, player.y, 20, 20);
          this.remainingWay = this.countWay(player)
        }
      }
    })
  }

  public countWay(player) {
    return Math.round(Math.sqrt(Math.pow((this.exitPostionX - player.x), 2) + Math.pow((this.exitPostionY - player.y), 2)))
  }

  public draw() {
    if (this.showUsers) {
      var width = 640
      var blockSize = width / this.board.length;
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, width, width);
      this.context.fillStyle = "green";
      //Loop through the board array drawing the walls and the goal
      for (var y = 0; y < this.board.length; y++) {
        for (var x = 0; x < this.board[y].length; x++) {
          //Draw a wall
          if (this.board[y][x] === 1) {
            this.context.fillRect(x * blockSize, y * blockSize, blockSize, blockSize);
          }
        }
      }
    }
  }

  public move(direction: string) {
    this.socket.emit("move", direction);
  }

}

