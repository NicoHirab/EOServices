import * as React from 'react';
import { Platform, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements/dist/buttons/Button';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import ActionButton from '../components/ActionButton';
import ActionButtonSecondary from '../components/ActionButtonSecondary';
import { useEffect, useState } from 'react';
import { Picker } from '@react-native-community/picker';
import { Icon } from 'react-native-elements';
import {Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import StepIndicator from '../components/stepIndicator';
const { height } = Dimensions.get('window');

const itemType = "Items";
const serviceType = "Services"
const servTypeSell = "sell"
const servTypeBuy = "buy"

export default function AddPostScreen() {
  const [step, setStep] = useState(1)
  const [selectedServType, setSelectedServType] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [material, setMaterial] = useState('');

  const [image, setImage] = useState('');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  if(step == 1) 
    return (
    <View style={styles.container}>
      <StepIndicator title="Step" step={step} stepMax={3}></StepIndicator>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.innerContainer}>
        <Text style={styles.subTitle}>You are intersted in...</Text>
        <View style={styles.buttonContainer}>
          <ActionButtonSecondary  title="Looking For" styleContainer={selectedServType == servTypeSell ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}} styleText={selectedServType == servTypeSell ? {color: 'white'} : {color: '#04B388'}} onPress={() => {setSelectedServType(servTypeSell)}}></ActionButtonSecondary>
            <ActionButtonSecondary styleContainer={[{marginTop: 30}, selectedServType == servTypeBuy ? {backgroundColor: '#04B388'} : {backgroundColor: 'white'}]} styleText={selectedServType == servTypeBuy ? {color: 'white'} : {color: '#04B388'}} title="Offering" onPress={() => {setSelectedServType(servTypeBuy)}}></ActionButtonSecondary>
        </View>
        <ActionButton title="Next" styleContainer={[{justifySelf: 'flex-end', margin:50}]} onPress={() => {setStep(2); console.log(step)}}></ActionButton>
      </View>
    </View>
    );
    else if (step == 2)
        return(
          <View style={styles.container}>
          <StepIndicator title="Step" step={step} stepMax={3}></StepIndicator>
          <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
          <View style={styles.innerContainer}>
            <Text style={styles.subTitle}>Details</Text>
            <View style={styles.buttonContainer}>
              <Text style={styles.inputLabel}>Categorie</Text>
              <Picker mode="dropdown" style={styles.buttonStyle} selectedValue={selectedCat} onValueChange={(itemValue, itemIndex) => setSelectedCat(itemValue.toString())}>
                <Picker.Item label="Cat1" value="cat1"/>
                <Picker.Item label="Cat2" value="cat2"/>
                <Picker.Item label="Cat3" value="cat3"/>
              </Picker>
              <ActionButtonSecondary title="Add photos" styleContainer={{marginTop: 30}} onPress={pickImage}></ActionButtonSecondary>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Price</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={price}
                  onChangeText={(text: string) => setPrice(text.replace(/[^0-9]/g, ''))}
                />
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={description}
                  onChangeText={(text: string) => setDescription(text)}
                />
              </View>
             <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Material required</Text>
                <TextInput
                  style={{color: 'black'}}          
                  autoCapitalize='none'
                  autoCorrect={false}
                  value={material}
                  onChangeText={(text: string) => setMaterial(text)}
                />
              </View>
            </View>
            <View style={{justifyContent: 'flex-end', marginHorizontal: 50, marginVertical: 10}}>
              <ActionButton title="Next" onPress={() => {setStep(3); console.log(step)}}></ActionButton>
            </View>
          </View>
        </View>
        );
}

async function addPhoto(){}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',

  },
  innerContainer: {

    width: '70%',
    height: height- 400,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignContent: 'center',
    elevation: 5,
  },
  title: {
    marginTop: 30,
    fontSize: 20,
    fontWeight: 'bold',
  },
  subTitle: {
    fontSize: 20,
    color: '#04B388',
    alignSelf: 'center',
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '80%',
  },
  buttonContainer: {
    flex: 1,
    width: '50%',
    alignSelf: 'center',
    paddingTop: 20,
    display: 'flex',
    flexDirection: 'column'
  },
  buttonStyle: {
    backgroundColor: '#fff',
    elevation: 8,
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#04B388',
    alignContent: 'center',
    justifyContent: 'center'
  },
  inputView: {
    width: "100%",
    marginVertical: 10,
    borderBottomWidth: 2,
    borderColor: '#152347',
  },
  inputLabel: {
    fontSize: 16,
    color: '#04b388',
  },
  text: {
    fontSize: 20,
    color: 'black',
    paddingVertical: 15,
    alignSelf: 'center'
  },
});
