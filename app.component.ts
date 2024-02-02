// app.component.ts
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  numberOfCards: number = 1;
  rowsCols: number = 1;
  bingoCards: string[][][] = [];

  constructor(private http: HttpClient) {}

  isValidInput(): boolean {
    return this.numberOfCards > 0 && this.rowsCols > 0;
  }

  generateBingoCards(): void {
    this.bingoCards = [];
    
    for (let i = 0; i < this.numberOfCards; i++) {
      this.getRandomDogBreeds(this.rowsCols * this.rowsCols)
        .subscribe((breeds: string[]) => {
          const uniqueBreeds = Array.from(new Set(breeds));
          const card: string[][] = [];

          for (let row = 0; row < this.rowsCols; row++) {
            const startIdx = row * this.rowsCols;
            const endIdx = startIdx + this.rowsCols;
            card.push(uniqueBreeds.slice(startIdx, endIdx));
          }

          this.bingoCards.push(card);
        });
    }
  }

  getRandomDogBreeds(count: number): Observable<string[]> {
    const dogApiUrl = 'https://dog.ceo/api/breeds/list/random/';
    return this.http.get<{ message: string[] }>(`${dogApiUrl}${count}`)
      .pipe(
        map(response => response.message)
      );
  }

  showRandomDogImage(breed: string): void {
    this.getRandomDogImage(breed)
      .subscribe((imageUrl: string) => {
        window.location.href = imageUrl;// Opens the image in a new tab
      });
  }

  getRandomDogImage(breed: string): Observable<string> {
    const dogImageApiUrl = `https://dog.ceo/api/breed/${breed}/images/random`;
    return this.http.get<{ message: string }>(dogImageApiUrl)
      .pipe(
        map(response => response.message)
      );
  }
}
