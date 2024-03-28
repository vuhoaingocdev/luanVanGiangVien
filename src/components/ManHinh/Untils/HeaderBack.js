import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;

function HeaderBack(props) {
  const {title, onPress} = props;
  return (
    <View style={styles.ContainerHeader}>
      <ImageBackground source={require('../../../images/header.png')}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={onPress}>
            <Image
              source={require('../../../images/back.png')}
              style={styles.iconMenu}
            />
          </TouchableOpacity>
          <View style={{width: getWidth, alignItems: 'center'}}>
            <Text style={styles.textTieuDe}>{title}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  ContainerHeader: {
    height: 0.13 * getHeight,
    width: getWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 0.13 * getHeight,
    width: getWidth,
    flexDirection: 'row',
  },
  iconMenu: {
    height: 30,
    width: 24,
    tintColor: '#fff',
    marginLeft: 10,
  },
  textTieuDe: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 60,
  },
});

export default HeaderBack;
