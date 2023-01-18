import { Component, ViewChild, Renderer2, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BibleApiService } from 'src/app/bible-api.service';
import { debounceTime, distinctUntilChanged } from 'rxjs'

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

  constructor(
    private renderer: Renderer2,
    private api: BibleApiService
  ){}

  toggleSearch(): void {
    if(this.searchContainer.nativeElement.classList.contains('visible')) {
      this.renderer.removeClass(this.searchContainer.nativeElement, 'visible');
    } else {
      this.renderer.addClass(this.searchContainer.nativeElement, 'visible');
    }
  }
  
  geterateSearchHTML(verse: string): string {
    const search = this.searchInput.value;
    return verse.replaceAll(new RegExp(search, 'ig'), `<span class="highilted-searched-text">${search}</span>`);
  }

  ngOnInit(): void {
    this.searchInput.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged()
    ).subscribe(value => {
      if(this.searchInput.value === '' || this.searchInput.value.length < 3) {
        return
      }
      this.api.getSearchedVerse(this.currentTranslation!, value).subscribe(content => {
        this.searchedContent = content;
      })
    })
  }
}