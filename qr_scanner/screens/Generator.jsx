import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  Button,
  TextInput
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';

const API_KEY = 'a66225f43565d246809e44f1c5c886e8';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'grey',
    borderWidth: 1,
    borderColor: 'grey'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  clouse: {
    position: 'absolute',
    bottom: 0,
    padding: '4%',
  },
  button: {
    width: '100%',
    paddingBottom: '3%',
    paddingHorizontal: '4%'
  },
  buttonGroup: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    color: 'black',
    width: '48%', // учитывает 3% отступа между полями ввода
    borderColor: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignSelf: 'center',
  },
  name: {
    color: 'black',
    fontSize: 22,
    marginBottom: '3%'
  }
});

function GenerateScreen({ navigation }) {
  const [qrOpenColuse, setQrOpenColuse] = useState(false);
  const [qrItem, setQrItem] = useState({});
  const [createQrOpenClouse, setCreateQrOpenClouse] = useState(false);
  const [x, setX] = useState('');
  const [y, setY] = useState('');

  const [citys, setCitys] = useState([]);

  // Загрузка городов при инициализации
  useEffect(() => {
    const loadCitys = async () => {
      const savedCitys = await AsyncStorage.getItem('citys');
      if (savedCitys) {
        setCitys(JSON.parse(savedCitys));
      }
    };

    loadCitys();
  }, []);

  // Сохранение городов при обновлении
  useEffect(() => {
    const saveCitys = async () => {
      await AsyncStorage.setItem('citys', JSON.stringify(citys));
    };

    saveCitys();
  }, [citys]);

  const createQr = async (item) => {
    if (!item) {
      const response = await axios.get(
        `http://api.openweathermap.org/data/2.5/weather?lat=${x}&lon=${y}&appid=${API_KEY}`
      );
      if (!response) {
        // вывести сообщение об ошибке
      }
      setQrItem({
        name: response.data.name,
        value: x + ',' + y, 
        weather: response.data.weather[0].description,
        temp: response.data.main.temp
      })
    } else {
      setQrItem(item);
    }
    setQrOpenColuse(true);
  }

  const clousePopap = () => {
    setQrOpenColuse(false);
    setCreateQrOpenClouse(false);
    setQrItem({});
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={styles.container}>
        <FlatList
          data={citys}
          renderItem={({ item }) => <Text style={styles.item} onPress={() => createQr(item)}>{item.name}</Text>}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={qrOpenColuse}
        onRequestClose={() => {
          setQrOpenColuse(!qrOpenColuse);
        }}
      >
        <View style={styles.modalContainer}>
          <Text style={{ color: 'black' }}>
            Name: {qrItem.name || ''}
          </Text>
          <Text style={{ color: 'black' }}>
            Weather: {qrItem.weather}, Temperature: {qrItem.temp}K
          </Text>
          <QRCode
            value={qrItem.value}
            size={300}
          />
          <View style={styles.buttonGroup}>
            {Object.keys(qrItem).length !== 0 ? <View style={styles.button}>
              <Button
                title="Save"
                color='green'
                onPress={() => {
                  setCitys([...citys, qrItem]);
                  setQrOpenColuse(false);
                  setCreateQrOpenClouse(false);
                  console.log(qrItem);
                }}
              />
            </View> : null}
            <View style={styles.button}>
              <Button
                title="Clouse"
                onPress={() => clousePopap()}
              />
            </View>
          </View>
        </View>
      </Modal>

      <View style={styles.button}>
        <Button
          title="Create QR"
          onPress={() => setCreateQrOpenClouse(true)}
        // onPress={() => clousePopap()}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={createQrOpenClouse}
        onRequestClose={() => {
          setCreateQrOpenClouse(!createQrOpenClouse);
        }}
      >
        <View style={styles.modalContainer}>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={setX}
              value={x}
              placeholder="Set let"
              placeholderTextColor='grey'
            />
            <TextInput
              style={styles.input}
              onChangeText={setY}
              value={y}
              placeholder="Set long"
              placeholderTextColor='grey'
            />
          </View>
          <View style={styles.buttonGroup}>
            <View style={styles.button}>
              <Button
                color='green'
                title="Create"
                onPress={() => createQr()}
              />
            </View>
            <View style={styles.button}>
              <Button
                title="Clouse"
                onPress={() => setCreateQrOpenClouse(false)}
              // onPress={() => clousePopap()}
              />
            </View>
          </View>


        </View>
      </Modal>

    </View>
  );
}
export default GenerateScreen;