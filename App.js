import React, { Component } from "react";
import { StyleSheet, Text, View, FlatList } from "react-native";
import { MapView } from "expo";
import { Marker, Callout } from "react-native-maps";
import ClusteredMapView from "react-native-maps-super-cluster";

import racks from "./assets/racks.json";

class App extends Component {
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

  render() {
    return (
      <ClusteredMapView
        style={{ flex: 1 }}
        showsUserLocation={true}
        data={racks}
        initialRegion={{
          latitude: 40.6872281,
          longitude: -73.9783627,
          latitudeDelta: 0.2,
          longitudeDelta: 0.2
        }}
        ref={r => {
          this.map = r;
        }}
        renderMarker={this.renderMarker}
        renderCluster={this.renderCluster}
        onLongPress={event =>
          console.log("onpress", event.nativeEvent.coordinate)
        }
      />

      // <View>
      //   <Text>Hello</Text>
      // </View>
    );
    // return (
    //   <View style={styles.container}>
    //     <MapView
    // initialRegion={{
    //   latitude: 40.6872281,
    //   longitude: -73.9783627,
    //   latitudeDelta: 0.2,
    //   longitudeDelta: 0.2
    // }}
    //       showsUserLocation={true}
    //       style={styles.map}
    //     >
    //       {racks.map((marker, i) => (
    //         <MapView.Marker
    //           coordinate={marker.coordinate}
    //           title={marker.name}
    //           description={marker.value}
    //           key={i}
    //         />
    //       ))}
    //     </MapView>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },
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
