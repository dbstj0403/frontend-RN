// App.js
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import KakaoSignUpScreen from './src/screens/KakaoSignUpScreen';

import FriendsListScreen from './src/screens/FriendsListScreen';
import ChatRoomListScreen from './src/screens/ChatRoomListScreen';
import MenuTab from './src/components/layouts/MenuTab';
import SettingsScreen from './src/screens/SettingsScreen';
import AddFriendsScreen from './src/screens/AddFriendsScreen';
import AddChatRoomScreen from './src/screens/AddChatRoomScreen';
import ChattingRoomScreen from './src/screens/ChattingRoomScreen';
import FriendsProfileScreen from './src/screens/FriendsProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  return (
    <Tab.Navigator tabBar={props => <MenuTab {...props} />}>
      <Tab.Screen
        name="FriendsList"
        component={FriendsListScreen}
        options={{title: 'List', headerShown: false}}
      />
      <Tab.Screen
        name="ChatRoomList"
        component={ChatRoomListScreen}
        options={{title: 'Record', headerShown: false}}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{title: 'Settings', headerShown: false}}
      />
    </Tab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="KakaoSignUp" component={KakaoSignUpScreen} />
        <Stack.Screen name="AddFriends" component={AddFriendsScreen} />
        <Stack.Screen name="AddChatRoom" component={AddChatRoomScreen} />
        <Stack.Screen name="ChattingRoom" component={ChattingRoomScreen} />
        <Stack.Screen name="FriendsProfile" component={FriendsProfileScreen} />
        <Stack.Screen name="Main" component={MainTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
