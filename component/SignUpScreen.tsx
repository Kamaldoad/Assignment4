import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const SignUpScreen = ({ navigation }: any) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { firstName, lastName }, // Store names in user metadata
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Success', 'Account created! Please sign in.');
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
    navigation.navigate('SignIn');
  };

  return (
    <View>
      <Text>Sign Up</Text>
      <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Go to Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
};

export default SignUpScreen;
