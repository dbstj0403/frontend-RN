import React, {useState} from 'react';
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
} from 'react-native';
import {globalStyles} from '../styles/globalStyles';
import {useNavigation} from '@react-navigation/native';
import ContactItem from '../components/addFriends/ContactItem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/config';
import ResultItem from '../components/addFriends/ResultItem';

interface SearchResultItem {
  customId: string;
  name: string;
  statusMessage: string;
}

export default function AddFriendsScreen() {
  const [id, setId] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResultItem | null>(
    null,
  );
  const [noUsersId, setNoUsersId] = useState('');

  const navigation = useNavigation();

  const moveToFriendsList = () => {
    navigation.navigate('FriendsList');
  };

  const goSearch = async () => {
    const token = await AsyncStorage.getItem('jwtAccessToken');
    setIsSearched(true);
    setSearchResult(null);
    setNoUsersId('');

    try {
      const response = await api.get('/friend/search', {
        params: {
          customId: id,
        },
        headers: {
          Authorization: token,
        },
      });
      if (response.status === 200) {
        console.log(response.data);
        setSearchResult(response.data);
      }
    } catch (e: any) {
      console.log(e);
      if (e.response && e.response.status === 500) {
        console.log('no users!');
        setNoUsersId(id);
      }
    }
  };

  const handleInputChange = (text: string) => {
    setId(text);
    setIsSearched(false);
    setSearchResult(null);
    setNoUsersId('');
  };

  const nameList = ['민지', '하니', '다니엘', '해린', '혜인'];

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
          <Text style={globalStyles.semibold16}>아이디로 친구 추가하기</Text>
          <View style={{width: 5}} />
        </Header>
        <Container>
          <View style={{marginTop: 40}}>
            <Text style={globalStyles.bold20}>모두를 위한 통화, </Text>
            <Text style={globalStyles.bold20}>들리담과 함께해요. </Text>
          </View>
          <View style={{position: 'relative'}}>
            <Input
              style={globalStyles.regular16}
              value={id}
              onChangeText={handleInputChange}
              placeholder="검색"
              placeholderTextColor="#666666"
              editable={true}
              keyboardType="default"
            />
            <SearchbtnContainer onPress={goSearch}>
              <Image
                source={require('../assets/icons/searchIcon.png')}
                alt="search"
                style={{width: 24, height: 24}}
              />
            </SearchbtnContainer>
          </View>
          {id === '' && (
            <Contact>
              <Text style={globalStyles.bold12}>연락처에서 추가하기</Text>
              {nameList.map((item, index) => (
                <ContactItem name={item} key={index} />
              ))}
            </Contact>
          )}
          {isSearched && noUsersId !== '' && (
            <Nothing>
              <Text style={[styles.centeredText, globalStyles.bold20]}>
                "{noUsersId}"의 {'\n'}검색 결과가 없습니다. {'\n'}아이디를 다시
                확인해 주세요!
              </Text>
            </Nothing>
          )}
          {isSearched && searchResult && (
            <SearchResultContainer>
              <Text style={globalStyles.bold12}>검색 결과</Text>
              <ResultItem
                id={searchResult.customId}
                name={searchResult.name}
                statusMessage={searchResult.statusMessage}
              />
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

const Nothing = styled.View`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: auto;
  text-align: center;
  margin-top: 30px;
`;

const styles = StyleSheet.create({
  centeredText: {
    textAlign: 'center',
    width: '100%',
  },
});

const SearchResultContainer = styled.View`
  margin-top: 48px;
  margin-left: 5px;
`;
