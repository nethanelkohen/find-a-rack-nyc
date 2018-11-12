import React, { Component } from "react";
import { StyleSheet, View, Text, AlertIOS, Alert } from "react-native";
import { MapView } from "expo";
import { Marker } from "react-native-maps";
import ClusteredMapView from "react-native-maps-super-cluster";

import { API_KEY, API_URL, LOCAL_URL } from "./config.js";

const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = 0.04;

const initialRegion = {
  latitude: 40.746,
  longitude: -73.987,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      racks: [],
      markerText: null,
      name: null,
      ready: true,
      loading: true
    };
  }

  setRegion(region) {
    let { ready } = this.state;
    if (ready) {
      setTimeout(() => this.map.mapview.animateToRegion(region), 10);
    }
  }

  localEnv = () => {
    if (__DEV__ === true) {
      return fetch(LOCAL_URL);
    } else {
      return fetch(API_URL);
    }
  };

  componentDidMount() {
    this.localEnv()
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
      clusteredPoints = clusteringEngine.getLeaves(clusterId, 10);

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

  reverseGeocode = event => {
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
        this.setState({
          name
        });
      });
  };

  takeInCoord = event => {
    AlertIOS.prompt("How many racks?", null, text => {
      let textCheck = Number(text);
      if (isNaN(textCheck) || textCheck == 0) {
        Alert.alert("Please enter a number greater than 0.");
        return;
      }
      this.reverseGeocode(event);
      this.setState(
        {
          markerText: text
        },
        () => {
          const object = {
            location: {
              latitude: null,
              longitude: null
            },
            name: this.state.name,
            value: `${this.state.markerText} racks`
          };
          object.location.latitude = event.latitude;
          object.location.longitude = event.longitude;
          this.setState({
            racks: [...this.state.racks, object]
          });
        }
      );
    });
  };

  render() {
    return (
      <View>
        {!this.state.loading ? (
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
        ) : null}
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
  }
});

export default App;
