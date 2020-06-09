import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener, Inject, NgModule } from '@angular/core';
import io from "socket.io-client";
// import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
// import { ModalComponent } from '/modal/modal.component';
import { NgModel } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

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
  exitPostionX = 0
  exitPostionY = 0
  exitPostionAbsX = 0
  exitPostionAbsY = 0

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

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.socket.emit("disconnectUser")
  }

  private context: any;
  private canvas: any;
  private socket: any;
  private board: any;
  public myData: any;
  public dialog: any;
  public showUsers = true;
  public roomId;
  interval;
  public width = 640

  public readonly colors: Array<string> = ['green', 'red']

  constructor(private route: ActivatedRoute, private location: Location) { }

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
    this.roomId = this.route.snapshot.paramMap.get('id');
  }

  goBack() {
    this.socket.emit("disconnectUser")
    this.location.back();
  }


  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0 && this.showUsers == true) {
        this.timeLeft++;
        this.duration = new Date(this.timeLeft * 1000).toISOString().substr(11, 8)
      }
    }, 1200)
  }

  countExit() {
    for (var y = 0; y < this.board.length; y++) {
      for (var x = 0; x < this.board[y].length; x++) {
        if (this.board[y][x] === 2) {
          if (y == 0 || y == this.board.length) {
            this.exitPostionAbsX = x
            this.exitPostionAbsY = y
            console.log('y')
            this.exitPostionX = (this.width / this.board.length) * this.exitPostionAbsX + 25
            this.exitPostionY = ((this.width / this.board.length) * this.exitPostionAbsY) + ((this.width / this.board.length) / 2) - 30
          } else {
            this.exitPostionAbsX = x + 1
            this.exitPostionAbsY = y
            this.exitPostionX = (this.width / this.board.length) * this.exitPostionAbsX - 25
            this.exitPostionY = ((this.width / this.board.length) * this.exitPostionAbsY) + ((this.width / this.board.length) / 2) - 10
          }

          break;
        }
      }
    }
  }

  public ngAfterViewInit() {

    this.canvas = this.gameCanvas
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    console.log(this.roomId)
    this.socket.emit("new player", this.roomId)

    this.socket.on('maze', maze => {
      this.board = maze
      if (this.exitPostionX == 0 &&
        this.exitPostionY == 0) { this.countExit() }

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

