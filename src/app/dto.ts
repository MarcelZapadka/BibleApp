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
