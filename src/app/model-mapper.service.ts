import { Injectable } from '@angular/core';
import { BibleContentInfoDTO, BibleTranslationIdentifier, TranslationNameDTO, BookInfoDTO } from './dto';
import { BibleContentInfo, BibleTranslation, BibleTranslationViewValueMap, BibleBooksInfo, BookInfo } from './model';

@Injectable({
  providedIn: 'root'
})
export class ModelMapperService {

  mapContentInfo(contentInfoDto: BibleContentInfoDTO): BibleContentInfo {
    return new BibleContentInfo(
      this.buildTranslationList(contentInfoDto.translationName),
      this.buildBookList(contentInfoDto)
    );
  }

  private buildTranslationList(translationName: TranslationNameDTO): Array<BibleTranslation> {
    const translationKeyList = Object.keys(translationName) as Array<BibleTranslationIdentifier>;
    return translationKeyList.map((key: BibleTranslationIdentifier) =>
      new BibleTranslation(
        BibleTranslationViewValueMap[key],
        translationName[key]
      ));
  }

  private buildBookList(contentInfoDto: BibleContentInfoDTO): Array<BibleBooksInfo> {
    const translationKeyList = Object.keys(contentInfoDto.translationName) as Array<BibleTranslationIdentifier>;
    return translationKeyList.map((key) =>
    new BibleBooksInfo(
      contentInfoDto.translationName[key],
      this.buildBookInfoList(contentInfoDto.translationBook[key].books.oldTestament, 1),
      this.buildBookInfoList(contentInfoDto.translationBook[key].books.newTestament, 40),
    ));
  }

  private buildBookInfoList(bookInfoDtoList: Array<BookInfoDTO>, countStart: number): Array<BookInfo> {
    return bookInfoDtoList.map((dto, index) => new BookInfo(dto.id, dto.name, dto.chapterLength, countStart + index));
  }
}
