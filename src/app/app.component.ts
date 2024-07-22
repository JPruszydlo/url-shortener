import { NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, inject } from '@angular/core';
import { ShortenerApiService } from './services/shortener-api.service';
import { UrlModel } from './models/UrlModel';
import { Subject } from 'rxjs';
import { ShortenerComponent } from './shortener/shortener.component';
import { HeaderComponent } from './header/header.component';
import { UrlHistoryComponent } from './url-history/url-history.component';
import { CustomCookieService } from './services/cookies.service';
import { RecaptchaV3Module, ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { InfoboxService } from './services/infobox.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ShortenerComponent,
    HeaderComponent,
    UrlHistoryComponent,
    RecaptchaV3Module,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  currentYear: string = '';
  hostname: string = '';
  title: string = 'url-shortener';
  shortenHistory: UrlModel[] = [];
  refreshHistory: Subject<void> = new Subject<void>();
  cookieConsented: boolean = false;
  recaptchaV3Service: ReCaptchaV3Service = inject(ReCaptchaV3Service);

  constructor(
    private shortenerService: ShortenerApiService,
    private cookies: CustomCookieService,
    private infoboxService: InfoboxService
  ) {
    this.refreshHistory.next();
    this.currentYear = new Date().getFullYear().toString();
  }

  shortenUrl(url: string) {
    this.recaptchaV3Service.execute('shortenurl').subscribe({
      next: (token: string) => {
        this.shortenerService.shortenUrl(url, token).then(
          (shortUrl: string) => {
            this.cookies.setHistory(url, shortUrl);
            this.refreshHistory.next();
          },
          () => {
            this.infoboxService.showMessage('URL not valid, please try again');
          }
        );
      },
      error: (error) => {
        this.infoboxService.showMessage('URL not valid, please try again');
      },
    });
  }
  consentCookie(consented: boolean) {
    this.cookieConsented = true;
    this.cookies.consent(consented);
  }

  ngOnInit(): void {
    this.cookieConsented = this.cookies.isConsented();
    this.hostname = environment.recaptcha.hostName;
  }
}
