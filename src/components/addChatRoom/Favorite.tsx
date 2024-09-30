import React from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
export default function Favorite({id, name}: {id: string; name: string}) {
  return (
    <>
      <Container>
        <Image
          source={require('../../assets/icons/profileImg.png')}
          alt="profile"
          style={{width: 35, height: 35, marginRight: 15}}
        />
        <NameText style={globalStyles.bold18}>{name}</NameText>
      </Container>
    </>
  );
}

const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const NameText = styled.Text`
  margin-right: 10px;
`;
