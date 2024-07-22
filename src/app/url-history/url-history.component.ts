import { NgFor, NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UrlHistoryModel } from '../models/UrlModel';
import { Observable, Subject, Subscription } from 'rxjs';
import { CustomCookieService } from '../services/cookies.service';
import { QrCodeComponent, QrCodeModule } from 'ng-qrcode';
import { InfoboxService } from '../services/infobox.service';

@Component({
  selector: 'app-url-history',
  standalone: true,
  imports: [NgFor, NgIf, QrCodeModule],
  templateUrl: './url-history.component.html',
  styleUrl: './url-history.component.css',
})
export class UrlHistoryComponent implements OnInit, OnDestroy {
  urlHistory: UrlHistoryModel[] = [];
  qrCodeUrl: string = '';

  private refreshEventSubscription: Subscription = new Subscription();
  @Input() refreshEvent: Observable<void> = new Observable<void>();

  constructor(
    private cookieService: CustomCookieService,
    private qrCode: QrCodeModule,
    private infobox: InfoboxService
  ) {}

  getLongUrl(url: string) {
    if (url.length > 70) {
      url = url.slice(0, 50) + '...';
    }
    return url;
  }
  copyToClipboard(shortUrl: string) {
    this.infobox.showMessage('URL copied to clipboard!');
    navigator.clipboard.writeText(shortUrl);
  }
  ngOnInit(): void {
    document.onkeyup = (e) => {
      if (e.key === 'Escape') this.qrCodeUrl = '';
    };
    this.urlHistory = this.cookieService.getHistory();

    this.refreshEventSubscription = this.refreshEvent.subscribe(() => {
      this.urlHistory = this.cookieService.getHistory();
    });
  }
  ngOnDestroy(): void {
    this.refreshEventSubscription.unsubscribe();
  }

  deleteCookie(longUrl: string) {
    if (!confirm('Do you really want to delete?')) {
      return;
    }
    this.cookieService.deleteCookie(longUrl);
    this.ngOnInit();
  }

  saveAsImage(url: QrCodeComponent) {
    let qrCode = document.getElementsByTagName('canvas')[0];
    let img = qrCode.toDataURL('img/png');
    let link = document.createElement('a');
    link.href = img;
    if (url.value !== undefined)
      link.download = url.value.split('/').at(-1) ?? 'QrCode';
    link.click();
  }
}
