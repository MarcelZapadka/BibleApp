import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BibleApiService } from './bible-api.service';
import { BibleTranslation, BibleBooksInfo, BookInfo } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  translationSelect: FormControl = new FormControl();
  bibleTranslations: null | Array<BibleTranslation> = null;
  bibleBooks: null | Array<BibleBooksInfo> = null;
  currentBibleBookInfo?: BibleBooksInfo;
  bookInfoForm: FormControl = new FormControl();
  currentBookInfo?: BookInfo;
  currentChaptersRange?: Array<number>;

  constructor(private api: BibleApiService){}

  ngOnInit(): void {
    this.api.getContentInfo().subscribe(response => {
      this.bibleTranslations = response.translationList;
      this.bibleBooks = response.bookList;
    });

    this.translationSelect.valueChanges.subscribe(value => {
     this.currentBibleBookInfo = this.bibleBooks?.find(object => object.translationId === value);
    });

    this.bookInfoForm.valueChanges.subscribe(value => {
      this.currentBookInfo = value;
      this.currentChaptersRange = Array(value.chapterLength).fill(null).map((_, index) => index + 1);
    });
  }
}
