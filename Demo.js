import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import LocalNotification from './src/components/ManHinh/Untils/LocalNotification';
import RemoteNotification from './src/components/ManHinh/Untils/RemoteNotification';
const Demo = () => {
  const isDarkMode = true;
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />

      <ScrollView>
        <View>
          {/* <RemoteNotification /> */}
          <Text> Push Notification!!</Text>
          <Button title="click here" onPress={LocalNotification} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Demo;
