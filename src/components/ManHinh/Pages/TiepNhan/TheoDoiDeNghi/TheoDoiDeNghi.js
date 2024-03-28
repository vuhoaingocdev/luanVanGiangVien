import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;

import {token} from '../../../../DangNhap/dangNhap';
import HeaderBack from '../../../Untils/HeaderBack';
import Footer from '../../../Untils/Footer';
import axios from 'axios';
import {maGiangVien} from '../../../../DangNhap/dangNhap';

const TheoDoiDeNghi = props => {
  const [danhSachHoSoDaGui, setDanhSachHoSoDaGui] = useState([]);
  const [soLuongHoSoGuiLen, setSoLuongHoSoGuiLen] = useState(0);
  const apiGetDanhDachHoSoDaGui = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_ByMaNhanSu?MC_TTHC_GV_GuiYeuCau_MaNhanSu=${maGiangVien}`;

  //Retry
  const retry = async (func, maxAttempts = 3, delay = 2000, backoff = 2) => {
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
          `Lần ${attempt} thất bại. Đang thử lại trong ${delay / 2000} giấy...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoff;
        attempt++;
      }
    }
  };

  //Gét mảng danh sách hồ sơ đã gửi
  const getMangDanhSachHoSoDaGui = async () => {
    const apiCall = async () => {
      const response = await axios.get(apiGetDanhDachHoSoDaGui, {
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

        setDanhSachHoSoDaGui(mangDanhSach);
        setSoLuongHoSoGuiLen(mangDanhSach.length);
      } else {
        setDanhSachHoSoDaGui([]);
        setSoLuongHoSoGuiLen(0);
      }
    };

    try {
      await retry(apiCall);
    } catch (error) {
      console.error('API call failed after multiple attempts:', error);
    }
  };

  //Định dạng ngày/ tháng/ năm
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year}`;
  };

  useEffect(() => {
    getMangDanhSachHoSoDaGui();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="THEO DÕI ĐỀ NGHỊ"
        onPress={() => {
          props.navigation.goBack();
        }}
      />

      <View style={styles.body}>
        <Text style={styles.textTieuDe}>DANH SÁCH HỒ SƠ ĐÃ GỬI</Text>

        <ScrollView horizontal>
          <ScrollView>
            <View style={styles.danhSachThuTucTieuDe}>
              <View style={styles.viewSTT}>
                <Text style={styles.text}>STT</Text>
              </View>

              <View style={styles.viewTenThuTuc}>
                <Text style={styles.text}>Tên thủ tục</Text>
              </View>

              <View style={styles.viewNgayGui}>
                <Text style={styles.text}>Ngày gửi</Text>
              </View>

              <View style={styles.viewTrangThai}>
                <Text style={styles.text}>Trạng thái</Text>
              </View>
            </View>

            <View>
              {danhSachHoSoDaGui.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    props.navigation.navigate('ChiTietHoSo', {
                      idGuiYeuCau: item.idGuiYeuCau,
                      trangThai: item.trangThai,
                    });
                  }}>
                  <View style={styles.chiTietDanhSachHoSoDaGui}>
                    <View style={styles.chiTietViewSTT}>
                      <Text style={styles.text1}>{index + 1}</Text>
                    </View>

                    <View style={styles.chiTietViewTenThuTuc}>
                      <Text style={styles.text1}>{item.tenThuTuc}</Text>
                    </View>

                    <View style={styles.chiTietViewNgayGui}>
                      <Text style={styles.text1}>
                        {item.ngayGui ? formatDate(item.ngayGui) : ''}
                      </Text>
                    </View>

                    <View style={styles.chiTietViewTrangThai}>
                      <Text style={styles.text1}>{item.trangThai}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
      </View>

      <Footer soLuongThuTuc={soLuongHoSoGuiLen} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: getWidth,
    height: getHeight,
  },

  body: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  textTieuDe: {
    color: 'black',
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 15,
  },

  danhSachThuTucTieuDe: {
    flexDirection: 'row',
    height: 30,
    marginBottom: 7,
    justifyContent: 'center',
  },

  viewSTT: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
  },

  viewTenThuTuc: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    marginLeft: 1.5,
    marginRight: 1,
  },

  viewNgayGui: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    marginRight: 1.5,
  },

  viewTrangThai: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
  },

  text: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: 'bold',
  },

  text1: {
    fontSize: 14.5,
    color: 'black',
  },

  chiTietDanhSachHoSoDaGui: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 70,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
    marginLeft: 5,
    marginRight: 5,
  },

  chiTietViewSTT: {
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
  },

  chiTietViewTenThuTuc: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
  },

  chiTietViewNgayGui: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
  },

  chiTietViewTrangThai: {
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default TheoDoiDeNghi;
