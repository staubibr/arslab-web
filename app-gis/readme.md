# GIS Simulation Explorer

## Getting Started (Users):
[![Demo CountPages alpha](/app-gis/demo.gif)](https://youtu.be/liGqAIcnNUo)
- Open the [GIS Simulation Explorer](https://staubibr.github.io/arslab-dev/app-gis/index.html) in Chrome 
- OpenStreetMap will automatically load the world map
- Insert your simulation results (txt)
- Insert your GeoJSON layer to the map 
- Once everything appears to be loaded, you may cycle through different timestamps of the SIR simulation and view attributes by clicking census subdivisions


## Getting Started (Developers):
Essentials:
- Download [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb)
- Open [app-gis](https://github.com/staubibr/arslab-dev/tree/master/app-gis) in your preferred text editor 

Running the local server:
> Open Chrome and go to Apps

>> Click Web Server

>>> Set the current folder to /arslab-dev 

>>>> Open Web Server for Chrome by clicking the Web Server URL

![Web Server.](/app-gis/webserver.png "Web Server image.")

Development:
- In `./app-gis/`, there are many folders and files to choose from
  - Folder `./app-gis/classes` contains class level functions
  - Folder `./app-gis/widgets` contains code for UI operations
  - Folder `./app-gis/data` has sample data 
  - Folder `./app-gis/ol` contains OpenLayers packages. 
    - OpenLayers can be easily bundled with gis applications through Rollup, Webpack, etc. 
  - File `app-gis/application.js` contains a bulk of the work needed to run the gis application

## TODO:

- Allow users to upload their `.geojson` and `.txt` files at once instead of one at a time
  - Run multiple simulations, each with their own simulation cycler and legends
- Let users change scale/legend colours
- Let users decide where the center of the map is or maybe setup a "go-to x location" 
- Let users download simulation log 
- Let users video record the simulation

## Resources:

[Spatial references](https://spatialreference.org/ref/epsg/)

[ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)  

[D3 Legend](https://github.com/susielu/d3-legend)  

[D3 Scale](https://github.com/d3/d3-scale)

[ol.layer.Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)

[ol.OverLay](https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html)

[Event References](https://developer.mozilla.org/en-US/docs/Web/Events)