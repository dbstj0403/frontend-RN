import React from 'react';
import {Image, Text, View} from 'react-native';
import styled from 'styled-components/native';
import {globalStyles} from '../../styles/globalStyles';
export default function ChatItem() {
  return (
    <>
      <Container>
        <Image
          source={require('../../assets/icons/profileImg.png')}
          alt="profile"
          style={{width: 40, height: 40, marginRight: 10}}
        />
        <ContentContainer>
          <Text style={globalStyles.bold18}>원윤서</Text>
          <Text style={globalStyles.grayRegular16}>본문본문본문본문</Text>
        </ContentContainer>
      </Container>
    </>
  );
}

const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;

  margin-top: 10px;
  margin-bottom: 10px;
  height: 50px;
`;

const ContentContainer = styled.View`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  height: 50px;
  justify-content: space-between;
`;
