import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import io from "socket.io-client";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  @ViewChild("game")
  private gameCanvas: ElementRef;

  private context: any;
  private socket: any;

  public ngOnInit() {
    this.socket = io("http://localhost:3000");
    console.log("connected")
  }

  public ngAfterViewInit() {
    this.context = this.gameCanvas.nativeElement.getContext("2d");
    this.socket.on("position", position => {
      this.context.fillRect(position.x, position.y, 20, 20);

      switch (position.direction) {
        case "left":
          this.context.clearRect(
            position.pos.x + 5,
            position.pos.y,
            20,
            20
          );
          this.context.fillRect(position.pos.x, position.pos.y, 20, 20);
          console.log("y" + position.pos.x)
          console.log("x" + position.pos.y)
          break;
        case "right":
          this.context.clearRect(
            position.pos.x - 5,
            position.pos.y,
            20,
            20
          );
          console.log("y" + position.pos.x)
          console.log("x" + position.pos.y)
          this.context.fillRect(position.pos.x, position.pos.y, 20, 20);
          break;
        case "up":
          this.context.clearRect(
            position.pos.x,
            position.pos.y + 5,
            20,
            20
          );
          console.log("y" + position.pos.x)
          console.log("x" + position.pos.y)
          this.context.fillRect(position.pos.x, position.pos.y, 20, 20);
          break;
        case "down":
          this.context.clearRect(
            position.pos.x,
            position.pos.y - 5,
            20,
            20
          );
          console.log("y" + position.pos.x)
          console.log("x" + position.pos.y)
          this.context.fillRect(position.pos.x, position.pos.y, 20, 20);
          break;
      }

    })
  }

  public move(direction: string) {
    this.socket.emit("move", direction);
  }

}
