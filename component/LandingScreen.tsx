import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

const LandingScreen = ({ navigation }: any) => {
  const [user, setUser] = useState<any>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // Fetch user details from 'user' table
        const { data, error } = await supabase
          .from('user')
          .select('firstname, lastname')
          .eq('uuid', user.id)
          .single();
        
        if (data) {
          setFirstName(data.firstname);
          setLastName(data.lastname);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigation.replace('SignIn');
  };

  // Enable Editing Mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Save Changes to Supabase
  const handleSaveChanges = async () => {
    if (!firstName || !lastName) {
      Alert.alert('Error', 'First name and last name cannot be empty');
      return;
    }

    const { error } = await supabase
      .from('user')
      .update({ firstname: firstName, lastname: lastName })
      .eq('uuid', user?.id);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'User details updated successfully!');
      setIsEditing(false); // Exit editing mode after saving
    }
  };

  const handleDeleteUser = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: async () => {
          const { error } = await supabase
            .from('user')
            .delete()
            .eq('uuid', user?.id);

          if (!error) {
            await supabase.auth.signOut();
            navigation.replace('SignIn');
          } else {
            Alert.alert('Error', error.message);
          }
        }, style: 'destructive' }
      ]
    );
  };

  return (
    <View>
      <Text>Welcome, {firstName} {lastName}</Text>

      {isEditing ? (
        <>
          <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} />
          <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} />
          <Button title="Save Changes" onPress={handleSaveChanges} />
        </>
      ) : (
        <Button title="Update Details" onPress={handleEdit} />
      )}

      <Button title="Delete Account" color="red" onPress={handleDeleteUser} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default LandingScreen;

