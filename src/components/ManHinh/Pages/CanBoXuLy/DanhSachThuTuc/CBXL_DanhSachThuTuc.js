import React, {useState, useEffect, useMemo} from 'react';
import {
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Linking,
} from 'react-native';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;

import axios from 'axios';
import Header from '../../../Untils/Header';
import Footer from '../../../Untils/Footer';
import ModalThongBao from '../../../Untils/ModalThongBao';
import ModalDonViVaLinhVuc from '../../../Untils/ModalDonViVaLinhVuc';
import {maGiangVien, token} from '../../../../DangNhap/dangNhap';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalTheoDoiHoSoVaHoSoCanXuLy from '../../../Untils/ModalTheoDoiHoSoVaHoSoCanXuLy';
import moment from 'moment';
import {
  getThongTinhGiangVien,
  ThongTinGiangVien,
} from '../../../../../api/GetThongTin/ThongTinGiangVien';
export var IDthutuc;
export var MangQuyen = [];
const Dieu_Kien_Da_Hoan_Thanh = 'Đã hoàn thành';

const CBXL_DanhSachThuTuc = props => {
  const [openModalThongTinHoSo, setOpenModalThongTinHoSo] = useState(false);
  const [thongTinTimKiem, setThongTinTimKiem] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [getTenDonVi, setTenDonVi] = useState('');
  const [getTenLinhVuc, setTenLinhVuc] = useState('');
  const [modalDVLV, setModalDVLV] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [locThuTucTheoDonVi, setLocThuTucTheoDonVi] = useState([]);
  const [showModalCBXL, setShowModalCBXL] = useState(false);

  const [clickTrangChu, setClickTrangChu] = useState(true);
  const [clickCBNV, setClickCBNV] = useState(false);
  const [checkPhanQuyen, setCheckPhanQuyen] = useState(false);
  const [mangQuyen, setMangQuyen] = useState([]);
  const [thongTinHoSoModal, setThongTinHoSoModal] = useState({});

  const [dataGiangVien, setDataGiangVien] = useState({});

  const [viTri, setViTri] = useState(0);
  const soLuongBanGhiHienThi = 10;

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

  //Lấy dữ liệu từ api in ra danh sách thủ tục
  const [dataThuTuc, setDataThuTuc] = useState([]);
  const apiGetDuLieuDanhSachThuTuc =
    'https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/TimKiemThuTuc?MC_TTHC_GV_DieuKienLoc=MaThuTuc';
  const getMangDanhSachThuTuc = async () => {
    const callApi = async () => {
      const response = await axios.get(apiGetDuLieuDanhSachThuTuc, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (
        response.status != 400 &&
        response.data &&
        response.data.body &&
        response.data.body.length > 0
      ) {
        const mangDanhSach = response.data.body.map(item => ({
          IDthutuc: item.MC_TTHC_GV_ID,
          tenThuTuc: item.MC_TTHC_GV_TenThuTuc,
          mucDo: item.MC_TTHC_GV_IDMucDo,
          tenLinhVuc: item.MC_TTHC_GV_LinhVuc,
          tenDonVi: item.MC_TTHC_GV_NoiTiepNhan,
        }));

        setDataThuTuc(mangDanhSach);

        if (getTenDonVi !== '' && getTenLinhVuc !== '') {
          const filtered1 = mangDanhSach.filter(
            item =>
              item.tenDonVi === getTenDonVi &&
              item.tenLinhVuc === getTenLinhVuc,
          );
          setLocThuTucTheoDonVi(filtered1);
          //setViTri(0);
        } else if (getTenDonVi !== '') {
          const filtered = mangDanhSach.filter(
            item => item.tenDonVi === getTenDonVi,
          );
          setLocThuTucTheoDonVi(filtered);
          //setViTri(0);
        } else {
          setLocThuTucTheoDonVi(mangDanhSach);
        }
      } else {
        setDataThuTuc([]);
      }
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error('CBXL_Danh sach thu tuc - Get danh sách thủ tục', error);
    }
  };

  //Danh sách hồ sơ đề nghị bên Cán bộ xử lí
  const [danhSachHoSoGuiLen, setDanhSachHoSoGuiLen] = useState([]);
  const [danhSachHoSoGuiLenGoc, setDanhSachHoSoGuiLenGoc] = useState([]);
  const apiGetDSHSGL = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_DuLieu_ByMaNhanSu?DieuKienLoc=0&MaNhanSu=${maGiangVien}`;
  const getMangDanhSachHoSoGuiLen = async () => {
    const callApi1 = async () => {
      const response = await axios.get(apiGetDSHSGL, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (
        response.status != 400 &&
        response.data &&
        response.data.body &&
        response.data.body.length > 0
      ) {
        const mangDanhSachHoSoGuiLen = response.data.body.map(item => ({
          IDGuiYeuCau: item.MC_TTHC_GV_GuiYeuCau_ID,
          TenHoSo: item.MC_TTHC_GV_TenThuTuc,
          DonViCaNhanGui: item.HoTen,
          DonViCaNhanTiepNhan: item.MC_TTHC_GV_NoiTiepNhan,
          TrangThai: item.MC_TTHC_GV_TrangThai_TenTrangThai,
          NgayHenTra: item.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
          NgayNopHoSo: item.MC_TTHC_GV_GuiYeuCau_NgayGui,
          ToChucCaNhanNopHoSo: item.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
        }));

        setDanhSachHoSoGuiLen(mangDanhSachHoSoGuiLen);
        setDanhSachHoSoGuiLenGoc(mangDanhSachHoSoGuiLen);
      } else {
        setDanhSachHoSoGuiLen([]);
        setDanhSachHoSoGuiLenGoc([]);
      }
    };
    try {
      await retry(callApi1);
    } catch (error) {
      console.error('CBXL_Danh sach thu tuc - Gét mảng hồ sơ gửi lên', error);
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

  const [dieuKien, setDieuKien] = useState('');
  const danhSachHienThi = useMemo(() => {
    if (dieuKien === '') {
      return danhSachHoSoGuiLen;
    }
    if (dieuKien === Dieu_Kien_Da_Hoan_Thanh) {
      return danhSachHoSoGuiLen.filter(
        item => item.TrangThai !== Dieu_Kien_Da_Hoan_Thanh,
      );
    }

    return [];
  }, [danhSachHoSoGuiLen, dieuKien]);

  //Lọc những thủ tục có trạng thái là đã hoàn thành
  const ThuTucChuaHoanThanh = () => {
    setDieuKien(Dieu_Kien_Da_Hoan_Thanh);
  };

  const TheoDoiHoSo = () => {
    setDieuKien('');
  };

  //Tìm kiếm thủ tục
  const TimKiemThuTuc = () => {
    if (thongTinTimKiem === '') {
      setLocThuTucTheoDonVi(dataThuTuc);
    } else {
      let ketQuaTimKiem = [];
      //Tìm kiếm trên danh sách đã lọc
      if (getTenDonVi !== '' || getTenLinhVuc !== '') {
        ketQuaTimKiem = locThuTucTheoDonVi.filter(item => {
          const tenThuTucLowerCase = item.tenThuTuc.toLowerCase();
          const thongTinTimKiemLowerCase = thongTinTimKiem.toLowerCase();
          return tenThuTucLowerCase.includes(thongTinTimKiemLowerCase);
        });
      } else {
        ketQuaTimKiem = dataThuTuc.filter(item => {
          const tenThuTucLowerCase = item.tenThuTuc.toLowerCase();
          const thongTinTimKiemLowerCase = thongTinTimKiem.toLowerCase();
          return tenThuTucLowerCase.includes(thongTinTimKiemLowerCase);
        });
      }
      setLocThuTucTheoDonVi(ketQuaTimKiem);
    }
  };

  //Tìm kiếm hồ sơ gửi yêu cầu
  const TimKiemDanhSachHoSoGuiLen = () => {
    if (thongTinTimKiem === '') {
      setDanhSachHoSoGuiLen(danhSachHoSoGuiLenGoc); // Khôi phục dữ liệu gốc khi không có tên tìm kiếm
    } else {
      let kqTimKiem = danhSachHoSoGuiLenGoc.filter(item => {
        const tenHoSoTimKiemLowerCase = item.TenHoSo.toLowerCase();
        const thongtinTimKiemLowerCase = thongTinTimKiem.toLowerCase();
        return tenHoSoTimKiemLowerCase.includes(thongtinTimKiemLowerCase);
      });
      setDanhSachHoSoGuiLen(kqTimKiem);
    }
  };

  //Đăng xuất
  const xuLyDangXuat = async () => {
    try {
      await AsyncStorage.multiRemove(['username', 'password']);
      props.navigation.navigate('DangNhap');
    } catch (error) {
      console.log('Lỗi khi đăng xuất: ', error.message);
    }
  };

  //Hướng dẫn sử dụng
  const HuongDanSuDung = () => {
    const videoURL = 'https://www.youtube.com/@nokia88e1';
    Linking.openURL(videoURL).catch(err =>
      console.error('Không thể mở trình duyệt:', err),
    );
  };

  //Dữ liệu hiển thị cho phần trang chủ
  const duLieuHienTai = locThuTucTheoDonVi.slice(
    viTri,
    viTri + soLuongBanGhiHienThi,
  );

  //Dữ liệu hiển thị cho phần Cán bộ nghiệp vụ
  const dataCurent = useMemo(() => {
    return danhSachHienThi?.slice(viTri, viTri + soLuongBanGhiHienThi) || [];
  }, [danhSachHienThi, viTri, soLuongBanGhiHienThi]);

  //Button footer
  const handleNextPage = () => {
    if (viTri + soLuongBanGhiHienThi < locThuTucTheoDonVi.length) {
      setViTri(viTri + soLuongBanGhiHienThi);
    }
  };

  const handleNextPage1 = () => {
    if (viTri + soLuongBanGhiHienThi < danhSachHoSoGuiLen.length) {
      setViTri(viTri + soLuongBanGhiHienThi);
    }
  };

  const handlePrePage = () => {
    if (viTri - soLuongBanGhiHienThi >= 0) {
      setViTri(viTri - soLuongBanGhiHienThi);
    }
  };

  const handlePrePrePage = () => {
    setViTri(0);
  };

  const handleNextNextPage = () => {
    const tongSoTrang = Math.ceil(
      locThuTucTheoDonVi.length / soLuongBanGhiHienThi,
    );
    const trangCuoiCung = (tongSoTrang - 1) * soLuongBanGhiHienThi;
    setViTri(trangCuoiCung);
  };

  const handleNextNextPage1 = () => {
    const tongSoTrang = Math.ceil(
      danhSachHoSoGuiLen.length / soLuongBanGhiHienThi,
    );
    const trangCuoiCung = (tongSoTrang - 1) * soLuongBanGhiHienThi;
    setViTri(trangCuoiCung);
  };

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };

  const openModalDVLV = () => {
    setModalDVLV(true);
  };

  const closeModalDVLV = () => {
    setModalDVLV(false);
  };

  const openModalCBXL = () => {
    setShowModalCBXL(true);
  };

  const closeModalCBXL = () => {
    setShowModalCBXL(false);
  };

  const handleMenuPress = () => {
    setShowOverlay(!showOverlay);
  };

  //Onclick
  const onClickTrangChu = () => {
    setClickTrangChu(true);
    setClickCBNV(false);
  };

  const onClickCBNV = () => {
    setClickTrangChu(false);
    setClickCBNV(true);
  };

  //UseEffect lấy danh sách thủ tục, danh sách hồ sơ gửi lên
  useEffect(() => {
    getMangDanhSachThuTuc();
    getMangDanhSachHoSoGuiLen();
  }, [getTenDonVi, getTenLinhVuc]);

  //UseEffect lấy thông tin của giảng viên
  useEffect(() => {
    getThongTinhGiangVien().then(ThongTinGiangVien => {
      setDataGiangVien(ThongTinGiangVien);
    });
  }, []);

  //UseEffect lấy phần quyền giảng viên và cán bộ xử lý
  useEffect(() => {
    if (dataGiangVien.HT_GROUPUSER_ID) {
      setMangQuyen(dataGiangVien.HT_GROUPUSER_ID);
      MangQuyen = dataGiangVien.HT_GROUPUSER_ID;
    }
    return () => {
      setMangQuyen([]);
    };
  }, [dataGiangVien]);

  //UseEffect tìm kiếm
  useEffect(() => {
    TimKiemThuTuc();
    TimKiemDanhSachHoSoGuiLen();
  }, [thongTinTimKiem]);

  //UseEffect so sánh quyền
  useEffect(() => {
    if (mangQuyen.length) {
      soSanhQuyen();
    }
  }, [mangQuyen]);

  useEffect(() => {
    getSoLuong();
  }, []);

  //Modal thông tin hồ sơ
  const openThongTinHoSo = item => {
    setOpenModalThongTinHoSo(true);
    setThongTinHoSoModal(item);
  };

  const closeThongTinHoSo = () => {
    setOpenModalThongTinHoSo(false);
  };

  //Phân quyền
  const soSanhQuyen = () => {
    setCheckPhanQuyen(mangQuyen.some(e => e == 16 || e == 24 || e == 25));
  };

  //Định dangh ngày/tháng/năm
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? '0' + day : day}/${
      month < 10 ? '0' + month : month
    }/${year}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="THỦ TỤC HÀNH CHÍNH" onPress={handleMenuPress} />

      {showOverlay && (
        <Modal transparent={true} animationType="slide">
          <TouchableWithoutFeedback onPress={handleMenuPress}>
            <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
              <View style={[styles.viewDrawer]}>
                <View style={{marginTop: 90}}>
                  <TouchableOpacity onPress={handleMenuPress}>
                    <Image
                      source={require('../../../../../images/menu.png')}
                      style={styles.iconMenu}
                    />
                  </TouchableOpacity>

                  <View style={[styles.drawerText, {marginTop: 20}]}>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('TrangCaNhan');
                      }}>
                      <View style={styles.viewTouchableOpacity}>
                        <Image
                          source={require('../../../../../images/person.png')}
                          style={styles.iconDrawer}
                          tintColor={'#ffffff'}
                        />
                        <Text style={styles.textTouchableOpacity}>
                          Trang cá nhân
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawerText}>
                    <TouchableOpacity onPress={HuongDanSuDung}>
                      <View style={styles.viewTouchableOpacity}>
                        <Image
                          source={require('../../../../../images/youtube.png')}
                          style={styles.iconDrawer}
                          tintColor={'#ffffff'}
                        />
                        <Text style={styles.textTouchableOpacity}>
                          Hướng dẫn sử dụng
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.drawerText}>
                    <TouchableOpacity onPress={xuLyDangXuat}>
                      <View style={styles.viewTouchableOpacity}>
                        <Image
                          source={require('../../../../../images/logout.png')}
                          style={styles.iconDrawer}
                          tintColor={'#ffffff'}
                        />
                        <Text style={styles.textTouchableOpacity}>
                          Đăng xuất
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <ModalTheoDoiHoSoVaHoSoCanXuLy
        visible={showModalCBXL}
        onClose={closeModalCBXL}
        PressHoSoCanXuLy={ThuTucChuaHoanThanh}
        PressTheoDoiHoSo={TheoDoiHoSo}
      />

      {/* <ModalThongBao
        visible={showModal}
        onClose={closeModal}
        message="Chưa hoàn thành!"
      /> */}

      <ModalDonViVaLinhVuc
        visible={modalDVLV}
        onClose={closeModalDVLV}
        getTenDonVi={getTenDonVi}
        setTenDonVi={setTenDonVi}
        getTenLinhVuc={getTenLinhVuc}
        setTenLinhVuc={setTenLinhVuc}
      />

      <View style={styles.body}>
        {/* Button trang chủ + Cán bộ xử lí */}
        {checkPhanQuyen ? (
          <View
            style={{
              width: getWidth,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 0.65 * getWidth,
                height: '100%',
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                style={{
                  width: '40%',
                  height: '55%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: clickTrangChu ? '#245d7c' : '#ffffff',
                  borderRadius: 20,
                  shadowColor: 'black',
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                  shadowOffset: {width: 0, height: 2},
                  elevation: 7,
                }}
                onPress={onClickTrangChu}>
                <Text
                  style={{
                    color: clickTrangChu ? '#ffffff' : '#245d7c',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Trang chủ
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: '55%',
                  height: '55%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: clickCBNV ? '#245d7c' : '#ffffff',
                  borderRadius: 20,
                  shadowColor: 'black',
                  shadowOpacity: 0.8,
                  shadowRadius: 4,
                  shadowOffset: {width: 0, height: 2},
                  elevation: 7,
                }}
                onPress={onClickCBNV}>
                <Text
                  style={{
                    color: clickCBNV ? '#ffffff' : '#245d7c',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  Cán bộ nghiệp vụ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Hiển thị modal */}
        {clickTrangChu ? (
          <View>
            {getTenDonVi === '' ? (
              <TouchableOpacity
                style={[
                  styles.openMenu,
                  {width: 53, marginTop: checkPhanQuyen ? 0 : 20},
                ]}
                onPress={openModalDVLV}>
                <Image
                  source={require('../../../../../images/right-arrow.png')}
                  tintColor={'#ffff'}
                  style={styles.iconOpenMenu}
                />
              </TouchableOpacity>
            ) : (
              <View style={{flex: 0.8, alignItems: 'center'}}>
                <TouchableOpacity
                  style={[styles.openMenu, {position: 'absolute', left: 0}]}
                  onPress={openModalDVLV}>
                  <Text
                    style={{color: '#ffffff', fontSize: 16, marginLeft: 20}}>
                    {getTenDonVi}
                  </Text>
                  <Image
                    source={require('../../../../../images/right-arrow.png')}
                    tintColor={'#ffff'}
                    style={[
                      styles.iconOpenMenu,
                      {marginLeft: 10, marginRight: 20},
                    ]}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <TouchableOpacity
            style={[styles.openMenu, {width: 53}]}
            onPress={openModalCBXL}>
            <Image
              source={require('../../../../../images/right-arrow.png')}
              tintColor={'#ffff'}
              style={styles.iconOpenMenu}
            />
          </TouchableOpacity>
        )}

        <View style={styles.marginBody}>
          {/* Tìm kiếm */}
          <View
            style={[
              styles.textInPutTimKiem,
              {marginTop: getTenDonVi !== '' ? 50 : 5},
            ]}>
            <TextInput
              autoCapitalize="none"
              placeholderTextColor={'gray'}
              style={[styles.textInput]}
              placeholder=" Tìm kiếm"
              value={thongTinTimKiem}
              onChangeText={text => setThongTinTimKiem(text)}
            />

            <View style={styles.containerSearchAndClose}>
              {thongTinTimKiem !== '' ? (
                <View style={styles.containerClose}>
                  <TouchableOpacity
                    onPress={() => {
                      setThongTinTimKiem('');
                    }}>
                    <Image
                      source={require('../../../../../images/icon_close.png')}
                      style={styles.image}
                      tintColor={'gray'}
                    />
                  </TouchableOpacity>
                </View>
              ) : null}

              <View
                style={[
                  styles.containerClose,
                  {position: 'absolute', right: 0},
                ]}>
                <TouchableOpacity onPress={TimKiemThuTuc}>
                  <Image
                    source={require('../../../../../images/icon_search.png')}
                    style={styles.image}
                    tintColor={'gray'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {clickTrangChu ? (
            <ScrollView horizontal>
              <ScrollView style={{height: 350}}>
                {/* Danh sách thủ tục */}
                <View style={styles.danhSachThuTucTieuDe}>
                  <View style={styles.viewSTT}>
                    <Text style={styles.text}>STT</Text>
                  </View>

                  <View style={styles.viewTenThuTuc}>
                    <Text style={styles.text}>Tên thủ tục</Text>
                  </View>

                  <View style={styles.viewLinhVuc}>
                    <Text style={styles.text}>Lĩnh vực</Text>
                  </View>
                </View>

                {/* Chi tiết danh sách tên thủ tục */}
                <View style={styles.viewData}>
                  {duLieuHienTai.map((tt, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        props.navigation.navigate('ChiTietThuTuc', {
                          IDthutuc: tt.IDthutuc,
                        });
                      }}>
                      <View style={styles.chiTietDanhSachThuTuc} key={index}>
                        <View style={styles.chiTietViewSTT}>
                          <Text style={[styles.text, {color: 'black'}]}>
                            {index + 1 + viTri}
                          </Text>
                        </View>

                        <View style={styles.chiTietViewTenThuTuc}>
                          <Text style={[styles.text2, {fontWeight: 'bold'}]}>
                            {tt.tenThuTuc}
                          </Text>

                          <View style={styles.chiTietViewTenThuTucMucDo}>
                            <Text style={[styles.text2, {marginTop: 2}]}>
                              Mức độ:
                            </Text>
                            <View style={styles.viewMucDo}>
                              <Text style={[styles.text1, {color: '#ffffff'}]}>
                                {tt.mucDo}
                              </Text>
                            </View>
                          </View>
                        </View>

                        <View style={styles.chiTietViewLinhVuc}>
                          <Text style={[styles.text1, {color: 'black'}]}>
                            {tt.tenLinhVuc}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
          ) : (
            <ScrollView horizontal>
              <ScrollView style={{height: 300, overflow: 'hidden'}}>
                {/* Danh sách các đề nghị */}
                <View style={{alignItems: 'center'}}>
                  <View style={styles.danhSachThuTucTieuDe1}>
                    <View style={styles.viewSTT1}>
                      <Text style={styles.textTieuDe1}>STT</Text>
                    </View>
                    <View style={styles.viewTenHoSo}>
                      <Text style={styles.textTieuDe1}>Tên hồ sơ</Text>
                    </View>
                    <View style={styles.viewDonViCaNhanGui}>
                      <Text style={styles.textTieuDe1}>
                        Đơn vị/ Cá nhân gửi
                      </Text>
                    </View>
                    <View style={styles.viewDonViCaNhanTiepNhan}>
                      <Text style={styles.textTieuDe1}>
                        Đơn vị/ Cá nhân tiếp nhận
                      </Text>
                    </View>
                    <View style={styles.viewTrangThaiHoSo}>
                      <Text style={styles.textTieuDe1}>Trạng thái hồ sơ</Text>
                    </View>
                  </View>
                </View>

                <View style={{alignItems: 'center'}}>
                  <View style={styles.viewData}>
                    {dataCurent.map((item, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          openThongTinHoSo(item);
                        }}>
                        <View style={styles.chiTietDanhSachHoSo} key={index}>
                          <View style={styles.viewChiTietSTT}>
                            <Text style={styles.textDuLieuHoSo}>
                              {index + 1 + viTri}
                            </Text>
                          </View>
                          <View style={styles.viewChiTietTenHoSo}>
                            <Text style={styles.textDuLieuHoSo}>
                              {item.TenHoSo}
                            </Text>
                          </View>
                          <View style={styles.viewChiTietDonViCaNhanGui}>
                            <Text style={styles.textDuLieuHoSo}>
                              {item.DonViCaNhanGui}
                            </Text>
                          </View>
                          <View style={styles.viewChiTietDonViCaNhanTiepNhan}>
                            <Text style={styles.textDuLieuHoSo}>
                              {item.DonViCaNhanTiepNhan}
                            </Text>
                          </View>
                          <View style={styles.viewChietTrangThaiHoSo}>
                            <Text
                              style={[
                                styles.textDuLieuHoSo,
                                {
                                  fontWeight: 'bold',
                                  color:
                                    item.TrangThai === 'Chưa tiếp nhận'
                                      ? '#235d7c'
                                      : item.TrangThai === 'Tiếp nhận hồ sơ'
                                      ? 'green'
                                      : 'red',
                                },
                              ]}>
                              {item.TrangThai}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </ScrollView>
          )}
        </View>

        <View>
          <Modal
            animationType="fade"
            transparent={true}
            visible={openModalThongTinHoSo}
            onRequestClose={closeThongTinHoSo}>
            <View style={styles.containerModal}>
              <View style={styles.modalView}>
                <Text
                  style={[
                    styles.TitleText,
                    {textDecorationLine: 'underline', textAlign: 'center'},
                  ]}>
                  Thông tin hồ sơ
                </Text>

                <View>
                  <Text
                    style={[
                      styles.textDuLieuThongTinHoSo,
                      {
                        marginLeft: 0,
                        fontWeight: 'bold',
                        marginTop: 20,
                        width: 300,
                      },
                    ]}>
                    {thongTinHoSoModal.TenHoSo}
                  </Text>

                  <View style={{flexDirection: 'row', width: 180}}>
                    <Text
                      style={[styles.textDuLieuThongTinHoSo, {marginLeft: 10}]}>
                      + Ngày nộp hồ sơ:
                    </Text>
                    <Text style={[styles.textDuLieuThongTinHoSo]}>
                      {' '}
                      {thongTinHoSoModal.NgayNopHoSo
                        ? formatDate(thongTinHoSoModal.NgayNopHoSo)
                        : ''}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', width: 180}}>
                    <Text
                      style={[styles.textDuLieuThongTinHoSo, {marginLeft: 10}]}>
                      + Ngày hẹn trả:
                    </Text>
                    <Text style={[styles.textDuLieuThongTinHoSo]}>
                      {' '}
                      {thongTinHoSoModal.NgayHenTra
                        ? formatDate(thongTinHoSoModal.NgayHenTra)
                        : ''}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', width: 180}}>
                    <Text
                      style={[styles.textDuLieuThongTinHoSo, {marginLeft: 10}]}>
                      + Đơn vị/ Cá nhân gửi:
                    </Text>
                    <Text style={[styles.textDuLieuThongTinHoSo]}>
                      {' '}
                      {thongTinHoSoModal.DonViCaNhanGui}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', width: 180}}>
                    <Text
                      style={[
                        styles.textDuLieuThongTinHoSo,
                        {marginLeft: 10, width: 170},
                      ]}>
                      + Đơn vị/ Cá nhân tiếp nhận:
                    </Text>
                    <Text style={[styles.textDuLieuThongTinHoSo]}>
                      {' '}
                      {thongTinHoSoModal.DonViCaNhanTiepNhan}
                    </Text>
                  </View>

                  <View style={{flexDirection: 'row', width: 180}}>
                    <Text
                      style={[styles.textDuLieuThongTinHoSo, {marginLeft: 10}]}>
                      + Trạng thái hồ sơ:
                    </Text>
                    <Text style={[styles.textDuLieuThongTinHoSo]}>
                      {' '}
                      {thongTinHoSoModal.TrangThai}
                    </Text>
                  </View>

                  <View style={{alignItems: 'center', marginTop: 20}}>
                    <TouchableOpacity
                      style={{
                        padding: 10,
                        backgroundColor: '#245d7c',
                        borderRadius: 20,
                        shadowColor: 'black',
                        shadowOpacity: 0.8,
                        shadowRadius: 4,
                        shadowOffset: {width: 0, height: 2},
                        elevation: 7,
                      }}
                      onPress={() => {
                        setOpenModalThongTinHoSo(false);
                        props.navigation.navigate('ChiTietHoSoXuLy', {
                          IDGuiYeuCau: thongTinHoSoModal.IDGuiYeuCau,
                        });
                      }}>
                      <Text
                        style={{
                          fontSize: 17,
                          fontWeight: 'bold',
                          color: '#ffffff',
                        }}>
                        Xử lý/Xem chi tiết
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={closeThongTinHoSo}>
                    <Text style={styles.textStyleClose}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </View>

      {clickTrangChu ? (
        <View style={styles.viewContainerPreNext}>
          <View style={styles.viewPreNext}>
            <TouchableOpacity
              onPress={() => {
                handlePrePrePage();
              }}>
              <View
                style={[
                  styles.viewButtonNext,
                  {
                    backgroundColor: viTri === 0 ? '#a9a9a9' : '#245d7c',
                  },
                ]}>
                <Image
                  source={require('../../../../../images/previous.png')}
                  style={styles.iconButtonNext}
                  tintColor={'#ffffff'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePrePage}>
              <View
                style={[
                  styles.viewButtonNext,
                  {
                    marginLeft: 6,
                    backgroundColor: viTri === 0 ? '#a9a9a9' : '#245d7c',
                  },
                ]}>
                <Image
                  source={require('../../../../../images/backk.png')}
                  style={styles.iconButtonNext}
                  tintColor={'#ffffff'}
                />
              </View>
            </TouchableOpacity>

            <View
              style={{
                position: 'absolute',
                right: 0,
                flexDirection: 'row',
                height: 31,
              }}>
              <TouchableOpacity onPress={handleNextPage}>
                <View
                  style={[
                    styles.viewButtonNext,
                    {
                      backgroundColor:
                        duLieuHienTai.length >= soLuongBanGhiHienThi
                          ? '#245d7c'
                          : '#a9a9a9',
                    },
                  ]}>
                  <Image
                    source={require('../../../../../images/nextt.png')}
                    style={styles.iconButtonNext}
                    tintColor={'#ffffff'}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleNextNextPage();
                }}>
                <View
                  style={[
                    styles.viewButtonNext,
                    {
                      borderRadius: 4,
                      marginLeft: 6,
                      backgroundColor:
                        duLieuHienTai.length >= soLuongBanGhiHienThi
                          ? '#245d7c'
                          : '#a9a9a9',
                    },
                  ]}>
                  <Image
                    source={require('../../../../../images/right_right.png')}
                    style={styles.iconButtonNext}
                    tintColor={'#ffffff'}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </View>
      ) : (
        <View style={styles.viewContainerPreNext}>
          <View style={styles.viewPreNext}>
            <TouchableOpacity
              onPress={() => {
                handlePrePrePage();
              }}>
              <View
                style={[
                  styles.viewButtonNext,
                  {
                    backgroundColor: viTri === 0 ? '#a9a9a9' : '#245d7c',
                  },
                ]}>
                <Image
                  source={require('../../../../../images/previous.png')}
                  style={styles.iconButtonNext}
                  tintColor={'#ffffff'}
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handlePrePage}>
              <View
                style={[
                  styles.viewButtonNext,
                  {
                    marginLeft: 6,
                    backgroundColor: viTri === 0 ? '#a9a9a9' : '#245d7c',
                  },
                ]}>
                <Image
                  source={require('../../../../../images/backk.png')}
                  style={styles.iconButtonNext}
                  tintColor={'#ffffff'}
                />
              </View>
            </TouchableOpacity>

            <View
              style={{
                position: 'absolute',
                right: 0,
                flexDirection: 'row',
                height: 31,
              }}>
              <TouchableOpacity onPress={handleNextPage1}>
                <View
                  style={[
                    styles.viewButtonNext,
                    {
                      backgroundColor:
                        duLieuHienTai.length >= soLuongBanGhiHienThi
                          ? '#245d7c'
                          : '#a9a9a9',
                    },
                  ]}>
                  <Image
                    source={require('../../../../../images/nextt.png')}
                    style={styles.iconButtonNext}
                    tintColor={'#ffffff'}
                  />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleNextNextPage1();
                }}>
                <View
                  style={[
                    styles.viewButtonNext,
                    {
                      borderRadius: 4,
                      marginLeft: 6,
                      backgroundColor:
                        duLieuHienTai.length >= soLuongBanGhiHienThi
                          ? '#245d7c'
                          : '#a9a9a9',
                    },
                  ]}>
                  <Image
                    source={require('../../../../../images/right_right.png')}
                    style={styles.iconButtonNext}
                    tintColor={'#ffffff'}
                  />
                </View>
              </TouchableOpacity>
            </View>
            {/*  */}
          </View>
        </View>
      )}

      <Footer soLuongThuTuc={soLuongThuGuiLen} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: getWidth,
    height: getHeight,
    backgroundColor: '#ffffff',
  },

  body: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    marginTop: -45,
  },

  openMenu: {
    height: 33,
    backgroundColor: '#245d7c',
    marginTop: 5,
    borderTopLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  iconOpenMenu: {
    width: 16,
    height: 16,
  },

  containerSearchAndClose: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 70,
    height: 44,
    flexDirection: 'row',
  },

  containerClose: {
    width: '60%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  textInput: {
    width: '100%',
    fontSize: 16,
    borderColor: 'gray',
    borderWidth: 0.7,
    padding: 3,
    borderRadius: 20,
    color: 'black',
  },

  image: {
    width: 16,
    height: 16,
    marginTop: 8,
  },

  marginBody: {
    marginLeft: 10,
    marginRight: 10,
  },

  danhSachThuTucTieuDe: {
    flexDirection: 'row',
    height: 35,
    marginBottom: 8,
  },

  danhSachThuTucTieuDe1: {
    flexDirection: 'row',
    height: 60,
    marginBottom: 8,
  },

  text: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: 'bold',
  },

  textTieuDe1: {
    color: '#ffffff',
    fontSize: 14.5,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  text1: {
    fontSize: 14.5,
  },

  textDuLieuHoSo: {
    color: 'black',
    fontSize: 14.5,
    textAlign: 'center',
  },

  textDuLieuThongTinHoSo: {
    color: 'black',
    fontSize: 16,
    marginBottom: 6,
  },

  text2: {
    fontSize: 14.5,
    marginLeft: 10,
    color: 'black',
  },

  viewSTT: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
    borderBottomLeftRadius: 13,
  },

  viewTenThuTuc: {
    width: 260,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    marginLeft: 1.5,
    marginRight: 1,
  },

  viewLinhVuc: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
    borderBottomRightRadius: 13,
  },

  chiTietDanhSachThuTuc: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 85,
    borderWidth: 0.5,
    marginBottom: 15,
    borderRadius: 8,
    borderColor: 'gray',
    // shadowColor: 'gray',
    // shadowOpacity: 0.4,
    // shadowRadius: 4,
    // shadowOffset: {width: 0, height: 2},
    // elevation: 6,
  },

  chiTietViewSTT: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
  },

  chiTietViewTenThuTuc: {
    width: 260,
    marginLeft: 1.5,
    marginRight: 1,
    justifyContent: 'center',
  },

  chiTietViewLinhVuc: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftWidth: 0.3,
    borderLeftColor: 'gray',
  },

  chiTietViewTenThuTucMucDo: {
    flexDirection: 'row',
    marginTop: 10,
  },

  viewMucDo: {
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
    borderRadius: 20,
    marginLeft: 5,
    marginTop: 5,
  },

  viewData: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.3,
    marginBottom: 10,
  },

  viewContainerPreNext: {
    height: 31,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 15,
  },

  viewPreNext: {
    width: 270,
    height: '100%',
    flexDirection: 'row',
  },

  viewButtonNext: {
    width: 31,
    height: '100%',
    backgroundColor: '#a9a9a9',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },

  iconButtonNext: {
    height: 19,
    width: 19,
  },

  viewDrawer: {
    width: (2 * getWidth) / 3,
    height: getHeight,
    backgroundColor: '#245d7c',
  },

  iconMenu: {
    height: 30,
    width: 25,
    tintColor: '#fff',
    marginLeft: 15,
  },

  drawerText: {
    marginLeft: 40,
    marginTop: 20,
  },

  viewTouchableOpacity: {
    flexDirection: 'row',
  },

  iconDrawer: {
    width: 28,
    height: 28,
  },

  textTouchableOpacity: {
    color: '#ffffff',
    fontSize: 19,
    marginLeft: 15,
    fontWeight: 'bold',
  },

  textInPutTimKiem: {
    marginBottom: 15,
    width: 50,
    width: '100%',
    flexDirection: 'row',
  },

  viewSTT1: {
    width: 70,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 8,
    borderRightColor: '#ffffff',
    borderRightWidth: 1,
  },

  viewTenHoSo: {
    width: 180,
    justifyContent: 'center',
    backgroundColor: '#245d7c',
    borderRightColor: '#ffffff',
    borderRightWidth: 1,
  },

  viewDonViCaNhanGui: {
    width: 120,
    justifyContent: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderRightColor: '#ffffff',
    borderRightWidth: 1,
  },

  viewDonViCaNhanTiepNhan: {
    width: 120,
    justifyContent: 'center',
    backgroundColor: '#245d7c',
    borderRightColor: '#ffffff',
    borderRightWidth: 1,
  },

  viewTrangThaiHoSo: {
    width: 130,
    justifyContent: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 8,
  },

  chiTietDanhSachHoSo: {
    //width: 392,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    height: 70,
    marginBottom: 13,
    borderRadius: 8,
    borderColor: 'gray',
    shadowColor: 'black',
    shadowOpacity: 0.8,
    shadowRadius: 1,
    shadowOffset: {width: 0, height: 2},
    elevation: 6,
  },

  viewChiTietSTT: {
    width: 70,
    justifyContent: 'center',
    borderRightColor: 'gray',
    borderRightWidth: 0.5,
  },

  viewChiTietTenHoSo: {
    width: 180,
    justifyContent: 'center',
    borderRightColor: 'gray',
    borderRightWidth: 0.5,
  },

  viewChiTietDonViCaNhanGui: {
    width: 120,
    justifyContent: 'center',
    borderRightColor: 'gray',
    borderRightWidth: 0.5,
  },

  viewChiTietDonViCaNhanTiepNhan: {
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'gray',
    borderRightWidth: 0.5,
  },

  viewChietTrangThaiHoSo: {
    width: 130,
    justifyContent: 'center',
  },

  containerModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalView: {
    width: 0.85 * getWidth,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
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
    fontSize: 22,
    fontWeight: 'bold',
  },

  closeButton: {
    width: '100%',
    borderTopWidth: 0.3,
    marginTop: 10,
    borderColor: 'gray',
  },

  textStyleClose: {
    fontSize: 21,
    color: '#1e90ff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 15,
  },
});
export default CBXL_DanhSachThuTuc;
