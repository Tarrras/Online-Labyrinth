import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { ROOMS } from './MockRooms';
import { Room } from './Room';

@Injectable({ providedIn: 'root' })
export class RoomService {

  constructor() { }

  getRooms(): Observable<Room[]> {
    return of(ROOMS);
  }

  getRoom(id: number): Observable<Room> {
    return of(ROOMS.find(room => room.id === id));
  }
}