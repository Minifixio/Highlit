import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { GameInfos } from './models/GameInfos';
import { MapInfo } from './models/MapInfo';
import { environment } from 'src/environments/environment';

interface Comments {
  comments: Array<Comment>;
  _next: string;
}

interface Comment {
  content_offset_seconds: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  urlApi = environment.urlApi;
  uriApi = environment.uriApi;
  mainUrl = `${this.urlApi}/${this.uriApi}/`;

  constructor(
    private http: HttpClient
  ) { }

  get(tag): Observable<any> {
    return this.http.get(this.mainUrl + tag);
  }

  post(tag, postParams): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(this.mainUrl + tag, JSON.stringify(postParams), httpOptions);
  }

  getGameInfos(matchId, mapNumber): Observable<GameInfos> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<GameInfos>(this.mainUrl + 'map', JSON.stringify({match_id: matchId, map_number: mapNumber}), httpOptions);
  }

  getMapInfos(matchId): Observable<MapInfo[]> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<MapInfo[]>(this.mainUrl + 'maps', JSON.stringify({match_id: matchId}), httpOptions);
  }
}
