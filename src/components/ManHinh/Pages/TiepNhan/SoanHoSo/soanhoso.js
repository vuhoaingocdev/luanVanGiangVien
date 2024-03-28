import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  Button,
  Alert,
} from 'react-native';
import {DataTable, TextInput} from 'react-native-paper';
import Footer from '../../../Untils/Footer';
import HeaderBack from '../../../Untils/HeaderBack';
import {
  TableData1,
  TableData2,
  TableData3,
} from '../ChiTietThuTuc/ChiTietThuTuc';
import DocumentPicker from 'react-native-document-picker';
import CheckBox from 'react-native-check-box';
import moment from 'moment';
import {token} from '../../../../DangNhap/dangNhap';
import axios from 'axios';
const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
import RNFS from 'react-native-fs';
import babelConfig from '../../../../../../babel.config';
import ModalThongBao from '../../../Untils/ModalThongBao';
import {
  ThongTinGiangVien,
  getThongTinhGiangVien,
} from '../../../../../api/GetThongTin/ThongTinGiangVien';
import Index from '../..';
const Soanhoso = props => {
  const [checkboxColor, setCheckboxColor] = useState('#245d7c');
  const [checkboxUncheckedColor, setCheckboxUncheckedColor] = useState('gray');
  const [base64Content, setBase64] = useState('');
  const [email, setemail] = useState('');
  const [sdt, setsdt] = useState('');
  const [nd, setnd] = useState('');
  const [sl, setsl] = useState('');
  const [FileName, setFileName] = useState([]);

  const readFileAsBase64 = async fileUri => {
    try {
      const base64Data = await RNFS.readFile(fileUri, 'base64');
      return base64Data;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };

  //Chọn file
  const chooseFile = async index => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: true,
      });
      console.log(res[index].uri);
      setFileName(FileName => FileName.push(res[index].name));
      const base64Content1 = await readFileAsBase64(res[index].uri);
      setBase64('data:' + res[index].type + ';base64,' + base64Content1);
      setdatafile(dataFile =>
        dataFile.push({
          MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_IDGoc:
            TableData1.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
          MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_IDThanhPhanHoSo: 1,
          MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_DataFile: base64Content,
          MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_TenFile: res[index].name,
        }),
      );

      //console.log(base64Content);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Hủy chọn tệp');
      } else {
        console.error('Lỗi:', err);
      }
    }
  };
  useEffect(() => {
    getThongTinhGiangVien();
  }, []);
  const apiPhucKhao =
    'https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Add_Para';
  const PostYeuCau = async () => {
    var postdata = {
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu: ThongTinGiangVien.MaNhanSu,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email: email,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT: sdt,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa: ThongTinGiangVien.ChuyenMon,
      MC_TTHC_GV_GuiYeuCau_YeuCau_ID: TableData1.MC_TTHC_GV_GuiYeuCau_YeuCau_ID,
      MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu: nd,
      MC_TTHC_GV_GuiYeuCau_TrangThai_ID: TableData1.MC_TTHC_GV_IDMucDo,
      MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu: '',
      MC_TTHC_GV_GuiYeuCau_NgayGui: moment
        .utc(moment(), 'DD/MM/YYYY')
        .toISOString(),
      MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong: sl,
      MC_TTHC_GV_GuiYeuCau_DaNop: 'true',
      MC_TTHC_GV_GuiYeuCau_NgayHenTra: TableData1.MC_TTHC_GV_DateEditor,
      MC_TTHC_GV_GuiYeuCau_NgayGiaoTra: TableData1.MC_TTHC_GV_DateCreate,
      MC_TTHC_GV_GuiYeuCau_NoiTraKetQua: TableData1.MC_TTHC_GV_NoiTraKetQua,
      MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: FileName,
      MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: base64Content,
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong:
        TableData1.MC_TTHC_GV_IsTruongPhongPheDuyet,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: 'string',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH:
        TableData1.MC_TTHC_GV_IsBGHPheDuyet,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: 'string',
      MC_TTHC_GV_GuiYeuCau_NguonTiepNhan: TableData1.MC_TTHC_GV_NguonTiepNhan,
    };

    try {
      const response = await axios.post(apiPhucKhao, postdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.message === 'Bản ghi bị trùng.') {
        handleModalPress();
      } else {
        if (response.status == 200) {
          handleModalPress1();
        }
      }

      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const apihoso =
    'https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_ThanhPhanHoSoTiepNhan/GuiYeuCau_Add_Para';
  const [dataFile, setdatafile] = useState([]);
  const PostYeuCau2 = async () => {
    await PostYeuCau();

    try {
      const response = await axios.post(apihoso, dataFile, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.message === 'Bản ghi bị trùng.') {
        handleModalPress();
      } else {
        if (response.status == 200) {
          handleModalPress1();
        }
      }

      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
    }
  };
  const validateEmail = email => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateSDT = sdt => {
    const sdtRegex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    return sdtRegex.test(sdt);
  };
  /////Thông Báo
  const [showModal, setShowModal] = useState(false);
  const handleModalPress = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };
  const [showModal1, setShowModal1] = useState(false);
  const handleModalPress1 = () => {
    setShowModal1(true);
  };
  const handleCloseModal1 = () => {
    setShowModal1(false);
  };
  const [showModal2, setShowModal2] = useState(false);
  const handleModalPress2 = () => {
    setShowModal2(true);
  };
  const handleCloseModal2 = () => {
    setShowModal2(false);
  };
  const [showModal3, setShowModal3] = useState(false);
  const handleModalPress3 = () => {
    setShowModal3(true);
  };
  const handleCloseModal3 = () => {
    setShowModal3(false);
  };
  const [showModal4, setShowModal4] = useState(false);
  const handleModalPress4 = () => {
    setShowModal4(true);
  };
  const handleCloseModal4 = () => {
    setShowModal4(false);
  };
  const [showModal5, setShowModal5] = useState(false);
  const handleModalPress5 = () => {
    setShowModal5(true);
  };
  const handleCloseModal5 = () => {
    setShowModal5(false);
  };
  const [showModal6, setShowModal6] = useState(false);
  const handleModalPress6 = () => {
    setShowModal6(true);
  };
  const handleCloseModal6 = () => {
    setShowModal6(false);
  };
  const [showModal7, setShowModal7] = useState(false);
  const handleModalPress7 = () => {
    setShowModal7(true);
  };
  const handleCloseModal7 = () => {
    setShowModal7(false);
  };
  const [showModal8, setShowModal8] = useState(false);
  const handleModalPress8 = () => {
    setShowModal8(true);
  };
  const handleCloseModal8 = () => {
    setShowModal8(false);
  };
  const [showModal9, setShowModal9] = useState(false);
  const handleModalPress9 = () => {
    setShowModal9(true);
  };
  const handleCloseModal9 = () => {
    setShowModal9(false);
  };
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="SOẠN HỒ SƠ"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ModalThongBao
        visible={showModal}
        onClose={handleCloseModal}
        message="Yêu cầu này đã được gửi!"
      />
      <ModalThongBao
        visible={showModal1}
        onClose={handleCloseModal1}
        message="Yêu cầu được gửi thành công!"
      />
      <ModalThongBao
        visible={showModal2}
        onClose={handleCloseModal2}
        message="Bạn chưa nhập Email!"
      />
      <ModalThongBao
        visible={showModal6}
        onClose={handleCloseModal6}
        message="Bạn chưa nhập Số điện thoại!"
      />
      <ModalThongBao
        visible={showModal3}
        onClose={handleCloseModal3}
        message="Bạn chưa nhập nội dung!"
      />
      <ModalThongBao
        visible={showModal4}
        onClose={handleCloseModal4}
        message="Bạn chưa nhập số lượng bản!"
      />
      <ModalThongBao
        visible={showModal5}
        onClose={handleCloseModal5}
        message="Bạn chưa chọn tệp!"
      />
      <ModalThongBao
        visible={showModal7}
        onClose={handleCloseModal7}
        message="Email chưa đúng định dạng!"
      />
      <ModalThongBao
        visible={showModal8}
        onClose={handleCloseModal8}
        message="Số điện thoại chưa đúng định dạng!"
      />
      <ModalThongBao
        visible={showModal9}
        onClose={handleCloseModal9}
        message="Hết phiên đăng nhập!"
      />

      <View style={styles.body}>
        <ScrollView>
          <View style={[styles.viewngang]}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Tên thủ tục</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={styles.TextNormal}>
                {TableData1.MC_TTHC_GV_TenThuTuc}
              </Text>
            </View>
          </View>

          <View style={[styles.viewngang]}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Đơn vị tiếp nhận</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={styles.TextNormal}>
                {TableData1.MC_TTHC_GV_NoiTiepNhan}
              </Text>
            </View>
          </View>

          <View style={[styles.viewngang]}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Nơi trả kết quả</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={styles.TextNormal}>
                {TableData1.MC_TTHC_GV_NoiTraKetQua}
              </Text>
            </View>
          </View>

          <View style={[styles.viewngang]}>
            <View style={{width: '40%', justifyContent: 'center'}}>
              <Text style={styles.TextBold}>Email liên hệ</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.TextBold}>: </Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <View style={{borderColor: 'black', borderRadius: 10}}>
                <TextInput
                  underlineColor="transparent"
                  style={styles.textInput}
                  onChangeText={text => {
                    setemail(text);
                  }}
                  value={email}
                  placeholder="Ví dụ:example@gmail.com"
                />
              </View>
            </View>
          </View>

          <View style={[styles.viewngang]}>
            <View style={{width: '40%', justifyContent: 'center'}}>
              <Text style={styles.TextBold}>Số điện thoại liên hệ</Text>
            </View>
            <View
              style={{
                width: '60%',
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.TextBold}>: </Text>
              </View>

              <View style={{borderColor: 'black', borderRadius: 10}}>
                <TextInput
                  underlineColor="transparent"
                  style={styles.textInput}
                  onChangeText={text => {
                    setsdt(text);
                  }}
                  value={sdt}
                  placeholder="0334350166 hoặc +8434350166"
                />
              </View>
            </View>
          </View>

          <Text style={[styles.TextBold, {marginTop: 10}]}>
            Nội dung yêu cầu:
          </Text>
          <TextInput
            underlineColor="transparent"
            style={[
              styles.textInput,
              {width: '99%', height: 90, justifyContent: ''},
            ]}
            onChangeText={text => {
              setnd(text);
            }}
            value={nd}
            multiline={true}
            placeholder="Nhập nội dung"
          />

          <View style={[styles.viewngang]}>
            <View style={{width: '40%', justifyContent: 'center'}}>
              <Text style={styles.TextBold}>Nhập số lượng bản</Text>
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.TextBold}>: </Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <View style={{borderColor: 'black', borderRadius: 10}}>
                <TextInput
                  underlineColor="transparent"
                  style={[styles.textInput, {width: '200%'}]}
                  onChangeText={text => {
                    setsl(text);
                  }}
                  value={sl}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          <Text style={[styles.TextBold, {marginTop: 10}]}>
            Danh sách giấy tờ kèm theo:
          </Text>
          <ScrollView horizontal>
            <DataTable
              style={{
                width: 1000,
                marginLeft: -15,
                marginRight: -160,
                marginBottom: 10,
              }}>
              <DataTable.Header>
                <DataTable.Title
                  style={[
                    {
                      flex: 0.05,
                      borderTopLeftRadius: 10,
                    },
                    styles.TitleTable,
                  ]}>
                  <Text style={[styles.TextBold, {color: 'white'}]}>STT</Text>
                </DataTable.Title>

                <DataTable.Title
                  style={[
                    {
                      flex: 0.2,
                    },
                    styles.TitleTable,
                  ]}>
                  <Text style={[styles.TextBold, {color: 'white'}]}>
                    Tên giấy tờ
                  </Text>
                </DataTable.Title>

                <DataTable.Title
                  style={[
                    {
                      flex: 0.1,
                    },
                    styles.TitleTable,
                  ]}>
                  <Text style={[styles.TextBold, {color: 'white'}]}>
                    Bản chính
                  </Text>
                </DataTable.Title>

                <DataTable.Title
                  style={[
                    {
                      flex: 0.1,
                    },
                    styles.TitleTable,
                  ]}>
                  <Text style={[styles.TextBold, {color: 'white'}]}>
                    Bản sao
                  </Text>
                </DataTable.Title>

                <DataTable.Title
                  style={[
                    {
                      flex: 0.1,
                    },
                    styles.TitleTable,
                  ]}>
                  <Text style={[styles.TextBold, {color: 'white'}]}>
                    Bắt buộc
                  </Text>
                </DataTable.Title>

                <DataTable.Title
                  style={[
                    {
                      flex: 0.3,
                    },
                    styles.TitleTable,
                  ]}>
                  <Text style={[styles.TextBold, {color: 'white'}]}>
                    Tệp đính kèm
                  </Text>
                </DataTable.Title>
              </DataTable.Header>

              {TableData2.map((td, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell
                    style={[
                      styles.CellTable,
                      {
                        flex: 0.05,
                      },
                    ]}>
                    <Text style={styles.TextNormal}>
                      {td.MC_TTHC_GV_ThanhPhanHoSo_STT}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell
                    style={[
                      styles.CellTable,
                      {
                        flex: 0.2,
                      },
                    ]}>
                    <Text style={styles.TextNormal}>
                      {td.MC_TTHC_GV_ThanhPhanHoSo_TenGiayTo}
                      Xem/tải mẫu: {td.MC_TTHC_GV_ThanhPhanHoSo_TenFile}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell
                    style={[
                      styles.CellTable,
                      {
                        flex: 0.1,
                      },
                    ]}>
                    <Text style={styles.TextNormal}>
                      {td.MC_TTHC_GV_ThanhPhanHoSo_BanChinh}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell
                    style={[
                      styles.CellTable,
                      {
                        flex: 0.1,
                      },
                    ]}>
                    <Text style={styles.TextNormal}>
                      {td.MC_TTHC_GV_ThanhPhanHoSo_BanSao}
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell
                    style={[
                      styles.CellTable,
                      {
                        flex: 0.1,
                      },
                    ]}>
                    <Text style={styles.TextNormal}>
                      <CheckBox
                        isChecked={
                          td.MC_TTHC_GV_ThanhPhanHoSo_BatBuoc
                            ? td.MC_TTHC_GV_ThanhPhanHoSo_BatBuoc
                            : false
                        }
                        disable={true}
                        onClick={() => {}}
                        tintColors={{
                          true: checkboxColor,
                          false: checkboxUncheckedColor,
                        }}
                      />
                    </Text>
                  </DataTable.Cell>

                  <DataTable.Cell
                    style={[
                      styles.CellTable,
                      {
                        flex: 0.3,
                      },
                    ]}>
                    <View style={{flexDirection: 'column'}}>
                      <View style={{flexDirection: 'row', flex: 1}}>
                        <View style={{flex: 0.35}}>
                          <TouchableOpacity
                            onPress={() => {
                              chooseFile(index);
                            }}
                            style={{
                              borderRadius: 5,
                              borderWidth: 1,
                              width: '90%',
                              backgroundColor: '#C0C0C0',
                              marginLeft: 5,
                              marginTop: 5,
                            }}>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 16,
                                textAlign: 'center',
                              }}>
                              Chọn tệp
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{flex: 0.65}}>
                          <Text
                            style={[
                              styles.TextNormal,
                              {marginTop: 5, marginLeft: 3, textAlign: 'left'},
                            ]}>
                            {FileName[index] ? FileName[index] : 'Chưa có tệp'}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          styles.TextNormal,
                          {textAlign: 'left', marginTop: 5, marginLeft: 5},
                        ]}>
                        Các loại file/ảnh liên quan đến giấy tờ.
                      </Text>
                    </View>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </ScrollView>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={[styles.buttonHuy, {marginLeft: 30}]}>
          <TouchableOpacity
            style={styles.touchableOpacity}
            onPress={() => {
              setemail('');
              setsdt('');
              setnd('');
              setsl('');
              setFileName('');
              setBase64('');
            }}>
            <Text style={{color: 'black', fontSize: 19}}>Hủy</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.buttonHuy, {marginRight: 30}]}>
          <TouchableOpacity
            style={[styles.touchableOpacity, {backgroundColor: '#245d7c'}]}
            onPress={() => {
              if (email === '') {
                handleModalPress2();
              } else if (!validateEmail(email)) {
                handleModalPress7();
              } else if (sdt === '') {
                handleModalPress6();
              } else if (!validateSDT(sdt)) {
                handleModalPress8();
              } else if (nd === '') {
                handleModalPress3();
              } else if (sl === '') {
                handleModalPress4();
              } else if (TableData2.length === 0) {
                PostYeuCau();
              } else {
                if (base64Content === '') {
                  handleModalPress5();
                } else {
                  PostYeuCau();
                }
              }
            }}>
            <Text style={{color: '#ffffff', fontSize: 19}}>Nộp hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </SafeAreaView>
  );
};
export default Soanhoso;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    width: getWidth,
    height: getHeight,
  },
  body: {
    height: '67%',
    backgroundColor: '#ffffff',
    marginHorizontal: 5,
    marginTop: 10,
  },
  footer: {
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  ViewBottom: {
    height: '%',
  },
  touchableOpacity: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  containerTable: {
    marginTop: 20,
  },
  viewngang: {
    flexDirection: 'row',
    width: '100%',
    height: 'auto',
    marginTop: 10,
  },
  TitleTable: {
    backgroundColor: '#2e6b8b',
    justifyContent: 'center',
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CellTable: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f9ff',
    marginLeft: 0.5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 10,
  },
  CellTableFirst: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f7f9ff',
    marginLeft: 0.5,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonHuy: {
    width: '40%',
    height: 40,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  TextNormal: {
    fontSize: 17,
    color: 'black',
    textAlign: 'center',
  },
  TextBold: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'black',
  },
  textInput: {
    height: 20,
    width: '98%',
    fontSize: 17,
    marginTop: 5,
    borderColor: 'gray',
    borderWidth: 0.5,
    padding: 7,
    borderRadius: 5,
    color: 'black',
    backgroundColor: '#ffffff',
  },
});
