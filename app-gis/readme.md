# GIS Simulation Explorer

**NOTE:** This simulator does not accept user file uploading yet. Currently, the simulator only uses data that is retrieved from `./app-gis/data/` (developers) or GitHub (users).

## Getting Started (Users):
- Open the [GIS Simulation Explorer](https://staubibr.github.io/arslab-dev/app-gis/index.html) in Chrome 
- Wait for OpenStreetMap to load the world map
- Wait for Ontario's vector layer to load onto the world map
- Once everything appears to be loaded, you may cycle through different timestamps of the SIR simulation 


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
- In `./app-gis/`,...

##TODO:

- Make an instructional video for users
- Allow users to run their uploaded `.geojson` and `.txt` 
- Run multiple simulations, each with their own simulation cycler
- Let users change scale/legend colours
- Let users download simulation log 
- Add video recording

## Resources:

[Spatial references](https://spatialreference.org/ref/epsg/)

[ol.Map](https://openlayers.org/en/latest/apidoc/module-ol_Map-Map.html)  

[D3 Legend](https://github.com/susielu/d3-legend)  

[D3 Scale](https://github.com/d3/d3-scale)

[ol.layer.Vector](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html)