import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { BibleApiService } from './bible-api.service';
import { BibleTranslation, BibleBooksInfo, BookInfo, BibleVerseContent, BibleVerseContentInfo } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  translationSelect: FormControl = new FormControl();
  bibleTranslations?: Array<BibleTranslation>;
  bibleBooks?: Array<BibleBooksInfo>;
  currentBibleBookInfo?: BibleBooksInfo;
  bookInfoForm: FormControl = new FormControl();
  currentBookInfo?: BookInfo;
  currentChaptersRange?: Array<number>;
  chapterForm: FormControl = new FormControl();
  selectedChapter?: number;
  currentTranslation?: string;
  currentVerseContent?: Array<BibleVerseContent>;
  bookNames?: Array<string>;
  currentBookIndex: number = 0; // to do: change to currentBookCount

  constructor(
    private api: BibleApiService,
    ){};

  getVerses(): Observable<BibleVerseContentInfo> {
   return this.api.getVerseContent(this.currentTranslation!, this.currentBookInfo?.id!, this.selectedChapter!);
  };

  updateContent(){
    if (this.currentTranslation !== undefined && this.currentBookInfo?.id !== undefined && this.selectedChapter !== undefined) {
      this.getVerses().subscribe(value => {
        this.currentVerseContent = value?.verseList;
      })
    } else return
  };

  updateMenu(): void {
    if (this.translationSelect.value === undefined && this.translationSelect.value === undefined) {
      return
    }
    console.log(this.currentBookIndex)
    if (this.currentBookIndex < 39) {
      this.bookInfoForm.setValue(this.currentBibleBookInfo?.oldTestamentList[this.currentBookIndex!]);
    } else {
      this.bookInfoForm.setValue(this.currentBibleBookInfo?.newTestamentList[this.currentBookIndex!]);
    }
  };

  // To do: refactor buttons funcionality (switching between new and old testament)
  nextChapter():void {
    let currentChapter: number;
    if (this.currentBookInfo?.chapterLength === this.chapterForm.value) {
      return
    } else {
      currentChapter = +this.chapterForm.value;
      this.chapterForm.setValue(currentChapter + 1);
    }
  };

  previousChapter(): void {
    let currentChapter: number;
    if (this.chapterForm.value === 1) {
      return
    } else {
      currentChapter = +this.chapterForm.value;
      this.chapterForm.setValue(currentChapter - 1);
    }
  };

  nextBook(): void {
    this.currentBookIndex = this.currentBookIndex + 1;
    this.updateMenu();
  };

  previousBook(): void {
    this.currentBookIndex = this.currentBookIndex - 1;
    this.updateMenu();
  };
  
  ngOnInit(): void {
    this.api.getContentInfo().subscribe(response => {
      this.bibleTranslations = response.translationList;
      this.bibleBooks = response.bookList;
      this.chapterForm.setValue(1);
    });

    this.translationSelect.valueChanges.subscribe(value => {
     this.currentBibleBookInfo = this.bibleBooks?.find(object => object.translationId === value);
     this.currentTranslation = value;
     this.updateMenu();
     this.updateContent();
    });

    this.bookInfoForm.valueChanges.subscribe(value => {
      this.currentBookInfo = value;
      this.currentChaptersRange = Array(value.chapterLength).fill(null).map((_, index) => index + 1);
      this.currentBookIndex = value.index - 1;
      this.chapterForm.setValue(1);
      this.updateContent();
    });

    this.chapterForm.valueChanges.subscribe(value => {
      this.selectedChapter = value;
      this.updateContent();
    });
  }
}
