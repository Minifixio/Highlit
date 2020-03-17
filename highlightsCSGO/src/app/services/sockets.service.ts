import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

interface SocketInfo {
  type: string;
  params: any;
}

@Injectable({
  providedIn: 'root'
})

export class SocketsService {

  urlApi = 'http://localhost:4000'; // TODO : make a model for server infos
  socket: any;

  constructor() {
    this.socket = io(this.urlApi);
  }

  emit(tag, params) {
    this.socket.emit(tag, params);
  }

  subscribeToSocket(tag): Observable<SocketInfo> {
    return new Observable((observer) => {
      this.socket.on(tag, (info: SocketInfo) => {
        observer.next(info);
      });
    });
  }
}
