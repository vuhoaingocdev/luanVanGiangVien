import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;

const ModalTheoDoiHoSoVaHoSoCanXuLy = props => {
  const {visible, onClose, PressTheoDoiHoSo, PressHoSoCanXuLy} = props;
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../../images/backk.png')}
              style={styles.iconBack}
              tintColor={'#ffffff'}
            />
          </TouchableOpacity>

          <View style={{marginTop: 5}}>
            <TouchableOpacity
              style={styles.TouchableOpacity}
              onPress={PressTheoDoiHoSo}>
              <Image
                style={{width: 25, height: 25, marginLeft: 20}}
                resizeMode="stretch"
                source={require('../../../images/verification.png')}
              />
              <Text style={styles.text}>Theo dõi hồ sơ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.TouchableOpacity,
                {marginTop: 10, marginBottom: 35},
              ]}
              onPress={PressHoSoCanXuLy}>
              <Image
                style={{width: 25, height: 25, marginLeft: 20}}
                resizeMode="stretch"
                source={require('../../../images/writing.png')}
              />
              <Text style={styles.text}>Hồ sơ cần xử lý</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    marginTop: getHeight - 564,
    width: 220,
    backgroundColor: '#245d7c',
    shadowColor: '#000',
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 8,
    shadowRadius: 4,
    elevation: 10,
  },

  TitleText: {
    color: 'black',
    fontSize: 21,
    fontWeight: 'bold',
  },

  iconBack: {
    width: 30,
    height: 30,
    marginLeft: 190,
  },

  TouchableOpacity: {
    width: 170,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    flexDirection: 'row',
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  text: {
    fontSize: 15,
    color: 'black',
    fontWeight: 'bold',
    marginRight: 20,
  },
});

export default ModalTheoDoiHoSoVaHoSoCanXuLy;
