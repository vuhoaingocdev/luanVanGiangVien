import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  ScrollView,
  Platform,
} from 'react-native';

import CheckBox from 'react-native-check-box';
import {token} from '../../../../DangNhap/dangNhap';
import {DataTable} from 'react-native-paper';
import HeaderBack from '../../../Untils/HeaderBack';
import Footer from '../../../Untils/Footer';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {maGiangVien} from '../../../../DangNhap/dangNhap';
import ModalThongBao from '../../../Untils/ModalThongBao';
const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
export var TableData1 = [];
export var TableData2 = [];
export var TableData3 = [];
const Chitietthutuc = props => {
  const [checkboxColor, setCheckboxColor] = useState('#245d7c');
  const [checkboxUncheckedColor, setCheckboxUncheckedColor] = useState('gray');

  const [tabledata, setTableData] = useState({});
  const [tabletphs, settphs] = useState([]);
  const [tablettth, setttth] = useState([]);

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
          `Lần ${attempt} thất bại. Đang thử lại trong ${delay / 2000} giây...`,
        );
        await new Promise(resolve => setTimeout(resolve, delay));
        delay *= backoff;
        attempt++;
      }
    }
  };

  const getDataTable = async idGuiYC => {
    const callApi = async idGuiYC => {
      try {
        const response = await axios.get(getAPI, {
          params: {MC_TTHC_GV_IDTTHC: idGuiYC},
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const newTableData = response.data.ThongTinHoSo;
        const newTableData1 = response.data.ThanhPhanHoSo;
        const newTableData2 = response.data.TrinhTuThucHien;

        setTableData(newTableData);
        settphs(newTableData1);
        setttth(newTableData2);

        TableData1 = newTableData;
        TableData2 = newTableData1;
        TableData3 = newTableData2;
      } catch (error) {
        console.error(error);
      }
    };

    try {
      await retry(() => callApi(idGuiYC));
    } catch (error) {
      console.error(error);
    }
  };

  //Số lượng hồ sơ gửi lên
  //Lấy số lượng thủ tục gửi lên
  const [soLuongThuGuiLen, setSoLuongThuTucGuiLen] = useState(0);
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
  const saveBufferToFile = async (bufferData, fileName, directory) => {
    try {
      // Tạo thư mục nếu chưa tồn tại
      await RNFS.mkdir(directory, {NSURLIsExcludedFromBackupKey: true});

      // Kết hợp đường dẫn thư mục và tên tệp
      const filePath = `${directory}/${fileName}`;

      // Kiểm tra xem tệp đã tồn tại chưa
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        console.log('Tệp đã tồn tại:', filePath);
        handleModalPress13();
        return filePath; // Trả về đường dẫn của tệp đã tồn tại
      }

      // Ghi dữ liệu buffer vào tệp
      await RNFS.writeFile(filePath, bufferData, 'base64');

      console.log('Ghi tệp thành công:', filePath);
      handleModalPress11();
      return filePath; // Trả về đường dẫn của tệp đã ghi
    } catch (error) {
      handleModalPress12();
      console.error('Lỗi khi ghi tệp:', error);
      throw error;
    }
  };
  const [showModal11, setShowModal11] = useState(false);
  const handleModalPress11 = () => {
    setShowModal11(true);
  };
  const handleCloseModal11 = () => {
    setShowModal11(false);
  };
  const [showModal12, setShowModal12] = useState(false);
  const handleModalPress12 = () => {
    setShowModal12(true);
  };
  const handleCloseModal12 = () => {
    setShowModal12(false);
  };
  const [showModal13, setShowModal13] = useState(false);
  const handleModalPress13 = () => {
    setShowModal13(true);
  };
  const handleCloseModal13 = () => {
    setShowModal13(false);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      getSoLuong();
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const idGuiYC = props.route.params.IDthutuc;
    getDataTable(idGuiYC);
  }, [props.route.params.IDthutuc]);
  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="CHI TIẾT THỦ TỤC"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ModalThongBao
        visible={showModal11}
        onClose={handleCloseModal11}
        message="Tải xuống tệp thành công!!!"
      />
      <ModalThongBao
        visible={showModal12}
        onClose={handleCloseModal12}
        message="Quá trình tải tệp lỗi.Hãy thử lại!!!"
      />
      <ModalThongBao
        visible={showModal13}
        onClose={handleCloseModal13}
        message="Tệp đã tồn tại!!!"
      />
      <View style={styles.body}>
        <ScrollView>
          <Text
            style={[
              styles.TextBold,
              {textDecorationLine: 'underline', fontSize: 20, marginTop: 15},
            ]}>
            THÔNG TIN THỦ TỤC
          </Text>
          <View style={[styles.viewngang]}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Lĩnh vực</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={styles.TextNormal}>
                {tabledata.MC_TTHC_GV_LinhVuc}
              </Text>
            </View>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Mã thủ tục</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={styles.TextNormal}>
                {tabledata.MC_TTHC_GV_MaThuTuc}
              </Text>
            </View>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Tên thủ tục</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                {tabledata.MC_TTHC_GV_TenThuTuc}
              </Text>
            </View>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Thủ tục liên thông</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <CheckBox
                isChecked={
                  tabledata.MC_TTHC_GV_ThuTucLienThong
                    ? tabledata.MC_TTHC_GV_ThuTucLienThong
                    : false
                }
                disable={true}
                onClick={() => {}}
                tintColors={{
                  true: checkboxColor,
                  false: checkboxUncheckedColor,
                }}
              />
            </View>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '61%'}}>
              <Text style={styles.TextBold}>
                Thủ tục không áp dụng trực tuyến
              </Text>
            </View>
            <View style={{width: '39%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <CheckBox
                isChecked={
                  tabledata.MC_TTHC_GV_ThuTucKhongApDungTrucTuyen
                    ? tabledata.MC_TTHC_GV_ThuTucKhongApDungTrucTuyen
                    : false
                }
                disable={true}
                onClick={() => {}}
                tintColors={{
                  true: checkboxColor,
                  false: checkboxUncheckedColor,
                }}
              />
            </View>
          </View>

          <View style={styles.containerTable}>
            <Text style={[styles.TextBold]}>Thành phần hồ sơ đề nghị:</Text>
            <ScrollView horizontal>
              <DataTable
                style={{
                  width: 1000,
                  marginLeft: -15,
                  marginRight: -350,
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
                        flex: 0.1,
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
                        flex: 0.2,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Mẫu hồ sơ/Hướng dẫn
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
                        borderTopRightRadius: 10,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Bắt buộc
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>
                {tabletphs.map((td, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
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
                        styles.CellTableFirst,
                        {
                          flex: 0.1,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_ThanhPhanHoSo_TenGiayTo}
                      </Text>
                    </DataTable.Cell>

                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.2,
                        },
                      ]}>
                      <View style={{flexDirection: 'column'}}>
                        <Text style={styles.TextNormal}>
                          Xem mẫu hướng dẫn:
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            let bufferdata =
                              td.MC_TTHC_GV_ThanhPhanHoSo_DataFile.data;
                            let buffer = Buffer.from(bufferdata);
                            let base64content = buffer.toString('base64');
                            const directory =
                              Platform.OS === 'android'
                                ? '/storage/emulated/0/Download'
                                : RNFS.DocumentDirectoryPath;
                            saveBufferToFile(
                              base64content,
                              td.MC_TTHC_GV_ThanhPhanHoSo_TenFile,
                              directory,
                            );
                          }}>
                          <Text style={styles.TextNormal}>
                            {td.MC_TTHC_GV_ThanhPhanHoSo_TenFile}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </DataTable.Cell>

                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
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
                        styles.CellTableFirst,
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
                        styles.CellTableFirst,
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
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </View>

          <View style={[styles.viewngang, {marginTop: 20}]}>
            <View style={{width: '40%'}}>
              <Text style={styles.TextBold}>Số bộ hồ sơ</Text>
            </View>
            <View style={{width: '60%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={styles.TextNormal}>
                {tabledata.MC_TTHC_GV_SoBoHoSo
                  ? tabledata.MC_TTHC_GV_SoBoHoSo
                  : '1'}{' '}
                bộ
              </Text>
            </View>
          </View>

          <View style={styles.viewngang}>
            <View style={{width: '44%'}}>
              <Text style={styles.TextBold}>Tổng thời gian giải quyết</Text>
            </View>
            <View style={{width: '56%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                <Text>
                  {tabledata.MC_TTHC_GV_TongThoiGianGiaiQuyet
                    ? tabledata.MC_TTHC_GV_TongThoiGianGiaiQuyet
                    : '2'}{' '}
                  ngày kể từ khi nhận đủ hồ sơ hợp lệ
                </Text>
              </Text>
            </View>
          </View>

          <View style={[styles.containerTable, {marginTop: 10}]}>
            <Text style={styles.TextBold}>Mô tả trình tự thực hiện:</Text>
            <ScrollView horizontal flexGrow={1} flexShrink={1}>
              <DataTable
                style={{
                  width: 1300,
                  marginLeft: -15,
                  marginRight: -15,
                  marginBottom: 10,
                }}>
                <DataTable.Header>
                  <DataTable.Title
                    style={[
                      {
                        flex: 0.1,
                        borderTopLeftRadius: 10,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Bước
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.2,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Tên công việc
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.27,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Cách thức thực hiện
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.35,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Địa chỉ tiếp nhận, trả hồ sơ
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.5,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Đơn vị thực hiện được ủy quyền thực hiện
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.2,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Đơn vị phối hợp
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.2,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Thời gian(ngày)
                    </Text>
                  </DataTable.Title>

                  <DataTable.Title
                    style={[
                      {
                        flex: 0.2,
                        borderTopRightRadius: 10,
                      },
                      styles.TitleTable,
                    ]}>
                    <Text style={[styles.TextBold, {color: 'white'}]}>
                      Kết quả
                    </Text>
                  </DataTable.Title>
                </DataTable.Header>
                {tablettth.map((td, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.1,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_Buoc}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.2,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_TenCongViec}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.27,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_CachThucThucHien}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.35,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_DiaChiNhanTra}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.5,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_DonViThucHien}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.2,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_DonViPhoiHop}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.2,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_ThoiGianNgay}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell
                      style={[
                        styles.CellTableFirst,
                        {
                          flex: 0.2,
                        },
                      ]}>
                      <Text style={styles.TextNormal}>
                        {td.MC_TTHC_GV_TrinhTuThucHien_KetQua}
                      </Text>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </ScrollView>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '50%'}}>
              <Text style={styles.TextBold}>Căn cứ pháp lý của TTHC</Text>
            </View>
            <View style={{width: '50%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                {tabledata.MC_TTHC_GV_CanCuPhapLyCuaTTHC}
              </Text>
            </View>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '80'}}>
              <Text style={styles.TextBold}>
                Yêu cầu hoặc điều kiện để thực hiện TTHC
              </Text>
            </View>
            <View style={{width: '20%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                {tabledata.MC_TTHC_GV_DieuKienThucHien}
              </Text>
            </View>
          </View>
          <View style={styles.viewngang}>
            <View style={{width: '50%'}}>
              <Text style={styles.TextBold}>Tệp thủ tục</Text>
            </View>
            <View style={{width: '50%', flexDirection: 'row'}}>
              <Text style={styles.TextBold}>: </Text>
              <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                {tabledata.MC_TTHC_GV_TepThuTuc_TenFile}
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <View style={[styles.buttonHuy, {marginRight: 30}]}>
          <TouchableOpacity
            style={[styles.touchableOpacity, {backgroundColor: '#245d7c'}]}
            onPress={() => {
              props.navigation.navigate('SoanHoSo');
            }}>
            <Text style={{color: '#ffffff', fontSize: 19}}>Soạn hồ sơ</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer soLuongThuTuc={soLuongThuGuiLen} />
    </SafeAreaView>
  );
};
export default Chitietthutuc;
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
    marginBottom: 10,
  },

  footer: {
    height: '10%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
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
    fontSize: 16,
    color: 'black',
    textAlign: 'center',
  },

  TextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});
