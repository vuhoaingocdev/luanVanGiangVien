import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import ModalThongBao from './ModalThongBao';
import axios from 'axios';
import {token} from '../../DangNhap/dangNhap';

const ModalDonViVaLinhVuc = props => {
  const {visible, onClose} = props;
  const [checked, setChecked] = useState('DonVi');

  const {getTenDonVi, setTenDonVi, getTenLinhVuc, setTenLinhVuc} = props;

  const [showModalThongBao, setShowModalThongBao] = useState(false);
  const openModalThongBao = () => {
    setShowModalThongBao(true);
  };

  const closeModalThongBao = () => {
    setShowModalThongBao(false);
  };

  const [tenDonViAPI, setTenDonViAPI] = useState([]);
  const [tenLinhVucAPI, setTenLinhVucAPI] = useState([]);

  //Lấy tên đơn vị

  const getMangTenDonViAPI = async () => {
    try {
      const response = await axios.get(apiGetTenDonVi, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const arrayTenDonVi = response.data.body.map(
        tdv => tdv.MC_TTHC_GV_NoiTiepNhan,
      );
      setTenDonViAPI(arrayTenDonVi);
    } catch (error) {
      console.error(error);
    }
  };

  //Lấy tên lĩnh vực

  const getMangTenLinhVucAPI = async () => {
    try {
      const response = await axios.get(apiGetTenLinhVuc, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const arrayTenLinhVuc = response.data.body.map(
        tlv => tlv.MC_TTHC_GV_LinhVuc,
      );
      setTenLinhVucAPI(arrayTenLinhVuc);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMangTenDonViAPI();
    getMangTenLinhVucAPI();
  }, []);

  return (
    <View>
      <ModalThongBao
        visible={showModalThongBao}
        onClose={closeModalThongBao}
        message="Chưa hoàn thành!"
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={onClose}>
        <View style={styles.viewContainer}>
          <View style={styles.viewModal}>
            <RadioButton.Group
              onValueChange={newValue => setChecked(newValue)}
              value={checked}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={[styles.radioItem, {marginLeft: 15}]}>
                  <RadioButton
                    value="DonVi"
                    color="#ffffff"
                    uncheckedColor="#ffffff"
                  />
                  <Text style={styles.modalText}>Đơn vị</Text>
                </View>

                <View style={[styles.radioItem, {marginLeft: 30}]}>
                  <RadioButton
                    value="LinhVuc"
                    color="#ffffff"
                    uncheckedColor="#ffffff"
                  />
                  <Text style={styles.modalText}>Lĩnh vực</Text>
                </View>

                <TouchableOpacity onPress={onClose}>
                  <Image
                    source={require('../../../images/backk.png')}
                    style={styles.iconBack}
                    tintColor={'#ffffff'}
                  />
                </TouchableOpacity>
              </View>
            </RadioButton.Group>

            {checked === 'DonVi' ? (
              <View style={{marginTop: 10}}>
                {tenDonViAPI.map((mdv, index) => (
                  <TouchableOpacity
                    style={styles.TouchableOpacity}
                    key={index}
                    onPress={() => {
                      setTenDonVi(tenDonViAPI[index]);
                      onClose();
                    }}>
                    <Text style={styles.modalText}>{mdv}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={{marginTop: 10}}>
                {tenLinhVucAPI.map((mlv, index) => (
                  <TouchableOpacity
                    style={styles.TouchableOpacity}
                    key={index}
                    onPress={() => {
                      setTenLinhVuc(tenLinhVucAPI[index]);
                      onClose();
                    }}>
                    <Text style={styles.modalText}>{mlv}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },

  viewModal: {
    width: 280,
    backgroundColor: '#245d7c',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 8,
    shadowRadius: 4,
    elevation: 10,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    //marginTop: 175.5,
    marginTop: 155,
  },

  modalText: {
    fontSize: 16,
    color: '#ffffff',
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBack: {
    width: 30,
    height: 30,
    marginLeft: 30,
  },

  TouchableOpacity: {
    marginLeft: 7,
    marginBottom: 9,
  },
});
export default ModalDonViVaLinhVuc;
