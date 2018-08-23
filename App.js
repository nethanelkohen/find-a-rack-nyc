import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { MapView } from 'expo';
import { ListItem } from 'react-native-elements';

import racks from './assets/bikeracks.json';

class App extends Component {
  // keyExtractor = (item, index) => index.toString();
  //
  // renderItem = ({ item }) => (
  //   console.log(item), <ListItem title={item.Name} subtitle={item.Value} />
  // );

  render() {
    return (
      // <FlatList
      //   keyExtractor={this.keyExtractor}
      //   data={racks}
      //   renderItem={this.renderItem}
      // />
      <View style={styles.container}>
        <MapView
          initialRegion={{
            latitude: 40.6872281,
            longitude: -73.9783627,
            latitudeDelta: 0.2,
            longitudeDelta: 0.2
          }}
          showsUserLocation={true}
          style={styles.map}
        >
          {racks.map((marker, i) => (
            <MapView.Marker
              coordinate={marker.coordinate}
              title={marker.name}
              description={marker.value}
              key={i}
            />
          ))}
        </MapView>
      </View>
    );
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
