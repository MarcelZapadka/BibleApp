import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BibleContentInfoDTO, BibleVerseContentInfoDTO, BibleSearchedVerseContentInfoDTO} from './dto';
import { BibleContentInfo, BibleVerseContentInfo } from './model';
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

  getVerseContent(translation: string, book: string, chapter: number): Observable<BibleVerseContentInfo> {
    return this.http.get<BibleVerseContentInfoDTO>(
      `${environment.apiHttp.protocol}://${environment.apiHttp.host}/content/bible/${translation}/${book}/${chapter}`
    )
  }

  getSearchedVerse(translation: string, phrase: string): Observable<BibleSearchedVerseContentInfoDTO> {
    return this.http.get<BibleSearchedVerseContentInfoDTO>(
      `${environment.apiHttp.protocol}://${environment.apiHttp.host}/content/bible/${translation}/search/${phrase}`
    )
  }
}
