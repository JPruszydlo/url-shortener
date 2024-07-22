import { Injectable } from '@angular/core';
import { UrlHistoryModel, UrlModel } from '../models/UrlModel';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class CustomCookieService {
  private urlHistoryKey = 'ShortenHistory';
  private consentedKey = 'Consented';

  private historyLimit = 3;
  cookiesAccepted: boolean = false;
  constructor(private ngxCookieService: CookieService) {}

  setHistory(longUrl: string, shortUrl: string) {
    let history = [];
    let historyStr = this.getCookie(this.urlHistoryKey);
    if (historyStr == '') {
      history.push({ long: longUrl, short: shortUrl, createdAt: Date.now() });
      this.setCookie(this.urlHistoryKey, JSON.stringify(history));
    } else {
      history = JSON.parse(this.getCookie(this.urlHistoryKey));
    }
    if (history.length >= this.historyLimit) {
      history.splice(0, 1);
    }
    if (
      history.findIndex((url: UrlHistoryModel) => {
        return url.long == longUrl;
      }) > -1
    )
      return;

    history.push({ long: longUrl, short: shortUrl, createdAt: Date.now() });
    this.setCookie(this.urlHistoryKey, JSON.stringify(history));
  }

  getHistory(): UrlHistoryModel[] {
    let history = this.getCookie(this.urlHistoryKey);
    if (history != '') {
      let result = JSON.parse(history);
      result.sort((a: UrlHistoryModel, b: UrlHistoryModel) => {
        return b.createdAt - a.createdAt;
      });
      return result;
    }
    return [];
  }

  deleteCookie(key: string) {
    let history = this.getHistory();
    let idx = history.findIndex((urlModel: UrlHistoryModel) => {
      return urlModel.long == key;
    });
    if (idx < 0) return;
    history.splice(idx, 1);

    if (this.cookiesAccepted) this.ngxCookieService.delete(this.urlHistoryKey);
    else window.sessionStorage.clear();
    this.setCookie(this.urlHistoryKey, JSON.stringify(history));
  }

  checkIfUrlExists(url: string): boolean {
    let history = this.getHistory();
    let idx = history.findIndex((urlModel: UrlHistoryModel) => {
      return urlModel.long == url;
    });
    if (idx < 0) return false;
    return true;
  }

  setCookie(key: string, val: string) {
    if (this.cookiesAccepted) {
      let expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() + 30);
      this.ngxCookieService.set(key, val, expiredDate);
      return;
    }
    window.sessionStorage.setItem(key, val);
  }
  getCookie(key: string): string {
    if (this.cookiesAccepted) {
      return this.ngxCookieService.get(key);
    }
    return window.sessionStorage.getItem(key) ?? '';
  }

  consent(consented: boolean) {
    if (consented) {
      this.cookiesAccepted = true;
      this.setCookie(this.consentedKey, 'true');
      return;
    }
    this.ngxCookieService.deleteAll();
    this.setCookie(this.consentedKey, 'true');
  }

  isConsented(): boolean {
    if (this.ngxCookieService.get(this.consentedKey) != '') {
      this.cookiesAccepted = true;
      return true;
    }
    if (window.sessionStorage.getItem(this.consentedKey) != null) {
      return true;
    }
    return false;
  }
}
