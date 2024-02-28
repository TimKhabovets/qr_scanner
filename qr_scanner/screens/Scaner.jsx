import React, { useState, useRef } from "react";
import {
  Text,
  View,
  Modal,
  Button
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

const API_KEY = 'a66225f43565d246809e44f1c5c886e8';

function ScanScreen({ navigation }) {
  const [weather, setWeather] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const scannerRef = useRef(null);

  // const saveCitys = async () => {
  //   await AsyncStorage.setItem('citys', JSON.stringify(citys));
  // };

  onRead = async e => {
    if (e.data) {

      // Предполагается, что QR-код содержит строку вида "lat,long"
      const [lat, lon] = e.data.split(',');

      // Получаем погоду для этих координат
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      );

      setWeather(response.data);
      setModalVisible(true);
    }
  };

  const clousePopap = () => {
    setModalVisible(false);
    scannerRef.current.reactivate();
  }


  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner
        ref={scannerRef}
        onRead={onRead}
        flashMode={RNCamera.Constants.FlashMode.off}
        showMarker={true}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {weather && (
            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
              <Text style={{ color: 'black' }}>
                Name: {weather.name}
              </Text>
              <Text style={{ color: 'black' }}>
                Weather: {weather.weather[0].description}, Temperature: {weather.main.temp}K
              </Text>
              <Button
                title="Clouse"
                onPress={() => clousePopap()} />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
}

export default ScanScreen;