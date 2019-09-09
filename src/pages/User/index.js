import React, { useState, useEffect } from 'react';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

import api from '../../services/api';

const User = ({ navigation }) => {
  const [stars, setStars] = useState([]);
  const user = navigation.getParam('user');

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await api.get(`/users/${user.login}/starred`);
        setStars(response.data);
      } catch (err) {
        console.tron.warn(err);
      }
    };

    getUserInfo();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>

      <Stars
        data={stars}
        keyExtractor={star => String(star.id)}
        renderItem={({ item }) => (
          <Starred>
            <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
            <Info>
              <Title>{item.name}</Title>
              <Author>{item.owner.login}</Author>
            </Info>
          </Starred>
        )}
      />
    </Container>
  );
};

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

export default User;
