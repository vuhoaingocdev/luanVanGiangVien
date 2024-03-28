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

function Header(props) {
  const {title, onPress} = props;

  return (
    <View style={styles.ContainerHeader}>
      <ImageBackground source={require('../../../images/backgroundHeader.png')}>
        <View style={styles.viewHeader}>
          <TouchableOpacity onPress={onPress} style={styles.TouchableOpacity}>
            <Image
              source={require('../../../images/menu.png')}
              style={styles.iconMenu}
            />
          </TouchableOpacity>
          <View style={styles.viewTextTieuDe}>
            <Text style={styles.textTieuDe}>{title}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  ContainerHeader: {
    height: 0.26 * getHeight,
    width: getWidth,
    alignItems: 'center',
  },
  viewHeader: {
    alignItems: 'center',
    height: 0.26 * getHeight,
    width: getWidth,
    flexDirection: 'row',
  },
  iconMenu: {
    height: 30,
    width: 25,
    tintColor: '#fff',
    marginLeft: 20,
  },
  textTieuDe: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  imageLogo: {
    height: 74,
    width: 65,
    marginRight: 20,
  },

  TouchableOpacity: {
    width: 60,
    height: 50,
  },

  viewTextTieuDe: {
    height: 50,
    flex: 1,
    marginLeft: 30
  },
});

export default Header;
