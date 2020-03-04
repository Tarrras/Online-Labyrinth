import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, HostListener } from '@angular/core';
import io from "socket.io-client";


enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  @ViewChild("game")
  private gameCanvas: ElementRef;

  @HostListener('document:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
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

  private context: any;
  private socket: any;
  private board: any;
  public myData: any;

  public readonly colors: Array<string> = ['green', 'red']

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
  }

  public ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.socket.emit("new player")

    this.socket.on('maze', maze => {
      this.board = maze
      this.draw()
    })

    this.socket.on('old', oldPosition => {
      this.context.clearRect(oldPosition.x, oldPosition.y, 20, 20)
    })

    this.socket.on('state', players => {
      // this.context.fillStyle = 
      for (var id in players) {
        var player = players[id];
        this.context.fillStyle = player.color
        this.context.fillRect(player.x, player.y, 20, 20);
      }
    })
  }

  public draw() {
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

  public move(direction: string) {
    this.socket.emit("move", direction);
  }

}
