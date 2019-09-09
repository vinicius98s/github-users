import React, { useState, useEffect } from 'react';
import { Keyboard, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  ProfileButtonText,
  ProfileButton,
  Bio,
  Name,
  Avatar,
  User,
} from './styles';

const Main = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAsyncStorageUser = async () => {
      const asyncStorageUsers = await AsyncStorage.getItem('users');

      if (asyncStorageUsers.length) setUsers(JSON.parse(asyncStorageUsers));
    };

    getAsyncStorageUser();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const handleAddUser = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/users/${newUser}`);

      const data = {
        id: response.data.id,
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      setUsers([...users, data]);
      setNewUser('');
      Keyboard.dismiss();
    } catch (err) {
      console.tron.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUser = id => {
    setUsers(users.filter(user => user.id !== id));
  };

  const handleNavigate = user => {
    navigation.navigate('User', { user });
  };

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
          value={newUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Icon name="add" size={20} color="#FFF" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => String(user.id)}
        renderItem={({ item }) => (
          <User>
            <Icon
              name="close"
              size={20}
              color="#FF6666"
              style={{ alignSelf: 'flex-end' }}
              onPress={() => handleRemoveUser(item.id)}
            />
            <Avatar source={{ uri: item.avatar }} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>
            <ProfileButton onPress={() => handleNavigate(item)}>
              <ProfileButtonText>Ver perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
};

Main.navigationOptions = {
  title: 'Usuários',
};

export default Main;
