import "./App.css";
import {
  TileLayer,
  MapContainer,
  Marker,
  Popup,
  Circle,
  LayersControl,
  LayerGroup,
} from "react-leaflet";
import L from "leaflet";
import { usePosition } from "use-position";
import { point, distance } from "@turf/turf";

import styled from "styled-components";

import "leaflet/dist/leaflet.css";

import {
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const cloudMarker = (color) =>
  L.icon({
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  });

const Map = styled(MapContainer)`
  width: 100vw;
  height: 100vh;
`;

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const CLOUDS = gql`
  query GetClouds {
    clouds(name: "") {
      name
      geoRegion
      geoLatitude
      geoLongitude
      cloudProvider
    }
  }
`;

function fromMyLocation(from, to) {
  var options = { units: "kilometers" };
  return distance(point(from), point(to), options).toFixed(2);
}

function Clouds(props) {
  const colors = {
    google: "green",
    aws: "orange",
    azure: "blue",
    do: "grey",
    upcloud: "yellow",
  };

  return props.data.clouds.map(
    ({ name, geoRegion, geoLatitude, geoLongitude, cloudProvider }) => (
      <>
        {cloudProvider === props.provider && (
          <Marker
            position={[geoLatitude, geoLongitude]}
            icon={cloudMarker(colors[cloudProvider])}
          >
            <Popup>
              {name} <br /> {geoRegion} <br />{" "}
              {fromMyLocation(props.latlon, [geoLatitude, geoLongitude])}{" "}
              kilometers
            </Popup>
          </Marker>
        )}
      </>
    )
  );
}

function Markers() {
  const { loading, error, data } = useQuery(CLOUDS);
  var { latitude, longitude } = usePosition();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  if (!latitude) {latitude = 60.17; longitude = 24.93}

  return (
    <>
      <LayersControl.Overlay name="google" checked>
        <LayerGroup>
          <Clouds
            data={data}
            provider="google"
            latlon={[latitude, longitude]}
          />
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="aws" checked>
        <LayerGroup>
          <Clouds data={data} provider="aws" latlon={[latitude, longitude]} />
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="azure" checked>
        <LayerGroup>
          <Clouds data={data} provider="azure" latlon={[latitude, longitude]} />
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="digital ocean" checked>
        <LayerGroup>
          <Clouds data={data} provider="do" latlon={[latitude, longitude]} />
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="upcloud" checked>
        <LayerGroup>
          <Clouds
            data={data}
            provider="upcloud"
            latlon={[latitude, longitude]}
          />
        </LayerGroup>
      </LayersControl.Overlay>
      <LayersControl.Overlay name="Loaction" checked>
        <Circle
          center={{ lat: latitude, lng: longitude }}
          color="red"
          fillColor="red"
          radius={5000}
        >
          <Popup>Your Location</Popup>
        </Circle>
      </LayersControl.Overlay>
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Map center={[62, 24]} zoom={7}>
          <LayersControl position="topleft" collapsed={false} d>
            <LayersControl.BaseLayer name="openstreetmap" checked={true}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
            </LayersControl.BaseLayer>
            <Markers />
          </LayersControl>
        </Map>
      </div>
    </ApolloProvider>
  );
}

export default App;
