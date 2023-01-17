import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { BibleApiService } from './bible-api.service';
import { BibleTranslation, BibleBooksInfo, BookInfo, BibleVerseContent, BibleVerseContentInfo } from './model';
import { Router, ActivatedRoute } from '@angular/router';
import { SearchComponent } from './search/search.component';

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
  currentBookCount: number = 1;
  @ViewChild('searchComponent') searchComponent!: SearchComponent;

  constructor(
    private api: BibleApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
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
    if (this.translationSelect.value === undefined && this.bookInfoForm.value === undefined) {
      return
    }
    this.bookInfoForm.setValue(this.currentBibleBookInfo?.getBookByCount(this.currentBookCount));
  }

  nextChapter():void {
    let currentChapter: number;
    if (this.currentBookInfo?.chapterLength === this.chapterForm.value) {
      this.nextBook();
    } else {
      currentChapter = +this.chapterForm.value;
      this.chapterForm.setValue(currentChapter + 1);
    }
  };

  previousChapter(): void {
    let currentChapter: number;
    if (this.chapterForm.value === 1) {
      this.previousBook();
      this.chapterForm.setValue(this.currentChaptersRange![this.currentChaptersRange!.length - 1]);
    } else {
      currentChapter = +this.chapterForm.value;
      this.chapterForm.setValue(currentChapter - 1);
    }
  };

  nextBook(): void {
    this.currentBookCount += 1;
    this.updateMenu();
  };

  previousBook(): void {
    this.currentBookCount -= 1;
    this.updateMenu();
  };

  updateUrl(): void {
    this.router.navigateByUrl(`${this.translationSelect.value}/${this.bookInfoForm.value.id}/${this.chapterForm.value}`);
  }

  openSearch(sideNav: any): void {
    this.searchComponent.toggleSearch();
    sideNav.close();
  }
  
  ngOnInit(): void {
    this.api.getContentInfo().subscribe(
      bibleContentInfo => {
        this.bibleTranslations = bibleContentInfo.translationList;
        this.bibleBooks = bibleContentInfo.bookList;
      },
      error => console.log(error),
      () => {       
        let route = this.activatedRoute.firstChild!.snapshot.paramMap;
        if (!route.has("translation")) {
          this.translationSelect.setValue(this.bibleTranslations![0].id);
        } else {
          this.translationSelect.setValue(route.get('translation'));
          this.bookInfoForm.setValue(this.currentBibleBookInfo?.getBookById(route.get('book')!));
          this.chapterForm.setValue(+route.get('chapter')!);
          this.searchComponent.currentTranslation = route.get('translation')!;
        }
      }
    );

    this.translationSelect.valueChanges.subscribe(value => {
     this.currentBibleBookInfo = this.bibleBooks?.find(bibleBook => bibleBook.translationId === value);
     this.currentTranslation = value;
     this.updateMenu();
     this.updateContent();
     this.updateUrl();
     this.searchComponent.currentTranslation = this.currentTranslation;
    });

    this.bookInfoForm.valueChanges.subscribe(value => {
      this.currentBookInfo = value;
      this.currentChaptersRange = Array(value.chapterLength).fill(null).map((_, index) => index + 1);
      this.currentBookCount = value.counter;
      this.chapterForm.setValue(1);
      this.updateContent();
      this.updateUrl();
    });

    this.chapterForm.valueChanges.subscribe(value => {
      this.selectedChapter = value;
      this.updateContent();
      this.updateUrl();
    });
  }
}
