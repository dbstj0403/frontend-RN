import React, {useState, useEffect, useCallback} from 'react';
import backgroundImage from '../assets/background/homeBackground.png';
import styled from 'styled-components/native';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';
import Favorite from '../components/addChatRoom/Favorite';
import FriendSearchItem from '../components/addChatRoom/FriendSearchItem';

interface Friend {
  friendId: string;
  friendType: string;
  name: string;
  statusMessage: string;
}

export default function AddChatRoomScreen() {
  const [name, setName] = useState('');
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [filteredFriends, setFilteredFriends] = useState<Friend[]>([]);

  const navigation = useNavigation();

  const moveToFriendsList = useCallback(() => {
    navigation.navigate('FriendsList');
  }, [navigation]);

  useEffect(() => {
    const getFriends = async () => {
      const token = await AsyncStorage.getItem('jwtAccessToken');
      try {
        const response = await api.get('/friend/all', {
          headers: {
            Authorization: token,
          },
        });
        if (response.status === 200) {
          console.log('친구 목록 불러오기 성공!', response.data);
          setFriendsList(response.data);
        }
      } catch (e) {
        console.log('친구 목록 불러오기 실패:', e);
      }
    };
    getFriends();
  }, []);

  useEffect(() => {
    const filtered = friendsList.filter(friend =>
      friend.name.toLowerCase().includes(name.toLowerCase()),
    );
    setFilteredFriends(filtered);
  }, [name, friendsList]);

  const handleInputChange = useCallback((text: string) => {
    setName(text);
  }, []);

  const renderFriendItem = useCallback(
    ({item}: {item: Friend}) => (
      <FriendSearchItem
        key={item.friendId}
        name={item.name}
        id={item.friendId}
      />
    ),
    [],
  );

  return (
    <ScreenContainer>
      <BackgroundImage source={backgroundImage} resizeMode="cover" />
      <SafeAreaContainer>
        <Header>
          <TouchableOpacity onPress={moveToFriendsList}>
            <Image
              source={require('../assets/icons/backwardIcon.png')}
              alt="Login"
              style={{width: 7.4, height: 12}}
            />
          </TouchableOpacity>
          <Text style={globalStyles.semibold16}>대화 상대 선택</Text>
          <View style={{width: 15}}></View>
        </Header>
        <Container>
          <View
            style={{
              marginTop: 40,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 20,
            }}>
            <Text style={globalStyles.bold20}>
              대화할 상대를 선택해 주세요.
            </Text>
          </View>
          <View style={{position: 'relative'}}>
            <Input
              style={globalStyles.regular16}
              value={name}
              onChangeText={handleInputChange}
              placeholder="검색"
              placeholderTextColor="#666666"
              editable={true}
              keyboardType="default"
            />
            <SearchbtnContainer>
              <Image
                source={require('../assets/icons/searchIcon.png')}
                alt="search"
                style={{width: 24, height: 24}}
              />
            </SearchbtnContainer>
          </View>
          {name === '' && (
            <Contact>
              <Text style={globalStyles.bold12}>즐겨찾기</Text>
              <Favorite id={'1234'} name={'메롱메롱'} />
              <Favorite id={'1234'} name={'시카노코노코노코'} />
              <Favorite id={'1234'} name={'코시탄탄'} />
            </Contact>
          )}
          {name !== '' && (
            <SearchResultContainer>
              <Text style={globalStyles.bold12}>검색 결과</Text>
              {filteredFriends.length > 0 ? (
                <FlatList
                  data={filteredFriends}
                  renderItem={renderFriendItem}
                  keyExtractor={item => item.friendId}
                />
              ) : (
                <View style={{marginTop: 20}}>
                  <Text style={globalStyles.grayRegular14}>
                    검색 결과가 없습니다.
                  </Text>
                </View>
              )}
            </SearchResultContainer>
          )}
        </Container>
      </SafeAreaContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
`;

const SafeAreaContainer = styled.SafeAreaView`
  flex: 1;
`;

const Container = styled.View`
  padding: 0 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  border-bottom-width: 1px;
  border-bottom-color: #dfdfdf;
  padding-horizontal: 20px;
`;

const Input = styled.TextInput`
  width: 100%;
  background-color: white;
  height: 40px;
  padding-left: 10px;
  padding-right: 50px;
  margin-top: 20px;
  border-radius: 10px;
`;

const BackgroundImage = styled.Image`
  position: absolute;
  width: 100%;
  height: 100%;
`;

const SearchbtnContainer = styled.TouchableOpacity`
  position: absolute;
  right: 5px;
  top: 20px;
  background-color: transparent;
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Contact = styled.View`
  margin-top: 50px;
`;

const SearchResultContainer = styled.View`
  margin-top: 48px;
  margin-left: 5px;
`;

const styles = StyleSheet.create({
  centeredText: {
    textAlign: 'center',
    width: '100%',
  },
});
