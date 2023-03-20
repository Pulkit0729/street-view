import "./style.css";
import { ImagePanorama, Viewer } from "panolens";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";
import Style from "ol/style/Style";
import Fill from "ol/style/Fill";
import CircleStyle from "ol/style/Circle";

async function readFile() {
  const fileBuffer = new Uint8Array(
    await fetch("./coordinates.txt").then((res) => res.arrayBuffer())
  );
  var enc = new TextDecoder("utf-8");
  const data = enc.decode(fileBuffer).split("\n");
  return data;
}

function createFeatures(data) {
  const features = [];
  for (var i = 0; i < data.length; i++) {
    const datas = data[i].split(" ");
    const feature = new Feature({
      name: "point",
      geometry: new Point(fromLonLat([datas[2], datas[3]])),
    });
    feature.set("panorama", datas[0]);
    features.push(feature);
  }
  return features;
}

const fileData = await readFile();
const features = createFeatures(fileData);

const pointsVectorSource = new VectorSource({
  features,
});

const pointsVectorLayer = new VectorLayer({
  source: pointsVectorSource,
  style: new Style({
    image: new CircleStyle({
      radius: 6,
      fill: new Fill({ color: "red" }),
    }),
  }),
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    pointsVectorLayer,
  ],
  view: new View({
    center: [10.93376479, 50.98380407],
    zoom: 3,
  }),
});

var panoramaContainer = document.getElementById("panorama");
var viewer = new Viewer({ container: panoramaContainer });

// Adding On Click Handler to Maps Points
map.on("click", function (e) {
  var featuresAtPoint = map.getFeaturesAtPixel(e.pixel);
  if (
    featuresAtPoint !== null &&
    featuresAtPoint.length > 0 &&
    featuresAtPoint[0].get("name").localeCompare("point") === 0
  ) {
    var panorama = new ImagePanorama(
      JSON.parse(featuresAtPoint[0].get("panorama"))
    );
    viewer.add(panorama);
    viewer.setPanorama(panorama);
  }
});
