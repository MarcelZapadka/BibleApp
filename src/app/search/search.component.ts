import { Component, ViewChild, Renderer2, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BibleApiService } from 'src/app/bible-api.service';
import { debounceTime, distinctUntilChanged } from 'rxjs'
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BibleSearchedVerseContentInfoDTO } from '../dto';
import { BibleBooksInfo } from '../model';

@Component({
  selector: 'search-verses-component',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @ViewChild('searchContainer') searchContainer: any;
  currentTranslation?: string;
  searchInput: FormControl = new FormControl();
  searchedContent?: any;
  @Output() redirect = new EventEmitter();
  isLoading: boolean = false;
  bookFilterForm: FormControl = new FormControl();
  contentCopy?: any;
  @Input() currentBook?: BibleBooksInfo;

  constructor(
    private renderer: Renderer2,
    private api: BibleApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ){}

  toggleSearch(): void {
    if(this.searchContainer.nativeElement.classList.contains('visible')) {
      this.renderer.removeClass(this.searchContainer.nativeElement, 'visible');
    } else {
      this.renderer.addClass(this.searchContainer.nativeElement, 'visible');
    }
  }
  
  generateSearchHTML(verse: string): string {
    const search = this.searchInput.value;
    return verse.replaceAll(new RegExp(search, 'ig'), `<span class="highilted-searched-text">${search}</span>`);
  }

  // to refactor: 
  async redirectToBible(bookIndex: number, chapterNumber: number) {
    let urlPath: string = `${this.searchedContent[bookIndex].id}/${chapterNumber}`;
    await this.router.navigateByUrl(`${this.currentTranslation}/${urlPath}`);
    this.redirect.emit();
    this.toggleSearch();
  }

  generateCopiedText(book: string, chapter: string, verseNo: number, verseContent: string): any {
    event?.stopPropagation();
    return `‚‚${verseContent}’’ - ${book} ${chapter}:${verseNo}`
  }

  openSnackBar(): void {
    this.snackBar.open("Skopiowano pomyślnie", 'Zamknij', {duration: 2500, horizontalPosition: 'right'})
  }

  filterContent(bookName: string): void {
    if (bookName === "Wszystkie księgi") {
      this.searchedContent = this.contentCopy
    } else {
      this.searchedContent = this.contentCopy.filter((book: BibleSearchedVerseContentInfoDTO) => book.name === bookName)
    }
  }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      if(this.searchInput.value === '' || this.searchInput.value.length < 3) {
        return
      }
      this.api.getSearchedVerse(this.currentTranslation!, value).subscribe(
        content => {
          this.contentCopy = content;
          this.filterContent(this.bookFilterForm.value);
      }, error => {
        console.log(error)
      }, () => {
        this.isLoading = false
      })
    })

    this.bookFilterForm.setValue("Wszystkie księgi");
    this.bookFilterForm.valueChanges.subscribe((bookName: string) => {
      this.filterContent(bookName);
    })
  }
}