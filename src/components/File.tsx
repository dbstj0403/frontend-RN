import React, {useEffect} from 'react';
import {Button, View, Text} from 'react-native';
import RNFS from 'react-native-fs';

export default function FileSystemExample() {
  const filePath = `${RNFS.DocumentDirectoryPath}/test_file.txt`;

  // 파일 작성 함수
  const writeFile = async () => {
    try {
      const content = 'This is a test file content.';
      await RNFS.writeFile(filePath, content, 'utf8');
      console.log(`File successfully written at ${filePath}`);
    } catch (error) {
      console.error('Error writing file:', error);
    }
  };

  // 파일 읽기 함수
  const readFile = async () => {
    try {
      const fileContent = await RNFS.readFile(filePath, 'utf8');
      console.log(`File content: ${fileContent}`);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  };

  // useEffect를 사용하여 컴포넌트가 처음 로드될 때 파일 경로를 확인
  useEffect(() => {
    const checkFileExists = async () => {
      const fileExists = await RNFS.exists(filePath);
      console.log(`File exists at path: ${filePath} - ${fileExists}`);
    };

    checkFileExists();
  }, []);

  return (
    <View style={{padding: 20}}>
      <Text>File System Example</Text>
      <Button title="Write File" onPress={writeFile} />
      <Button title="Read File" onPress={readFile} />
    </View>
  );
}
