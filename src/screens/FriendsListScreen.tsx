import React from 'react';
import styled from 'styled-components/native';
import backgroundImage from '../assets/background/homeBackground.png';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ListItem from '../components/FriendsList/ListItem';
import {globalStyles} from '../styles/globalStyles';
import {useEffect, useState} from 'react';
import {useFriends} from '../hooks/useFriends';

export default function FriendsListScreen() {
  const navigation = useNavigation();
  const moveToAddFriends = () => {
    navigation.navigate('AddFriends');
  };

  const {friends, loadFriends, isLoading} = useFriends();
  // useEffect(() => {}, []);

  const onRefresh = () => {
    loadFriends(true); // 강제로 새로고침
  };
  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Container>
          <Header>
            <HeaderTitle>주소록</HeaderTitle>
            <TouchableOpacity onPress={moveToAddFriends}>
              <Image
                source={require('../assets/icons/addFriendsIcon.png')}
                alt="Add Friends"
                style={{width: 30, height: 30}}
              />
            </TouchableOpacity>
          </Header>
          <ScrollView>
            <Text style={globalStyles.grayBold16}>누구와 연락할까요?</Text>
            <TopImage
              source={require('../assets/FriendsList/FriednsListTop.png')}
              alt="friendsListImg"
            />
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>나의 프로필</Text>
              {/* <ListItem /> */}
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>즐겨찾기</Text>
              {/* <ListItem /> */}
            </View>
            <View style={{marginBottom: 20}}>
              <Text style={globalStyles.bold12}>목록</Text>
              {friends.map(friend => (
                <ListItem
                  key={friend.friendId}
                  id={friend.friendId}
                  name={friend.name}
                  statusMessage={friend.statusMessage}
                />
              ))}
            </View>
          </ScrollView>
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
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

const TopImage = styled.Image`
  width: 311px;
  height: 117px;
  margin-bottom: 20px;
`;
