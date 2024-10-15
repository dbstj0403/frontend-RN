import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Sound from 'react-native-sound';
import RNFS from 'react-native-fs';

const S3AudioPlayer = ({audioUrl}) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Sound.setCategory('Playback');
    loadAudio();

    return () => {
      if (sound) {
        sound.release();
      }
    };
  }, [audioUrl]);

  const loadAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Extract file name from URL (remove query parameters)
      const fileName = audioUrl.split('?')[0].split('/').pop();
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Download file
      await RNFS.downloadFile({
        fromUrl: audioUrl,
        toFile: localFilePath,
      }).promise;

      // Create Sound object with local file
      const newSound = new Sound(localFilePath, '', error => {
        setIsLoading(false);
        if (error) {
          console.log('Failed to load the sound', error);
          setError(`Failed to load the audio: ${error.message}`);
          return;
        }
        console.log('Sound loaded successfully');
        setSound(newSound);
      });
    } catch (err) {
      console.error('Error loading audio:', err);
      setIsLoading(false);
      setError(`Error loading audio: ${err.message}`);
    }
  };

  const playPause = () => {
    if (sound) {
      if (isPlaying) {
        sound.pause(() => {
          console.log('Sound paused');
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(true);
        sound.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
            setError('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
        });
      }
    } else {
      setError('Sound object not initialized');
    }
  };

  const retryLoading = () => {
    loadAudio();
  };

  if (isLoading) {
    return <Text style={styles.message}>Loading audio...</Text>;
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>Error: {error}</Text>
        <TouchableOpacity style={styles.button} onPress={retryLoading}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={playPause}>
        <Text style={styles.buttonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
      </TouchableOpacity>
      <Text style={styles.urlText}>Audio URL: {audioUrl}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    marginBottom: 10,
  },
  urlText: {
    fontSize: 12,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default S3AudioPlayer;
