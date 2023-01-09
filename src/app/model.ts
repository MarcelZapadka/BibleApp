import { BibleTranslationIdentifier } from './dto';

type BibleTranslationMapModel = {
  [key in BibleTranslationIdentifier]: string;
};

export const BibleTranslationViewValueMap: BibleTranslationMapModel = {
  KJV: 'King James Version',
  NBG: 'Nowa Biblia Gdańska',
  UBG: 'Uwspółcześniona Biblia Gdańska',
  Warszawska: 'Warszawska',
};

export const BibleTranslationApiIdMap: BibleTranslationMapModel = {
  KJV: 'KingJamesVersion',
  NBG: 'NowaBibliaGdanska',
  UBG: 'UwspolczesnionaBibliaGdanska',
  Warszawska: 'Warszawska',
};

export class BibleTranslation {
  constructor(
    public viewValue: string,
    public id: string,
  ) {}
}

export class BookInfo {
  constructor(
    public id: string,
    public viewValue: string,
    public chapterLength: number,
    public counter: number,
  ) {}
}

export class BibleBooksInfo {
  constructor(
    public translationId: string,
    public oldTestamentList: Array<BookInfo>, 
    public newTestamentList: Array<BookInfo>, 
  ) {}
  
  getBook(count: number): BookInfo | undefined{
    if (count <= 39) {
      return this.oldTestamentList.find(value => value.counter === count);
    } else {
      return this.newTestamentList.find(value => value.counter === count);
    }
  }
}

export class BibleContentInfo {
  constructor(
    public translationList: Array<BibleTranslation>,
    public bookList: Array<BibleBooksInfo>,
  ) {}
}

export interface BibleVerseContentInfo {
  no: number,
  verseList: Array<BibleVerseContent>
}

export interface BibleVerseContent {
  no: number,
  value: string
}