import React, {useState, useEffect} from 'react';
import {View, Button, Text, Platform} from 'react-native';
import Sound from 'react-native-sound';

const IOSLocalAudioTest = () => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // iOS에서만 실행
    if (Platform.OS === 'ios') {
      // Sound 모듈 초기화
      Sound.setCategory('Playback');

      // 오디오 파일 로드 (require 사용)
      const audio = new Sound(require('../assets/ex.m4a'), error => {
        setIsLoading(false);
        if (error) {
          console.log('Failed to load the sound', error);
          return;
        }
        console.log('Sound loaded successfully');
        setSound(audio);
      });
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, []);

  const playPause = () => {
    if (!sound) {
      console.log('Sound not loaded yet');
      return;
    }

    if (isPlaying) {
      sound.pause(() => {
        console.log('Sound paused');
        setIsPlaying(false);
      });
    } else {
      sound.play(success => {
        if (success) {
          console.log('Successfully finished playing');
        } else {
          console.log('Playback failed due to audio decoding errors');
        }
        setIsPlaying(false);
      });
      setIsPlaying(true);
    }
  };

  if (Platform.OS !== 'ios') {
    return <Text>This component is only supported on iOS</Text>;
  }

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Button
        title={isPlaying ? 'Pause' : 'Play'}
        onPress={playPause}
        disabled={isLoading}
      />
      <Text style={{marginTop: 20}}>
        {isLoading
          ? 'Loading audio...'
          : isPlaying
          ? 'Playing audio...'
          : 'Audio stopped'}
      </Text>
    </View>
  );
};

export default IOSLocalAudioTest;
