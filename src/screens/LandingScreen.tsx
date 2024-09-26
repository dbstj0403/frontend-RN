// LandingScreen.js
import React, {useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import styled from 'styled-components/native';

const LandingScreen = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 3000);
  }, [navigation]);

  return (
    <LandingContainer>
      <LandingImage
        source={require('../assets/landing/landingImg.png')}
        alt="landing-Image"
      />
    </LandingContainer>
  );
};

const LandingContainer = styled.View`
  flex: 1;
`;

const LandingImage = styled.Image`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LandingScreen;
