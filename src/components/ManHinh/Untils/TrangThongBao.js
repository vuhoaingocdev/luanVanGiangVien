import React, {Component} from 'react';
import {View, Text} from 'react-native';

const TrangThongBao = () => {
  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={{fontSize: 25, fontWeight: 'bold', color: 'black'}}>
        Trang thông báo
      </Text>
    </View>
  );
};

export default TrangThongBao;
