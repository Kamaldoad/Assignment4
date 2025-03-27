import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
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
    <View>
      <Text>Sign In</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Go to Sign Up" onPress={() => navigation.navigate('SignUp')} />
    </View>
  );
};

export default SignInScreen;
