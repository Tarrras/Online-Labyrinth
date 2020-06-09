import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Room } from '../Room';
import { RoomService } from '../RoomService';
import io from "socket.io-client";

@Component({ templateUrl: 'register.component.html', styleUrls: ['register.component.css']})
export class RegisterComponent implements OnInit, AfterViewInit {
  rooms: Room[];
  private socket: any;
  private images = ["assets/maze1.png", "assets/maze2.png","assets/maze3.png", "assets/maze4.png","assets/maze5.png"]
  constructor(private roomService: RoomService) { }

  ngOnInit(){
    this.socket = io("http://localhost:3000");
    // this.getRooms();
  }

  getRooms(): void {
    // this.roomService.getRooms()
    //   .subscribe(rooms => this.rooms = rooms)
  }

  ngAfterViewInit() {
    this.socket.emit("checkRooms")

    this.socket.on("rooms", (rooms) => {
      this.rooms = rooms
      this.rooms.map( (item, index) => {
        item.image = this.images[index]
      })
      console.log(this.rooms)
    })

    
    
  }

}   

