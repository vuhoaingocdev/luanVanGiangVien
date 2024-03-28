import React, {useEffect, Component, useState} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

import {
  getThongTinhGiangVien,
  ThongTinGiangVien,
} from '../../../api/GetThongTin/ThongTinGiangVien';
import {maGiangVien} from '../../DangNhap/dangNhap';
import HeaderBack from './HeaderBack';
import Footer from './Footer';
import {token} from '../../DangNhap/dangNhap';
import axios from 'axios';

const TrangCaNhan = props => {
  //Retry
  const retry = async (func, maxAttempts = 3, delay = 1000, backoff = 2) => {
    let attempt = 1;
    while (attempt <= maxAttempts) {
      try {
        const result = await func();
        return result;
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error;
        }
        console.log(
          `Lần ${attempt} thất bại. Đang thử lại trong ${delay / 1000} giây...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoff;
        attempt++;
      }
    }
  };

  //Lấy số lượng thủ tục gửi lên
  const [soLuongThuGuiLen, setSoLuongThuTucGuiLen] = useState(0);
  const apiSoLuongThuGuiLen = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_ByMaNhanSu?MC_TTHC_GV_GuiYeuCau_MaNhanSu=${maGiangVien}`;
  const getSoLuong = async () => {
    const apiCall = async () => {
      const response = await axios.get(apiSoLuongThuGuiLen, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (
        response.status !== 400 &&
        response.data &&
        response.data.body &&
        response.data.body.length > 0
      ) {
        const mangDanhSach = response.data.body.map(item => ({
          idGuiYeuCau: item.MC_TTHC_GV_GuiYeuCau_ID,
          tenThuTuc: item.MC_TTHC_GV_TenThuTuc,
          ngayGui: item.MC_TTHC_GV_GuiYeuCau_NgayGui,
          trangThai: item.MC_TTHC_GV_TrangThai_TenTrangThai,
        }));

        setSoLuongThuTucGuiLen(mangDanhSach.length);
      } else {
        setSoLuongThuTucGuiLen(0);
      }
    };

    try {
      await retry(apiCall);
    } catch (error) {
      console.error('API call failed after multiple attempts:', error);
    }
  };

  useEffect(() => {
    getThongTinhGiangVien();
    getSoLuong();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="Thông tin giảng viên"
        onPress={() => {
          props.navigation.goBack();
        }}
      />

      <ScrollView>
        <View style={styles.viewBody}>
          <View style={styles.viewBodyChild}>
            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Họ và tên: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.HoDem} {ThongTinGiangVien.Ten}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Giới tính: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.GioiTinh}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Mã nhân sự: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.MaNhanSu}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Quê quán: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.NguyenQuan}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Nơi ở hiện tại:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.NoiOHienTai}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Số CMND: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.SoCMND}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Nơi cấp: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.NoiCapCMND}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Số điện thoại:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.SoDienThoai}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Số điện thoại di động:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.SoDiDong}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Email cá nhân:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.Email}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Email uneti: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.EmailUneti}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Đơn vị công tác:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.HienTaiDonVi}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Chức vụ: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.HienTaiChucVu}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Chuyên môn: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.ChuyenMon}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Học vấn: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.HocVan}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Học hàm: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.HocHam}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Học vị: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.HocVi}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Ngoại ngữ: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.NgoaiNgu1}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Trình độ ngoại ngữ:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.NgoaiNgu1}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Trình độ quản lí giáo dục:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.TrinhDoQuanLyGiaoDuc}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Trình độ quản lí nhà nước:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.TrinhDoQuanLyNhaNuoc}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Ngày vào đảng:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.DangVienNgayVao}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>
                Chức vụ đảng viên:{' '}
              </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.DangVienChucVu}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Mã số thuế: </Text>
              <Text style={styles.styleTextBold}>
                {ThongTinGiangVien.MaSoThue}
              </Text>
            </View>

            <View style={styles.viewContainerText}>
              <Text style={{color: 'black', fontSize: 17}}>Số tài khoản: </Text>
              <Text style={styles.styleTextBold}>{ThongTinGiangVien.ATM1}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer soLuongThuTuc={soLuongThuGuiLen} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  ContainerHeader: {
    height: '10%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewHeader: {
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    width: '90%',
    flexDirection: 'row',
  },

  iconMenu: {
    height: 40,
    width: 35,
    tintColor: '#fff',
  },
  textTieuDe: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 60,
  },

  viewBody: {
    height: '100%',
    width: '100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewBodyChild: {
    width: '95%',
    height: '100%',
    marginTop: 30,
  },

  viewThongTinCoBan: {
    width: '100%',
    height: '20%',
    flexDirection: 'row',
  },
  viewImage: {
    width: 120,
    height: '100%',
  },
  viewTextImage: {
    flex: 1,
    marginLeft: 5,
  },

  viewContainerText: {
    flexDirection: 'row',
    marginBottom: 10,
  },

  viewUnderThongTinCoBan: {
    flex: 1,
    marginTop: 20,
  },

  viewKhoaHoc: {
    position: 'absolute',
    right: 0,
    flexDirection: 'row',
  },

  styleTextBold: {
    color: 'black',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default TrangCaNhan;
