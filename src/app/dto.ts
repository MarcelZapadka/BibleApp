export type BibleTranslationIdentifier = 'KJV' | 'NBG' | 'UBG' | 'Warszawska';

export type TranslationNameDTO = {
  [key in BibleTranslationIdentifier]: string;
};

export type TranslationBookDTO = {
  [key in BibleTranslationIdentifier]: BooksInfoDTO;
};

export interface BooksInfoDTO {
  books: BooksDTO;
}

export interface BooksDTO {
  oldTestament: Array<BookInfoDTO>;
  newTestament: Array<BookInfoDTO>;
}

export interface BookInfoDTO {
  id: string;
  name: string;
  chapterLength: number;
}

export interface BibleContentInfoDTO {
  translationBook: TranslationBookDTO;
  translationName: TranslationNameDTO;
}

export interface BibleVerseContentInfoDTO {
  no: number,
  verseList: Array<BibleVerseContentDTO>
}

export interface BibleVerseContentDTO {
  no: number,
  value: string
}

export interface BibleSearchedVerseContentInfoDTO {
  chapterList: Array<BibleSearchedVerseChapterList>,
  id: string,
  name: string,
}

export interface BibleSearchedVerseChapterList {
  no: number,
  verseList: Array<BibleSearchedVerseContent>
}

export interface BibleSearchedVerseContent {
  no: number,
  value: string
}

