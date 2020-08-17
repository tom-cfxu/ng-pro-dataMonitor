import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  constructor(private http: _HttpClient, public api: ApiService) { }
  public post(url: string, body: object) {

  }
  public get(url: string, param?: any) {
    // return this.http.get(url)
  }
  public objectToParam(obj: any) {
    let paramStr: string = "";
    for (let key in obj) {
      paramStr += `&${key}=${obj[key]}`
    }

    // console.log(paramStr)
    return paramStr.substr(1)
  }
}
