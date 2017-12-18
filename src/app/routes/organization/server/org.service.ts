import { Injectable } from '@angular/core';
import {Http, RequestOptions, Headers} from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class OrgService {

  constructor(private http: Http) { }
  private static resolveData(data: any) {
    const arr = [];
    let name;
    for (name in data) {
      if (name) {
        arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
      }
    }
    return arr.join('&');
  }

  XXXXXX(data: any, url: string): Observable<any> {
    // const body = JSON.stringify(data);
    const body = OrgService.resolveData(data);
    //console.log(body);
    const header = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    const options = new RequestOptions({withCredentials: true, headers: header});

    return this.http.post(url, body, options)
      .map((res) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  getOrgList(url: string) {
    /*const header = new Headers({});
    const options = new RequestOptions({headers: header});*/
    return this.http.get(url)
      .map((res) => {
        //console.log("█ res.json() ►►►", res.json() );

        return res.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Observable<any> {
    const errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    return Observable.throw(errMsg);
  }

}
