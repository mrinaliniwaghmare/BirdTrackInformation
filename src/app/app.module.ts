import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppComponent } from './app.component';
import { BirdTrackMapComponent } from './bird-track-map/bird-track-map.component';
import { GetBirdTrackdataService } from './get-bird-trackdata.service';

@NgModule({
    declarations: [
        AppComponent,
        BirdTrackMapComponent
    ],
    imports: [
        BrowserModule,
        LeafletModule,
        HttpClientModule
    ],
    providers: [GetBirdTrackdataService],
    bootstrap: [AppComponent]
})
export class AppModule { }
