import React from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
export default function ContactItem({name}: {name: string}) {
  const getProfileImage = name => {
    switch (name) {
      case '다니엘':
      case '혜인':
        return require('../../assets/icons/profileImg2.png');
      case '하니':
        return require('../../assets/icons/profileImg3.png');
      default:
        return require('../../assets/icons/profileImg.png');
    }
  };
  return (
    <>
      <Container>
        <Image
          source={getProfileImage(name)}
          alt="profile"
          style={{width: 33, height: 33, marginRight: 15}}
        />
        <NameText style={globalStyles.bold16}>{name}</NameText>
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
  margin-right: 10;
`;
