import { Component, EventEmitter, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { InfoboxService } from '../services/infobox.service';

@Component({
  selector: 'app-shortener',
  standalone: true,
  imports: [NgIf, FormsModule],
  providers: [],
  templateUrl: './shortener.component.html',
})
export class ShortenerComponent {
  @Output() shortenUrlEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(private infobox: InfoboxService) {}

  shortenUrl(longUrl: string) {
    if (longUrl == '') {
      this.infobox.showMessage('URL cannot be empty');
      return;
    }
    this.shortenUrlEvent.emit(longUrl);
  }
}
