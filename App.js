import React from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';

import data from './assets/bikeracks.json';

export default class App extends React.Component {
  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item }) => (
    console.log(item), <ListItem title={item.Name} subtitle={item.Value} />
  );

  render() {
    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={data}
        renderItem={this.renderItem}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
