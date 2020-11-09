import logo from "./logo.svg";
import "./App.css";

import {
  useQuery,
  gql,
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
  cache: new InMemoryCache(),
});

const CLOUDS = gql`
  query GetClouds {clouds(name: "aws") {name geoRegion}}
`;

function Clouds() {
  const { loading, error, data } = useQuery(CLOUDS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.clouds.map(({ name, geoRegion }) => (
    <div key={name}>
      <p>
        {name}: {geoRegion}
      </p>
    </div>
  ));
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <Clouds />
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    </ApolloProvider>
  );
}

export default App;
