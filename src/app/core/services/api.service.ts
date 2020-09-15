import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor() { }
  private host: string = "http://114.115.139.254:8085"
  public getRDB: string = this.host + "/nbiot/getRDB";
  public login: string = this.host + "/nbiot/getRDB";
}
