import React, { Component } from "react";
import { StyleSheet, View, Text, AlertIOS, Alert } from "react-native";
import { MapView } from "expo";
import { Marker } from "react-native-maps";
import ClusteredMapView from "react-native-maps-super-cluster";

import racks from "./assets/racks.json";

const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = 0.04;

const initialRegion = {
  latitude: 40.7147077,
  longitude: -74.1443402,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      racks,
      markerText: null,
      ready: true
    };
  }

  setRegion(region) {
    let { ready } = this.state;
    if (ready) {
      setTimeout(() => this.map.mapview.animateToRegion(region), 10);
    }
  }

  componentDidMount() {
    this.getCurrentPosition();
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

  takeInCoord = event => {
    AlertIOS.prompt("How many racks?", null, text => {
      let textCheck = Number(text);
      if (isNaN(textCheck)) {
        Alert.alert("Please enter a number.");
        return;
      }
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
            name: "USER-GENERATED MARKER",
            value: `${this.state.markerText} racks`
          };
          object.location.latitude = event.latitude;
          object.location.longitude = event.longitude;
          this.setState({ racks: [...this.state.racks, object] });
        }
      );
    });
  };

  render() {
    return (
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
        onLongPress={event => this.takeInCoord(event.nativeEvent.coordinate)}
        style={StyleSheet.absoluteFill}
      />
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
