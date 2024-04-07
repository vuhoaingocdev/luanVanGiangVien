import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;

import HeaderBack from '../../../Untils/HeaderBack';
import Footer from '../../../Untils/Footer';
import axios from 'axios';
import {token} from '../../../../DangNhap/dangNhap';
import {maGiangVien} from '../../../../DangNhap/dangNhap';
import moment from 'moment';

const ChiTietHoSo = props => {
  const [openModal, setOpenModal] = useState(false);
  const [getIdGuiYeuCau, setIdGuiYeuCau] = useState(null);
  const [getTrangThai1, setTrangThai1] = useState('');
  const [thongTinHoSo, setThongTinHoSo] = useState([]);
  const [quaTrinhXuLy, setQuaTrinhXuLy] = useState([]);
  const [chiTietTiepNhanHoSo, setChiTietTiepNhanHoSo] = useState([]);

  const [hasData, setHasData] = useState(false);

  const Open = tt => {
    setOpenModal(true);
    setTrangThai1(tt);
  };

  const Close = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    const idGuiYC = props.route.params.idGuiYeuCau;
    if (idGuiYC !== '' || getTrangThai1 !== '') {
      setIdGuiYeuCau(idGuiYC);

      getThongTinHoSo(idGuiYC);

      getQuaTrinhXuLy(idGuiYC);

      getChiTietTiepNhanHoSo(idGuiYC, getTrangThai1);
    }
  }, [props.route.params.idGuiYeuCau, getTrangThai1]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (
        thongTinHoSo.length === 0 ||
        quaTrinhXuLy.length === 0 ||
        chiTietTiepNhanHoSo.length === 0
      ) {
        setHasData(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [thongTinHoSo, quaTrinhXuLy, chiTietTiepNhanHoSo]);

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
          `Lần ${attempt} thất bại. Đang thử lại trong ${delay / 2000} giây...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoff;
        attempt++;
      }
    }
  };

  const apiGetThongTinHoSo = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_R_Para_File`;
  const getThongTinHoSo = async idGuiYC => {
    const callApi = async idGuiYC => {
      const response = await axios.get(apiGetThongTinHoSo, {
        params: {MC_TTHC_GV_GuiYeuCau_ID: idGuiYC},
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
        const mangThongTinHoSo = response.data.body.map(item => ({
          tenThuTuc: item.MC_TTHC_GV_TenThuTuc,
          maThuTuc: item.MC_TTHC_GV_MaThuTuc,
          nguoiNopHoSo: item.HoTen,
          ngayGui: item.MC_TTHC_GV_GuiYeuCau_NgayGui,
          trangThai: item.MC_TTHC_GV_TrangThai_TenTrangThai,
        }));

        setThongTinHoSo(mangThongTinHoSo);
      } else {
        setThongTinHoSo([]);
      }
    };

    try {
      await retry(() => callApi(idGuiYC));
    } catch (error) {
      console.error(error);
    }
  };

  const apiGetQuaTrinhXuLy = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_TrangThai_TheoDoi_DeNghi_Load_Para`;
  const getQuaTrinhXuLy = async idGuiYC => {
    const callApi1 = async idGuiYC => {
      const response = await axios.get(apiGetQuaTrinhXuLy, {
        params: {MC_TTHC_GV_GuiYeuCau_ID: idGuiYC},
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
        const mangQuaTrinhXuLy = response.data.body.map(item => ({
          soThuTu: item.MC_TTHC_GV_TrangThai_STT,
          trangThai: item.MC_TTHC_GV_TrangThai_TenTrangThai,
          ngayXuLy: item.MC_TTHC_GV_GuiYeuCau_DateEditor,
        }));

        setQuaTrinhXuLy(mangQuaTrinhXuLy);
      } else {
        setQuaTrinhXuLy([]);
      }
    };
    try {
      await retry(() => callApi1(idGuiYC));
    } catch (error) {
      console.error(error);
    }
  };

  const apiGetChiTietTiepNhanHoSo = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_NguoiDung_TheoDoi_QuyTrinhXuLy_Load_Para`;
  const getChiTietTiepNhanHoSo = async (idGuiYC, getTrangThai1) => {
    const callApi2 = async (idGuiYC, getTrangThai1) => {
      const response = await axios.get(apiGetChiTietTiepNhanHoSo, {
        params: {
          MC_TTHC_GV_GuiYeuCau_ID: idGuiYC,
          MC_TTHC_GV_TrangThai_TenTrangThai: getTrangThai1,
        },
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
        const mangChiTietTiepNhanHoSo = response.data.body.map(item => ({
          nguoiXuLy: item.HoTen,
          ngayHenTra: item.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
          noiTraKetQua: item.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
          ngayXuLy1: item.MC_TTHC_GV_GuiYeuCau_DateEditor,
        }));

        setChiTietTiepNhanHoSo(mangChiTietTiepNhanHoSo);
      } else {
        setChiTietTiepNhanHoSo([]);
      }
    };
    try {
      await retry(() => callApi2(idGuiYC, getTrangThai1));
    } catch (error) {
      console.error(error);
    }
  };

  //Số lượng hồ sơ gửi lên
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
    const interval = setInterval(() => {
      getSoLuong();
    }, 1500);

    return () => clearInterval(interval);
  }, []);
  
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="CHI TIẾT HỒ SƠ"
        onPress={() => {
          props.navigation.goBack();
        }}
      />

      <View style={styles.body}>
        <ScrollView>
          {/* Thông tin hồ sơ */}

          <View style={styles.viewThongTinHoSo}>
            <Text style={styles.textTieuDe}>I. THÔNG TIN HỒ SƠ:</Text>
            {thongTinHoSo.length !== 0 ? (
              thongTinHoSo.map((item, index) => (
                <View key={index}>
                  <View style={styles.viewText}>
                    <Text style={styles.textBold}>Thủ tục</Text>
                    <Text style={styles.text11}>: {item.tenThuTuc}</Text>
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textBold}>Mã hồ sơ</Text>
                    <Text style={styles.text}>: {item.maThuTuc}</Text>
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textBold}>Người nộp hồ sơ</Text>
                    <Text style={styles.text}>: {item.nguoiNopHoSo}</Text>
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textBold}>Ngày gửi</Text>
                    <Text style={styles.text}>
                      :{' '}
                      {item.ngayGui
                        ? moment(item.ngayGui).format('DD/MM/YYYY HH:mm:ss')
                        : ''}
                    </Text>
                  </View>
                  <View style={styles.viewText}>
                    <Text style={styles.textBold}>Trạng thái</Text>
                    <Text style={styles.text}>: {item.trangThai}</Text>
                  </View>
                </View>
              ))
            ) : hasData ? (
              <View style={styles.viewNoData}>
                <Text style={styles.textNoData}>Không có dữ liệu!</Text>
              </View>
            ) : (
              <View style={styles.viewModel}>
                <View style={styles.loaderContainer}>
                  <ActivityIndicator
                    color="gray"
                    size="small"
                    style={{borderRadius: 10, overflow: 'hidden'}}
                  />
                  <Text style={{color: 'gray', fontSize: 20, marginLeft: 15}}>
                    Vui lòng đợi...
                  </Text>
                </View>
              </View>
            )}
          </View>

          <Text style={[styles.textTieuDe, {marginTop: 25, marginLeft: 7}]}>
            II. QUÁ TRÌNH XỬ LÝ:
          </Text>

          <View>
            <ScrollView horizontal>
              <ScrollView>
                <View style={styles.danhSachThuTucTieuDe}>
                  <View style={styles.viewBuoc}>
                    <Text style={styles.textWhite}>Bước</Text>
                  </View>

                  <View style={styles.viewTenCongViec}>
                    <Text style={styles.textWhite}>Công việc</Text>
                  </View>

                  <View style={styles.viewNgayXuLy}>
                    <Text style={styles.textWhite}>Ngày xử lý</Text>
                  </View>
                </View>

                <View>
                  {quaTrinhXuLy.length !== 0 ? (
                    quaTrinhXuLy.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          Open(item.trangThai);
                        }}>
                        <View style={styles.chiTietDanhSachHoSo}>
                          <View style={styles.chiTietViewBuoc}>
                            <Text style={styles.text}>{item.soThuTu}</Text>
                          </View>
                          <View style={styles.chiTietViewTenCongViec}>
                            <Text style={styles.text}>{item.trangThai}</Text>
                          </View>
                          <View style={styles.chiTietViewNgayXuLy}>
                            <Text style={styles.text}>
                              {item.ngayXuLy
                                ? moment(item.ngayXuLy).format(
                                    'DD/MM/YYYY HH:mm:ss',
                                  )
                                : ''}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : hasData ? (
                    <View style={styles.viewNoData}>
                      <Text style={styles.textNoData}>Không có dữ liệu!</Text>
                    </View>
                  ) : (
                    <View style={styles.viewModel}>
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator
                          color="gray"
                          size="small"
                          style={{borderRadius: 10, overflow: 'hidden'}}
                        />
                        <Text
                          style={{color: 'gray', fontSize: 20, marginLeft: 15}}>
                          Vui lòng đợi...
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </ScrollView>
            </ScrollView>
          </View>
        </ScrollView>

        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={openModal}
            onRequestClose={Close}>
            <View style={styles.containerModal}>
              <View style={styles.modalView}>
                <View style={styles.viewTextAndClose}>
                  <Text style={styles.TitleText}>
                    Chi tiết thực hiện của công việc:
                  </Text>
                </View>

                <Text
                  style={[
                    styles.TitleText,
                    {
                      textDecorationLine: 'underline',
                      marginTop: 10,
                      marginBottom: 10,
                    },
                  ]}>
                  {getTrangThai1}
                </Text>

                <ScrollView horizontal>
                  <ScrollView>
                    <View style={styles.danhSachThuTucTieuDe1}>
                      <View style={styles.viewSTT}>
                        <Text style={styles.textWhite1}>STT</Text>
                      </View>

                      <View style={styles.viewNguoiXyLy}>
                        <Text style={styles.textWhite1}>Người xử lý</Text>
                      </View>

                      <View style={styles.viewNgayHenTra}>
                        <Text style={styles.textWhite1}>Ngày hẹn trả</Text>
                      </View>

                      <View style={styles.viewNoiTraKetQua}>
                        <Text style={styles.textWhite1}>Nơi trả kết quả</Text>
                      </View>
                      <View style={styles.viewNgayXuLi}>
                        <Text style={styles.textWhite1}>Ngày xử lý</Text>
                      </View>
                    </View>

                    {chiTietTiepNhanHoSo.length !== 0 ? (
                      chiTietTiepNhanHoSo.map((item, index) => (
                        <View style={styles.chiTietDanhSachHoSo1} key={index}>
                          <View style={styles.viewChiTietSTT}>
                            <Text style={styles.text1}>{index + 1}</Text>
                          </View>

                          <View style={styles.viewChiTietNguoiXyLy}>
                            <Text style={styles.text1}>{item.nguoiXuLy} </Text>
                          </View>

                          <View style={styles.viewChiTietNgayHenTra}>
                            <Text style={styles.text1}>
                              {item.ngayHenTra
                                ? moment(item.ngayHenTra).format(
                                    'DD/MM/YYYY HH:mm:ss',
                                  )
                                : ''}
                            </Text>
                          </View>

                          <View style={styles.viewChiTietNoiTraKetQua}>
                            <Text style={styles.text1}>
                              {item.noiTraKetQua}{' '}
                            </Text>
                          </View>

                          <View style={styles.viewChiTietNgayXuLy}>
                            <Text style={styles.text1}>
                              {item.ngayXuLy1
                                ? moment(item.ngayXuLy1).format(
                                    'DD/MM/YYYY HH:mm:ss',
                                  )
                                : ''}
                            </Text>
                          </View>
                        </View>
                      ))
                    ) : hasData ? (
                      <View style={styles.viewNoData}>
                        <Text style={styles.textNoData}>Không có dữ liệu!</Text>
                      </View>
                    ) : (
                      <View style={styles.viewModel}>
                        <View style={styles.loaderContainer}>
                          <ActivityIndicator
                            color="gray"
                            size="small"
                            style={{borderRadius: 10, overflow: 'hidden'}}
                          />
                          <Text
                            style={{
                              color: 'gray',
                              fontSize: 20,
                              marginLeft: 15,
                            }}>
                            Vui lòng đợi...
                          </Text>
                        </View>
                      </View>
                    )}
                  </ScrollView>
                </ScrollView>
                <TouchableOpacity style={styles.closeButton} onPress={Close}>
                  <Text style={styles.textStyle}>Đóng</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      <Footer soLuongThuTuc={soLuongThuGuiLen} />
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

  viewThongTinHoSo: {
    width: 0.95 * getWidth,
    marginTop: 20,
    marginLeft: 7,
  },

  textTieuDe: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
  },

  text: {
    color: 'black',
    fontSize: 14.5,
  },

  text11: {
    color: 'black',
    fontSize: 14.5,
    width: 270,
  },

  textBold: {
    width: 130,
    color: 'black',
    fontSize: 14.5,
    fontWeight: 'bold',
  },

  textWhite: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },

  viewText: {
    flexDirection: 'row',
    marginTop: 10,
    width: getWidth - 120,
  },

  danhSachThuTucTieuDe: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 7,
    marginTop: 8,
    justifyContent: 'center',
    marginHorizontal: 5,
  },

  danhSachThuTucTieuDe1: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 7,
    marginTop: 8,
  },

  viewBuoc: {
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
  },

  viewTenCongViec: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    marginLeft: 1.5,
    marginRight: 1.5,
  },

  viewNgayXuLy: {
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
  },

  chiTietDanhSachHoSo: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 67,
    marginBottom: 13,
    borderRadius: 8,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
    marginHorizontal: 5,
  },

  chiTietViewBuoc: {
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  chiTietViewTenCongViec: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  chiTietViewNgayXuLy: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalView: {
    alignItems: 'center',
    width: 0.95 * getWidth,
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
    fontSize: 20,
    fontWeight: 'bold',
  },

  textWhite1: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  text1: {
    color: 'black',
    fontSize: 14.5,
    textAlign: 'center',
  },

  viewSTT: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNguoiXyLy: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNgayHenTra: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNoiTraKetQua: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNgayXuLi: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
  },

  chiTietDanhSachHoSo1: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 65,
    marginBottom: 13,
    borderRadius: 8,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 7,
  },

  viewChiTietSTT: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNguoiXyLy: {
    width: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNgayHenTra: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNoiTraKetQua: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNgayXuLy: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8ff',
  },

  viewTextAndClose: {
    flexDirection: 'row',
  },

  viewModel: {
    height: 60,
    width: 160,
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  viewModalCotainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewNoData: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  textNoData: {
    fontSize: 17,
    color: 'red',
    fontWeight: 'bold',
  },
});

export default ChiTietHoSo;
