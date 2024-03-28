import React, {useState} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';

const ModalThongBao = props => {
  const {visible, onClose, message} = props;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.TitleText}>Thông báo!</Text>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.textStyle}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    alignItems: 'center',
    width: 280,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 8,
    shadowRadius: 4,
    elevation: 10,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 15,
    textAlign: 'center',
    marginTop: 10,
  },
  closeButton: {
    width: '100%',
    borderTopWidth: 0.3,
    marginTop: 10,
    borderColor: 'gray',
  },

  textStyle: {
    fontSize: 21,
    color: '#1e90ff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
  TitleText: {
    color: 'black',
    fontSize: 21,
    fontWeight: 'bold',
  },
});

export default ModalThongBao;
