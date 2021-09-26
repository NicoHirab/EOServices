import React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, Button, TextInput, TouchableOpacity } from 'react-native';

import Firebase from '../config/firebase';

const auth = Firebase.auth();

export function Login({navigation}: {navigation: any}) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  async function handleLogin() {
    try {
      if (email !== '' && password !== '') {
        await auth.signInWithEmailAndPassword(email, password);
      }
    } catch (error: any) {
      setLoginError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>LOGIN</Text>

      {/*Email input */}
      <TextInput
        placeholder='Enter email'
        placeholderTextColor='black'
        autoCapitalize='none'
        keyboardType='email-address'
        textContentType='emailAddress'
        autoFocus={true}
        value={email}
        onChangeText={text => setEmail(text)}
        style={{
          width: '100%',
          fontSize: 14,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      {/* Password input*/}
      <TextInput
        placeholder='Enter password'
        placeholderTextColor='black'
        autoCapitalize='none'
        autoCorrect={false}
        secureTextEntry={true}
        textContentType='password'
        value={password}
        onChangeText={text => setPassword(text)}
        style={{
          width: '100%',
          fontSize: 14,
          marginBottom: 20,
          backgroundColor: "white"
        }}
      />

      {loginError ? <Text style={styles.errorText}>{loginError}</Text> : null}

      <Button title="Login" onPress={handleLogin}/>

      <View style={styles.helpContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.helpLink}>
          <Text style={styles.helpLinkText}>
            Dont have an account? Register now!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gainsboro',
    paddingTop: 50,
    paddingHorizontal: 12
  },
  helpContainer: {
    marginTop: 15,
    marginHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'center',
    paddingBottom: 24
  },
  errorText: {
    color: 'darkred',
    fontWeight: 'bold',
    marginBottom: 20
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    textAlign: 'center',
  }
});
