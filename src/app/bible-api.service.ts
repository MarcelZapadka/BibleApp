import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BibleContentInfoDTO } from './dto';
import { BibleContentInfo } from './model';
import { ModelMapperService } from './model-mapper.service';

@Injectable({
  providedIn: 'root'
})
export class BibleApiService {

  constructor(
    private http: HttpClient,
    private modelMapper: ModelMapperService
  ) {}

  getContentInfo(): Observable<BibleContentInfo> {
    return this.http.get<BibleContentInfoDTO>(
      `${environment.apiHttp.protocol}://${environment.apiHttp.host}/content/info`
    ).pipe(
      map((contentInfoDto: BibleContentInfoDTO) => this.modelMapper.mapContentInfo(contentInfoDto))
    )
  }
}