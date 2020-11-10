import "./App.css";
import { TileLayer, MapContainer, Marker, Popup, Circle } from "react-leaflet";
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
      <Marker
        position={[geoLatitude, geoLongitude]}
        icon={cloudMarker(colors[cloudProvider])}
      >
        <Popup>
          {name} <br /> {geoRegion} <br /> {fromMyLocation(props.latlon, [geoLatitude, geoLongitude])} kilometers
        </Popup>
      </Marker>
    )
  );
}

function Markers() {
  const { loading, error, data } = useQuery(CLOUDS);
  const { latitude, longitude } = usePosition();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <>
      <Clouds data={data} latlon={[latitude, longitude]} />
      <Circle
        center={{ lat: latitude, lng: longitude }}
        color="red"
        fillColor="red"
        radius={5000}
      >
        <Popup>Your Location</Popup>
      </Circle>
    </>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <Map center={[62, 24]} zoom={7}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <Markers />
        </Map>
      </div>
    </ApolloProvider>
  );
}

export default App;
