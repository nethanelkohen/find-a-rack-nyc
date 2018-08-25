import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { MapView } from 'expo';
import { Marker, Callout } from 'react-native-maps';
import ClusteredMapView from 'react-native-maps-super-cluster';

import racks from './assets/racks.json';

class App extends Component {
  renderCluster = (cluster, onPress) => {
    const pointCount = cluster.pointCount,
      coordinate = cluster.coordinate,
      clusterId = cluster.clusterId;

    const clusteringEngine = this.map.getClusteringEngine(),
      clusteredPoints = clusteringEngine.getLeaves(clusterId, 100);

    return (
      <Marker coordinate={coordinate}>
        <View style={{ flex: 1 }}>
          <Text>{pointCount}</Text>
        </View>
      </Marker>
    );
  };

  renderMarker = data => (
    <Marker key={Math.random()} coordinate={data.location} />
  );

  render() {
    return (
      <ClusteredMapView
        style={{ flex: 1 }}
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});

export default App;
