import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'
import { environment } from '../../environments/environment'
import { interval } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ShortenerApiService {
  constructor(private http: HttpClient) {}

  shortenUrl(url: string, token: string): Promise<string> {
    return new Promise((response, error) => {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }

      let postUrl = `${environment.apiHostName}/shortener/api?longUrl=${url}`
      this.http.post<string>(postUrl, `\"${token}\"`, httpOptions).subscribe({
        next: (resp: string) => {
          response(resp)
        },
        error: (err) => {
          error(err)
        },
      })
    })
  }
}
