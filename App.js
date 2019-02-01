import React, { Component } from "react";
import { StyleSheet, View, Text, AlertIOS, Alert } from "react-native";
import { MapView } from "expo";
import { Marker } from "react-native-maps";
import ClusteredMapView from "react-native-maps-super-cluster";
import { SkypeIndicator } from "react-native-indicators";

import { API_KEY, GET_URL, POST_URL, LOCAL_GET, LOCAL_POST } from "./config.js";

const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = 0.04;

const initialRegion = {
  latitude: 40.746,
  longitude: -73.86,
  latitudeDelta: 0.4,
  longitudeDelta: 0.4
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      racks: [],
      ready: true,
      loading: true,
      time: true
    };
  }

  setRegion(region) {
    let { ready } = this.state;
    if (ready) {
      setTimeout(() => this.map.mapview.animateToRegion(region), 10);
    }
  }

  getEnv = env => {
    let dev = __DEV__ === true;
    switch (env) {
      case "get":
        if (dev) {
          return fetch(LOCAL_GET);
        }
        return fetch(GET_URL);
        break;
      case "post":
        if (dev) {
          return LOCAL_POST;
        }
        return POST_URL;
        break;
      default:
        break;
    }
  };

  componentDidMount() {
    this.getEnv("get")
      .then(response => response.json())
      .then(res => {
        res.response.map(v => {
          v.location = Object.assign({}, v);
          delete v.latitude;
          delete v.longitude;
          delete v.location.address;
          delete v.location.name;
          delete v.location.value;
        });

        this.setState({ racks: res.response, loading: false });
        setTimeout(() => {
          this.setState({
            time: false
          });
        }, 4000);
      });
    // this.getCurrentPosition();
  }

  getCurrentPosition() {
    try {
      navigator.geolocation.getCurrentPosition(
        position => {
          const region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          };
          this.setRegion(region);
        },
        error => {
          switch (error.code) {
            case 1:
              if (Platform.OS === "ios") {
                Alert.alert(
                  "",
                  "To locate your location enable permission for the application in Settings - Privacy - Location"
                );
              } else {
                Alert.alert(
                  "",
                  "To locate your location enable permission for the application in Settings - Apps - ExampleApp - Location"
                );
              }
              break;
            default:
              Alert.alert("", "There was an error fetching your location");
          }
        }
      );
    } catch (e) {
      Alert.alert(e.message || "");
    }
  }

  onMapReady = e => {
    if (!this.state.ready) {
      this.setState({ ready: true });
    }
  };

  onRegionChange = region => {
    // console.log("onRegionChange", region);
  };

  onRegionChangeComplete = region => {
    // console.log("onRegionChangeComplete", region);
  };

  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    const clusteringEngine = this.map.getClusteringEngine(),
      clusteredPoints = clusteringEngine.getLeaves(clusterId, 100);

    return (
      <Marker coordinate={coordinate} onPress={onPress}>
        <View style={styles.clusterContainer}>
          <Text style={styles.clusterText}>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  renderMarker = data => (
    <Marker
      key={Math.random()}
      coordinate={data.location}
      title={data.name}
      description={data.value}
    />
  );

  reverseGeocode = async event => {
    let latLng = `${event.latitude},${event.longitude}`;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${API_KEY}`,
      {}
    );

    const data = await response.json();
    let name = `${data.results[0].address_components[0].long_name} ${
      data.results[0].address_components[1].long_name
    }`.toUpperCase();

    return name;
  };

  takeInCoord = async event => {
    AlertIOS.prompt("How many racks?", null, text => {
      let textCheck = Number(text);
      if (isNaN(textCheck) || textCheck == 0 || textCheck > 15) {
        Alert.alert("Please enter a number greater than 0 and less than 15.");
        return;
      }
      const value = textCheck == 1 ? `${textCheck} rack` : `${textCheck} racks`;

      let latLng = `${event.latitude},${event.longitude}`;

      fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng}&key=${API_KEY}`
      )
        .then(res => {
          return res.json();
        })
        .then(data => {
          let name = `${data.results[0].address_components[0].long_name} ${
            data.results[0].address_components[1].long_name
          }`.toUpperCase();

          const object = {
            location: {
              latitude: event.latitude,
              longitude: event.longitude
            },
            name,
            value
          };

          this.setState({
            racks: [...this.state.racks, object]
          });

          this.databaseSend(object);
        });
    });
  };

  databaseSend = object => {
    const body = {
      latitude: object.location.latitude,
      longitude: object.location.longitude,
      name: object.name,
      address: "USER GENERATED MARKER",
      value: object.value
    };

    let url = this.getEnv("post");

    fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, cors, *same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin", // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json; charset=utf-8"
        // "Content-Type": "application/x-www-form-urlencoded"
      },
      redirect: "follow", // manual, *follow, error
      referrer: "no-referrer", // no-referrer, *client
      body: JSON.stringify(body) // body data type must match "Content-Type" header
    })
      // .then(data => console.log(JSON.stringify(data))) // JSON-string from `response.json()` call
      .catch(error => console.error(error));
  };

  render() {

    return (
      <View>
        {!this.state.loading && !this.state.time ? (
          <ClusteredMapView
            showsUserLocation
            data={this.state.racks}
            onMapReady={this.onMapReady}
            initialRegion={initialRegion}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
            ref={r => {
              this.map = r;
            }}
            renderMarker={this.renderMarker}
            renderCluster={this.renderCluster}
            onLongPress={event =>
              this.takeInCoord(event.nativeEvent.coordinate)
            }
            style={StyleSheet.absoluteFill}
          />
        ) : (
          <View style={styles.container}>
            <Text style={styles.titleText}>Find-a-Rack NYC</Text>
            <SkypeIndicator
              style={styles.horizontal}
              color="#0000ff"
              size={200}
            />
            <Text style={styles.loadingText}>Hold down to add a marker</Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  clusterContainer: {
    width: 35,
    height: 35,
    padding: 3,
    borderWidth: 1,
    borderRadius: 15,
    alignItems: "center",
    borderColor: "#65bc46",
    justifyContent: "center",
    backgroundColor: "white"
  },
  clusterText: {
    fontSize: 13,
    color: "#65bc46",
    fontWeight: "500",
    textAlign: "center"
  },
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%"
  },
  horizontal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Arial",
    marginTop: 100
  },
  loadingText: {
    fontSize: 30,
    fontWeight: "bold",
    fontFamily: "Arial",
    marginBottom: 100
  }
});

export default App;
