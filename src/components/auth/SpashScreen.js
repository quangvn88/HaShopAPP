import * as React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Image
} from 'react-native';

export function SplashScreen() {
  return (
    <View style={styles.containerImage}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Image style={styles.image} source={require('../../assets/Splash.jpg')}></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  containerImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  image: {
    width: 170,
    height: 150
  }
});