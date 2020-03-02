import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { TwitchService } from './twitch.service';

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

  urlApi = 'http://localhost:3000';
  uriApi = 'v1';
  mainUrl = `${this.urlApi}/${this.uriApi}/`;
  twitchClientId = 'u6xyqmq1ctnewqvsce30egzkb9ajum';
  comments = [];
  roundsCount = 0;
  allComments = new Subject<Array<any>>();

  constructor(
    private http: HttpClient
  ) { }

  get(tag): Observable<any> {
    return this.http.get(this.mainUrl + tag);
  }

  post(tag, postParams) {
    console.log('POST: ', postParams);
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      })
    };
    return this.http.post(this.mainUrl + tag, JSON.stringify(postParams), httpOptions);
  }

  async getTwitchComments(videoId, startTime, endTime): Promise<number> {

    return new Promise(async (resolve, reject) => {

      let totalComment = 0;
      let lastPacket: Comments;
      let lastCommentTime = startTime;
      const urlApi =  'https://api.twitch.tv/v5';
      const path = 'videos/' + videoId;
      let tag = 'comments?content_offset_seconds=' + startTime;
      let mainUrl = `${urlApi}/${path}/${tag}`;

      const httpOptions = {
        headers: new HttpHeaders({
          'Client-ID': this.twitchClientId
        })
      };

      const firstResult = await this.http.get<Comments>(mainUrl, httpOptions).toPromise();

      tag = 'comments?cursor=' + firstResult._next;

      totalComment = firstResult.comments.length;
      lastPacket = firstResult;

      while (lastCommentTime < endTime) {
          tag = 'comments?cursor=' + lastPacket._next;
          mainUrl = `${urlApi}/${path}/${tag}`;
          lastPacket = await this.http.get<Comments>(mainUrl, httpOptions).toPromise();
          totalComment += lastPacket.comments.length;
          lastCommentTime = lastPacket.comments[0].content_offset_seconds;
      }

      resolve(totalComment);
      this.comments.push(totalComment);
      if (this.comments.length === this.roundsCount) {
        this.calculateTwitchRating();
      }
    });
  }

  calculateTwitchRating() {
    this.allComments.next(this.comments.sort((a, b) => a - b));
  }
}
