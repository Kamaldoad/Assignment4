import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

const SignInScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    const user = data.user;
    if (!user) {
      Alert.alert('Error', 'Sign-in failed.');
      return;
    }

    // Check if the user already exists in the "user" table
    const { data: existingUser, error: fetchError } = await supabase
      .from('user')
      .select('firstname, lastname')
      .eq('uuid', user.id)
      .single();

    if (fetchError) {
      console.log('User not found in table, inserting now...');
      // Fetch user metadata (if available)
      const { user_metadata } = user;
      const firstName = user_metadata?.firstName || 'Unknown';
      const lastName = user_metadata?.lastName || 'Unknown';

      // Insert user details into "user" table
      const { error: insertError } = await supabase.from('user').insert([
        {
          uuid: user.id,
          firstname: firstName,
          lastname: lastName,
          email: user.email,
        },
      ]);

      if (insertError) {
        Alert.alert('Error', 'Failed to save user details.');
        return;
      }
    }

    Alert.alert('Success', `Welcome, ${existingUser?.firstname || 'User'}!`);
    setEmail('');
    setPassword('');
    navigation.navigate('Landing');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => navigation.navigate('SignUp')}>
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
        </TouchableOpacity>

      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginTop: 80,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#007BFF',
    paddingVertical: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  

})
export default SignInScreen;
