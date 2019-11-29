import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import GeoJSON from 'ol/format/GeoJSON';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Feature from 'ol/Feature';
import { Icon } from 'ol/style'
import Point from 'ol/geom/Point';
import { buffer } from 'ol/extent';
import { transform } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import { GetBirdTrackdataService } from '../get-bird-trackdata.service';

@Component({
  selector: 'app-bird-track-map',
  templateUrl: './bird-track-map.component.html',
  styleUrls: ['./bird-track-map.component.css']
})
export class BirdTrackMapComponent implements OnInit {

  map: Map;
  constructor(public getBirdTrackdataService: GetBirdTrackdataService) { }
  defaultBaseLayer;
  vectorSource;
  vectorLayer;
  trackLayer;
  iconLayer;
  trackCoordinateLayer;
  ngOnInit() {
    this.getBirdTrackdataService.getDataForBirdTrackAndRadar().subscribe(data => {
      this.defaultBaseLayer = data;
      this.createMapVectorLayer();
      this.createRadarIconLayer();
      this.createBirdTrackCoordinates();
      this.createbirdTrackLayer();
      let bufferedExtent =  this.cropMapAtTenKm();
      this.map = new Map({
        layers: [
          new TileLayer({
            source: new OSM()
          }),
          this.vectorLayer,
          this.iconLayer,
          this.trackCoordinateLayer,
          this.trackLayer
        ],
        target: 'map',
        view: new View({
          center: transform(this.defaultBaseLayer.features[0].geometry.coordinates, 'EPSG:4326', 'EPSG:3857'),
          extent: bufferedExtent,
          zoom: 2,
        })
      });
      this.map.on('singleclick', function (evt) {
        console.log(evt.coordinate);
      });
    });
  }

  ngAfterViewInit() {
  }

  createMapVectorLayer() {
    this.vectorSource = new VectorSource({
      features: (new GeoJSON()).readFeatures(this.defaultBaseLayer)
    });
    this.vectorLayer = new VectorLayer({
      source: this.vectorSource,
      style: this.styleFunction
    });
  }

  createRadarIconLayer() {
    let iconFeature = new Feature({
      geometry: new Point(transform(this.defaultBaseLayer.features[0].geometry.coordinates, 'EPSG:4326', 'EPSG:3857')),
      name: 'Null Island',
      population: 4000,
      rainfall: 500
    });

    let iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 46],
        anchorXUnits: 'fraction',
        anchorYUnits: 'pixels',
        src: './assets/radar.png'
      })
    });

    iconFeature.setStyle(iconStyle);

    let vectorSource = new VectorSource({
      features: [iconFeature]
    });
    
    this.iconLayer = new VectorLayer({
      source: vectorSource
    });
  }

  createbirdTrackLayer() {
    let vectorSource;
    vectorSource = new VectorSource({
      features: []
    });
    let i;
    for (i = 1; i < this.defaultBaseLayer.features.length - 1; i++) {

      let points = new Array(
        new Point(transform(this.defaultBaseLayer.features[i].geometry.coordinates, 'EPSG:4326', 'EPSG:3857')),
        new Point(transform(this.defaultBaseLayer.features[i + 1].geometry.coordinates, 'EPSG:4326', 'EPSG:3857'))
      )
      let pointCoordinates = new Array(
        points[0].flatCoordinates,
        points[1].flatCoordinates
      )
      
      let singleTrackFeature = new Feature({
        geometry: new LineString(pointCoordinates)
      });

      singleTrackFeature.setStyle(this.styleFunction);
    
      vectorSource.addFeature(singleTrackFeature);
    }

    this.trackLayer = new VectorLayer({
      source: vectorSource
    });
  }

  createBirdTrackCoordinates() {
    let vectorSource = new VectorSource({
      features: []
    });
    let i;
    for (i = 1; i < this.defaultBaseLayer.features.length - 1; i++) {
      let singleTrackFeature = new Feature({
        geometry: new Point(transform(this.defaultBaseLayer.features[i].geometry.coordinates, 'EPSG:4326', 'EPSG:3857')),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      });
      singleTrackFeature.setStyle(this.styleFunction);
      vectorSource.addFeature(singleTrackFeature);
    }
    this.trackCoordinateLayer = new VectorLayer({
      source: vectorSource
    });
  }

  cropMapAtTenKm(){
    let pointFeature = new Feature(
      new Point(transform(this.defaultBaseLayer.features[0].geometry.coordinates, 'EPSG:4326', 'EPSG:3857'))
    );
    let poitnExtent = pointFeature.getGeometry().getExtent();
    let bufferedExtent;
    return bufferedExtent = new buffer(poitnExtent, 10000);
  }

  styleFunction(event) {
    let image = new CircleStyle({
      radius: 5,
      fill: null,
      stroke: new Stroke({ color: 'red', width: 1 })
    });

    let styles = {
      'Point': new Style({
        image: image
      }),
      'LineString': new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1
        })
      }),
      'MultiLineString': new Style({
        stroke: new Stroke({
          color: 'green',
          width: 1
        })
      }),
      'MultiPoint': new Style({
        image: image
      }),
      'MultiPolygon': new Style({
        stroke: new Stroke({
          color: 'yellow',
          width: 1
        }),
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.1)'
        })
      }),
      'Polygon': new Style({
        stroke: new Stroke({
          color: 'blue',
          lineDash: [4],
          width: 3
        }),
        fill: new Fill({
          color: 'rgba(0, 0, 255, 0.1)'
        })
      }),
      'GeometryCollection': new Style({
        stroke: new Stroke({
          color: 'magenta',
          width: 2
        }),
        fill: new Fill({
          color: 'magenta'
        }),
        image: new CircleStyle({
          radius: 10,
          fill: null,
          stroke: new Stroke({
            color: 'magenta'
          })
        })
      }),
      'Circle': new Style({
        stroke: new Stroke({
          color: 'red',
          width: 2
        }),
        fill: new Fill({
          color: 'rgba(255,0,0,0.2)'
        })
      })

    };
    return styles[event.getGeometry().getType()];
  }

}
