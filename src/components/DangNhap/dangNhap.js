import React, {useState, useEffect} from 'react';

import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';

import CheckBox from '@react-native-community/checkbox';
import {user_login} from '../../api/QuanLyAPI/user_api';
import {giangvien_login} from '../../api/QuanLyAPI/giangvien_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalThongBao from '../ManHinh/Untils/ModalThongBao';
export var token;
export var maSinhVien;
export var maGiangVien;
export var matkhau;
function DangNhap(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setChecked] = useState(false);
  const [isShowPass, setShowPass] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showModal1, setShowModal1] = useState(false);
  const [showModal2, setShowModal2] = useState(false);
  const [showModal3, setShowModal3] = useState(false);
  const [showModal4, setShowModal4] = useState(false);

  const FaceBookKTKTCN = () => {
    Linking.openURL('https://www.facebook.com/Daihoc.uneti?mibextid=LQQJ4d');
  };

  const openWebSite = () => {
    Linking.openURL('https://uneti.edu.vn');
  };

  const OpenYouTobe = () => {
    const videoURL = 'https://www.youtube.com/@nokia88e1';
    Linking.openURL(videoURL).catch(err =>
      console.error('Không thể mở trình duyệt:', err),
    );
  };

  const handleModalPress1 = () => {
    setShowModal1(true);
  };

  const handleCloseModal1 = () => {
    setShowModal1(false);
  };

  const handleModalPress2 = () => {
    setShowModal2(true);
  };

  const handleCloseModal2 = () => {
    setShowModal2(false);
  };

  const handleModalPress3 = () => {
    setShowModal3(true);
  };

  const handleCloseModal3 = () => {
    setShowModal3(false);
  };

  const handleModalPress4 = () => {
    setShowModal4(true);
  };

  const handleCloseModal4 = () => {
    setShowModal4(false);
  };

  const [checkboxColor, setCheckboxColor] = useState('#245d7c');
  const [checkboxUncheckedColor, setCheckboxUncheckedColor] = useState('gray');

  const LuuTaiKhoanVaMatKhau = async () => {
    try {
      await AsyncStorage.setItem(
        'LuuTaiKhoan',
        JSON.stringify({username, password}),
      );
    } catch (error) {
      console.error('Lỗi khi lưu tài khoản và mật khẩu:', error);
    }
  };

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem('LuuTaiKhoan');
      if (savedData) {
        const {username: savedUsername, password: savedPassword} =
          JSON.parse(savedData);
        setUsername(savedUsername);
        setPassword(savedPassword);
      }
    } catch (error) {
      console.error('Lỗi khi tải tài khoản và mật khẩu:', error);
    }
  };

  useEffect(() => {
    loadSavedData();
  }, []);

  var api = 'https:apiv2.uneti.edu.vn/api/SP_MC_MaSinhVien/Load_Web_App_Para';
  var api1 = 'https:apiv2.uneti.edu.vn/api/SP_HT_USER_GIANGVIEN/Load_MaND_HRM';

  function xuLiDangNhap() {
    user_login({
      TC_SV_MaSinhVien: username.toString(),
      TC_SV_MaSinhVien_Pass: password.toString(),
    })
      .then(result => {
        if (result.status == 200) {
          token = result.data.token;
          maSinhVien = username;
          matkhau = password;
          var formdata = {
            TC_SV_MaSinhVien: username.toString(),
            TC_SV_MaSinhVien_Pass: password.toString(),
          };

          var options = {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(formdata),
          };

          fetch(api, options)
            .then(function (response) {
              return response.json();
            })
            .then(function (response) {
              //console.log(response.body[0].Role);
              if (
                response.body[0].Role === 'SV' &&
                isChecked &&
                username !== '' &&
                password !== ''
              ) {
                LuuTaiKhoanVaMatKhau();
              }
              handleModalPress4();
            })
            .catch(function (error) {
              console.log(error);
            });
        } else if (username === '' || password === '') {
          handleModalPress1();
        } else {
          giangvien_login({
            HT_USER_TenDN: username.toString(),
            HT_USER_MK: password.toString(),
          })
            .then(result => {
              if (result.status == 200) {
                token = result.data.token;
                maGiangVien = username;
                matkhau = password;
                var formdata = {
                  HT_USER_TenDN: username.toString(),
                  HT_USER_MK: password.toString(),
                };

                var options = {
                  method: 'POST',
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                  },
                  body: JSON.stringify(formdata),
                };

                fetch(api1, options)
                  .then(function (response) {
                    return response.json();
                  })
                  .then(function (response) {
                    //console.log(response.body[0].Role);
                    if (
                      response.body[0].Role === 'GV' &&
                      isChecked &&
                      username !== '' &&
                      password !== ''
                    ) {
                      LuuTaiKhoanVaMatKhau();
                    }
                    //props.navigation.navigate('TrangChu');
                    props.navigation.navigate('CBXL_DanhSachThuTuc');
                  })
                  .catch(function (error) {
                    console.log('208 - Xu ly dang nhap', error);
                  });
              } else if (username.length === 0 || password.length === 0) {
                handleModalPress1();
              } else {
                handleModalPress2();
              }
            })
            .catch(err => {
              console.log(err);
            })
            .finally(() => {
              setLoading(false);
            });
        }
      })
      .catch(err => {
        console.log('225 - Dang nhap', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  const xuLiVuiLongCho = () => {
    setLoading(true);

    setTimeout(() => {
      xuLiDangNhap();
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.viewImage}>
        <Image
          source={require('../../images/logo_uneti.jpg')}
          style={styles.image}
        />
      </View>

      <ModalThongBao
        visible={showModal1}
        onClose={handleCloseModal1}
        message="Vui lòng nhập đầy đủ thông tin tài khoản và mật khẩu!"
      />

      <ModalThongBao
        visible={showModal2}
        onClose={handleCloseModal2}
        message="Đăng nhập nhất bại! Vui lòng kiểm tra lại thông tin tài khoản và mật khẩu!"
      />

      <ModalThongBao
        visible={showModal3}
        onClose={handleCloseModal3}
        message="Giảng viên đăng nhập thành công!"
      />

      <ModalThongBao
        visible={showModal4}
        onClose={handleCloseModal4}
        message="Sinh viên đăng nhập thành công!"
      />

      <View style={{marginHorizontal: 40}}>
        <View style={styles.viewTextInput}>
          <Text style={styles.text}>Tên đăng nhập</Text>
          <TextInput
            autoCapitalize="none"
            placeholderTextColor={'gray'}
            style={styles.textInput}
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={text => setUsername(text)}
          />
        </View>

        <View style={{marginTop: 15, width: '100%'}}>
          <Text style={styles.text}>Mật khẩu</Text>

          <View style={{width: '100%', flexDirection: 'row'}}>
            <TextInput
              placeholderTextColor={'gray'}
              style={styles.textInput}
              placeholder="******"
              secureTextEntry={isShowPass ? true : false}
              value={password}
              onChangeText={text => setPassword(text)}
            />

            <TouchableOpacity
              onPress={() => {
                setShowPass(!isShowPass);
              }}>
              <View style={styles.showPass}>
                {isShowPass ? (
                  <Image
                    style={styles.iconeye}
                    source={require('../../images/showpass.png')}
                    resizeMode="stretch"
                  />
                ) : (
                  <Image
                    style={styles.iconeye}
                    source={require('../../images/hidepass.png')}
                    resizeMode="stretch"
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            marginTop: 3,
            flexDirection: 'row',
            width: '100%',
          }}>
          <CheckBox
            value={isChecked}
            onValueChange={setChecked}
            tintColors={{true: checkboxColor, false: checkboxUncheckedColor}}
          />
          <Text
            style={{
              marginTop: 5,
              fontSize: 16,
            }}>
            Nhớ mật khẩu
          </Text>
        </View>

        <View style={styles.viewModalCotainer}>
          {loading && (
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

        <View style={styles.viewButtonLogin}>
          <TouchableOpacity
            onPress={xuLiVuiLongCho}
            style={styles.touchableOpacity}>
            <Text style={{color: '#fff', fontSize: 19}}>Đăng Nhập</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.textFooter}>TRƯỜNG ĐẠI HỌC</Text>
        <Text style={styles.textFooter}>KINH TẾ - KỸ THUẬT CÔNG NGHIỆP</Text>
        <Text style={[styles.text, styles.text2]}>
          Tel: (024)38621505 - (0228)3848706
        </Text>
        <Text style={[{color: 'black', fontSize: 13}, styles.text2]}>
          Copyright Trường Đại học Kinh tế - Kỹ thuật Công nghiệp
        </Text>

        <View style={styles.viewfooter}>
          <TouchableOpacity onPress={openWebSite}>
            <Image
              source={require('../../images/internet.png')}
              style={[styles.imageCSS, styles.imageCSS1]}
              resizeMode="stretch"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={FaceBookKTKTCN}>
            <Image
              source={require('../../images/facebook.png')}
              style={styles.imageCSS}
              resizeMode="stretch"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={OpenYouTobe}>
            <Image
              source={require('../../images/youtube.png')}
              style={[styles.imageCSS, styles.imageCSS3]}
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  image: {
    width: 160,
    height: 180,
  },

  viewImage: {
    alignItems: 'center',
    marginTop: 20,
  },

  viewTextInput: {
    marginTop: 60,
  },

  text: {
    color: 'black',
    fontSize: 18,
  },

  textInput: {
    width: '100%',
    fontSize: 16,
    marginTop: 5,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 7,
    borderRadius: 6,
    color: 'black',
  },

  viewButtonLogin: {
    marginTop: 40,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  touchableOpacity: {
    backgroundColor: '#245d7c',
    width: 110,
    height: 45,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#245d7c',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.8,
  },

  footer: {
    width: '100%',
    height: '20%',
    marginTop: 35,
    alignItems: 'center',
  },

  textFooter: {
    color: 'black',
    fontSize: 20,
    fontWeight: '400',
    marginTop: 1.5,
  },

  viewfooter: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
  },

  imageCSS: {
    height: 25,
    width: 25,
  },

  imageCSS1: {
    marginLeft: 40,
  },

  imageCSS3: {
    marginRight: 40,
  },

  text2: {
    marginTop: 1.5,
  },

  showPass: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    height: '90%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconeye: {
    height: 25,
    width: 25,
  },

  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default DangNhap;
