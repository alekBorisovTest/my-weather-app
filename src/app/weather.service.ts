import { HttpClient, HttpParams } from '@angular/common/http';

import { ICurrentWeather } from './icurrent-weather';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

export interface ICurrentWeatherData {
  "weather": [
    {
      "main": "Clear",
      "description": "clear sky",
      "icon": "01d"
    }
  ],
  "main": {
    "temp": 282.55
  },
  "sys": {
    "country": "UK"
  },
  "name": "London",
  "dt": 1560350645,
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient: HttpClient) { }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return kelvin * 9 / 5 - 459.67
  }

  private transformToICurrentWeather(data: ICurrentWeatherData) {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description
    }
  }

  getCurrentWeather(city: string) : Observable<ICurrentWeather> {
    // const request = `${environment.apiUrl}weather?q=${city}&appId=${environment.apiKey}`;
    // console.log(`http request = ${request}`);
    const uriParams = new HttpParams()
      .set('q', `${city}`)
      .set('appId', `${environment.apiKey}`);
    return this.httpClient
    .get<ICurrentWeatherData>(`${environment.apiUrl}weather`, { params: uriParams })
    .pipe(map(data => this.transformToICurrentWeather(data)));

  }
}
