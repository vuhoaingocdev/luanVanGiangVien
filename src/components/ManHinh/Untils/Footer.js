import React, {useState} from 'react';
import {View, TouchableOpacity, Image, Dimensions, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';
const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
import ModalThongBao from './ModalThongBao';

const Footer = props => {
  const {soLuongThuTuc} = props;
  const navigation = useNavigation();
  const [showModal, setShowModal] = useState(false);

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <View
      style={{
        height: 0.08 * getHeight,
        backgroundColor: '#ffffff',
        width: getWidth,
      }}>
      {/* <ModalThongBao
        visible={showModal}
        onClose={closeModal}
        message="Chưa hoàn thành!"
      /> */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          height: '100%',
          backgroundColor: '#e6e6fa',
          width: '100%',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: 'black',
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}>
        <TouchableOpacity
          style={{
            width: '30%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('TheoDoiDeNghi');
          }}>
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20,
              position: 'absolute',
              top: 7,
              right: 41,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'red',
              zIndex: 1,
            }}>
            <Text style={{color: '#ffffff', fontSize: 15}}>
              {soLuongThuTuc}
            </Text>
          </View>
          <Image
            resizeMode="stretch"
            source={require('../../../images/notification.png')}
            style={{width: 33, height: 33, zIndex: 0}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '30%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('CBXL_DanhSachThuTuc');
          }}>
          <Image
            resizeMode="stretch"
            source={require('../../../images/home.png')}
            style={{width: 33, height: 33}}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '30%',
            height: '90%',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.navigate('TrangCaNhan');
          }}>
          <Image
            resizeMode="stretch"
            source={require('../../../images/person.png')}
            style={{width: 33, height: 33}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default Footer;
