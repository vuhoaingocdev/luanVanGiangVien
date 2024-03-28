import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DangNhap from '../../DangNhap/dangNhap';
// import TrangChu from './TiepNhan/TrangChu/TrangChu';
import ChiTietHoSo from './TiepNhan/ChiTietHoSo/ChiTietHoSo';
import TheoDoiDeNghi from './TiepNhan/TheoDoiDeNghi/TheoDoiDeNghi';
import TrangCaNhan from '../Untils/TrangCaNhan';
import TrangThongBao from '../Untils/TrangThongBao';
import Chitietthutuc from './TiepNhan/ChiTietThuTuc/ChiTietThuTuc';
import Soanhoso from './TiepNhan/SoanHoSo/soanhoso';
import Footer from '../Untils/Footer';
import CBXL_DanhSachThuTuc from './CanBoXuLy/DanhSachThuTuc/CBXL_DanhSachThuTuc';
import Chitiethosoxuly from './CanBoXuLy/ChiTietThuTuc/ChiTietThuTuc';

const Stack = createNativeStackNavigator();
const Index = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="DangNhap"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="DangNhap" component={DangNhap} />
        {/* <Stack.Screen name="TrangChu" component={TrangChu} /> */}
        <Stack.Screen name="ChiTietHoSo" component={ChiTietHoSo} />
        <Stack.Screen name="TheoDoiDeNghi" component={TheoDoiDeNghi} />
        <Stack.Screen name="TrangCaNhan" component={TrangCaNhan} />
        <Stack.Screen name="TrangThongBao" component={TrangThongBao} />
        <Stack.Screen name="ChiTietThuTuc" component={Chitietthutuc} />
        <Stack.Screen name="SoanHoSo" component={Soanhoso} />
        <Stack.Screen name="Footer" component={Footer} />
        <Stack.Screen name="ChiTietHoSoXuLy" component={Chitiethosoxuly} />
        <Stack.Screen
          name="CBXL_DanhSachThuTuc"
          component={CBXL_DanhSachThuTuc}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
