import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { MapView } from 'expo';
import { ListItem } from 'react-native-elements';

import data from './assets/bikeracks-old.json';

const racks = [
  {
    name: '1 7 AV S',
    Address: '1 7 AV S, New York, NY 10014, USA',
    value: '5 racks',
    'coordinate': {
      'latitude': 40.729711,
      'longitude': -74.004858
    }
  },
  {
    name: '1 BOERUM PL',
    Address: '1 BOERUM PL, Brooklyn, NY 11201, USA',
    value: '1 rack',
    'coordinate': { 'latitude': 40.691758, 'longitude': -73.988892 }
  },
  {
    name: '1 CENTRE ST',
    Address: '1 CENTRE ST, New York, NY 10007, USA',
    value: '10 racks',
    coordinate: { 'latitude': 40.712931, 'longitude': -74.003748 }
  }
];

class App extends Component {
  state = {
    racks: [data]
  };
  // keyExtractor = (item, index) => index.toString();
  //
  // renderItem = ({ item }) => (
  //   console.log(item), <ListItem title={item.Name} subtitle={item.Value} />
  // );

 

  render() {
    return (
      // <FlatList
      //   keyExtractor={this.keyExtractor}
      //   data={data}
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
