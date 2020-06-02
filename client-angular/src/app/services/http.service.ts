import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { MapInfo } from '../models/Match/MapInfo';
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

  async get<T>(tag: string): Promise<T> {
    try {
      return await this.http.get<T>(this.mainUrl + tag).toPromise();
    } catch (e) {
      throw e;
    }
  }

  async post<T>(tag: string, postParams: any): Promise<T> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      })
    };

    try {
      return await this.http.post<T>(this.mainUrl + tag, JSON.stringify(postParams), httpOptions).toPromise();
    } catch (e) {
      throw e;
    }
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
