import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

interface SocketInfo {
  type: string;
  params: any;
}

@Injectable({
  providedIn: 'root'
})

export class SocketsService {

  urlApi = environment.urlApi;
  uriApi = environment.uriApi;
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
