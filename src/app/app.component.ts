import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BirdTrackMapComponent } from './bird-track-map/bird-track-map.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent  {


  constructor(private http: HttpClient) { }
  
  

  
}


