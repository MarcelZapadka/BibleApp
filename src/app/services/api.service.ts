import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const PROTOCOL = 'http';
const HOST = 'localhost:3000'

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  constructor(private http: HttpClient){}

  get bibleInfoUrl(): string {
    return `${PROTOCOL}://${HOST}`
 }

 getBibleInfo(): Observable<any> {
    return this.http.get(this.bibleInfoUrl)
 }
}


