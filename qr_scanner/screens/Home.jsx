import React from 'react';
import {
  Text,
  View,
  Button,
  StyleSheet
} from 'react-native';

const styles = StyleSheet.create({
  button: {
    width: '50%',
    margin: '2%',
  },
});

function Home({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.button}>
        <Button
          title="Generator"
          onPress={() => navigation.navigate('Generator')}
        />
      </View>
      <View style={styles.button}>
        <Button
          title="Scanner"
          onPress={() => navigation.navigate('Scanner')}
        />
      </View>
    </View>
  );
}

export default Home;
