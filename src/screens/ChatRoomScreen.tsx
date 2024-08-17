import React from 'react';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {
  Text,
  SafeAreaView,
  StatusBar,
  View,
  Image,
  ScrollView,
} from 'react-native';
import ListItem from '../components/FriendsList/ListItem';
import {globalStyles} from '../styles/globalStyles';
import MenuTab from '../components/layouts/MenuTab';
import ChatItem from '../components/chatRoom/ChatItem';

export default function FriendsListScreen() {
  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Container>
          <Header>
            <HeaderTitle>채팅</HeaderTitle>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../assets/icons/searchIcon.png')}
                alt="Add Friends"
                style={{width: 27, height: 27, marginRight: 10}}
              />
              <Image
                source={require('../assets/icons/addFriendsIcon2.png')}
                alt="Add Friends"
                style={{
                  width: 30,
                  height: 30,
                  position: 'relative',
                  bottom: 0.8,
                }}
              />
            </View>
          </Header>
          <ScrollView>
            <View style={{marginTop: 10, marginBottom: 20}}>
              <Text style={globalStyles.grayBold16}>당신의 대화를</Text>
              <Text style={globalStyles.grayBold16}>빠짐없이 기록할게요.</Text>
            </View>
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
            <ChatItem />
          </ScrollView>
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}
const ScreenContainer = styled.View`
  flex: 1;
`;

const SafeAreaContainer = styled(SafeAreaView)`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Container = styled.View`
  flex: 1;
  padding: 0 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;
