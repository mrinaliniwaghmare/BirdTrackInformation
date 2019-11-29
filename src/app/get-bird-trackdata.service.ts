import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class GetBirdTrackdataService {

  constructor(private http: HttpClient) {} 

    getDataForBirdTrackAndRadar() {
      return this.http.get<any>('./assets/7007.geojson');
    }
  
}
