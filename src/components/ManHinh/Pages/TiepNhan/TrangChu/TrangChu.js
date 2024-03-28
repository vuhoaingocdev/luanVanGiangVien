// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   View,
//   TouchableOpacity,
//   Text,
//   Image,
//   StyleSheet,
//   Dimensions,
//   TextInput,
//   Alert,
//   ScrollView,
//   Modal,
//   TouchableWithoutFeedback,
//   Linking,
// } from 'react-native';

// const getWidth = Dimensions.get('window').width;
// const getHeight = Dimensions.get('window').height;

// import axios from 'axios';
// import Header from '../../../Untils/Header';
// import Footer from '../../../Untils/Footer';
// import ModalThongBao from '../../../Untils/ModalThongBao';
// import ModalDonViVaLinhVuc from '../../../Untils/ModalDonViVaLinhVuc';
// import {token} from '../../../../DangNhap/dangNhap';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// export var IDthutuc;
// const TrangChu = props => {
//   const [thongTinTimKiem, setThongTinTimKiem] = useState('');
//   const [showModal, setShowModal] = useState(false);
//   const [getTenDonVi, setTenDonVi] = useState('');
//   const [getTenLinhVuc, setTenLinhVuc] = useState('');
//   const [modalDVLV, setModalDVLV] = useState(false);
//   const [showOverlay, setShowOverlay] = useState(false);
//   const [locThuTucTheoDonVi, setLocThuTucTheoDonVi] = useState([]);

//   const [viTri, setViTri] = useState(0);
//   const soLuongBanGhiHienThi = 10;

//   //Lấy dữ liệu từ api in ra danh sách thủ tục
//   const [dataThuTuc, setDataThuTuc] = useState([]);
//   const apiGetDuLieuDanhSachThuTuc =
//     'https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/TimKiemThuTuc?MC_TTHC_GV_DieuKienLoc=MaThuTuc';
//   const getMangDanhSachThuTuc = async () => {
//     try {
//       const response = await axios.get(apiGetDuLieuDanhSachThuTuc, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (
//         response.status != 400 &&
//         response.data &&
//         response.data.body &&
//         response.data.body.length > 0
//       ) {
//         const mangDanhSach = response.data.body.map(item => ({
//           IDthutuc: item.MC_TTHC_GV_ID,
//           tenThuTuc: item.MC_TTHC_GV_TenThuTuc,
//           mucDo: item.MC_TTHC_GV_IDMucDo,
//           tenLinhVuc: item.MC_TTHC_GV_LinhVuc,
//           tenDonVi: item.MC_TTHC_GV_NoiTiepNhan,
//         }));

//         setDataThuTuc(mangDanhSach);

//         if (getTenDonVi !== '' && getTenLinhVuc !== '') {
//           const filtered1 = mangDanhSach.filter(
//             item =>
//               item.tenDonVi === getTenDonVi &&
//               item.tenLinhVuc === getTenLinhVuc,
//           );
//           setLocThuTucTheoDonVi(filtered1);
//           //setViTri(0);
//         } else if (getTenDonVi !== '') {
//           const filtered = mangDanhSach.filter(
//             item => item.tenDonVi === getTenDonVi,
//           );
//           setLocThuTucTheoDonVi(filtered);
//           //setViTri(0);
//         } else {
//           setLocThuTucTheoDonVi(mangDanhSach);
//         }
//       } else {
//         setDataThuTuc([]);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   //Tìm kiếm
//   const TimKiemThuTuc = () => {
//     if (thongTinTimKiem === '') {
//       setLocThuTucTheoDonVi(dataThuTuc);
//     } else {
//       let ketQuaTimKiem = [];
//       //Tìm kiếm trên danh sách đã lọc
//       if (getTenDonVi !== '' || getTenLinhVuc !== '') {
//         ketQuaTimKiem = locThuTucTheoDonVi.filter(item => {
//           const tenThuTucLowerCase = item.tenThuTuc.toLowerCase();
//           const thongTinTimKiemLowerCase = thongTinTimKiem.toLowerCase();
//           return tenThuTucLowerCase.includes(thongTinTimKiemLowerCase);
//         });
//       } else {
//         ketQuaTimKiem = dataThuTuc.filter(item => {
//           const tenThuTucLowerCase = item.tenThuTuc.toLowerCase();
//           const thongTinTimKiemLowerCase = thongTinTimKiem.toLowerCase();
//           return tenThuTucLowerCase.includes(thongTinTimKiemLowerCase);
//         });
//       }
//       setLocThuTucTheoDonVi(ketQuaTimKiem);
//     }
//   };

//   const xuLyDangXuat = async () => {
//     try {
//       await AsyncStorage.multiRemove(['username', 'password']);
//       props.navigation.navigate('DangNhap');
//     } catch (error) {
//       console.log('Lỗi khi đăng xuất: ', error.message);
//     }
//   };

//   const HuongDanSuDung = () => {
//     const videoURL = 'https://www.youtube.com/@nokia88e1';
//     Linking.openURL(videoURL).catch(err =>
//       console.error('Không thể mở trình duyệt:', err),
//     );
//   };

//   const duLieuHienTai = locThuTucTheoDonVi.slice(
//     viTri,
//     viTri + soLuongBanGhiHienThi,
//   );

//   const handleNextPage = () => {
//     if (viTri + soLuongBanGhiHienThi < locThuTucTheoDonVi.length) {
//       setViTri(viTri + soLuongBanGhiHienThi);
//     }
//   };

//   const handlePrePage = () => {
//     if (viTri - soLuongBanGhiHienThi >= 0) {
//       setViTri(viTri - soLuongBanGhiHienThi);
//     }
//   };

//   const handlePrePrePage = () => {
//     setViTri(0);
//   };

//   const handleNextNextPage = () => {
//     const tongSoTrang = Math.ceil(
//       locThuTucTheoDonVi.length / soLuongBanGhiHienThi,
//     );
//     const trangCuoiCung = (tongSoTrang - 1) * soLuongBanGhiHienThi;
//     setViTri(trangCuoiCung);
//   };

//   const openModal = () => {
//     setShowModal(true);
//   };
//   const closeModal = () => {
//     setShowModal(false);
//   };

//   const openModalDVLV = () => {
//     setModalDVLV(true);
//   };

//   const closeModalDVLV = () => {
//     setModalDVLV(false);
//   };

//   const handleMenuPress = () => {
//     setShowOverlay(!showOverlay);
//   };

//   useEffect(() => {
//     getMangDanhSachThuTuc();
//   }, [getTenDonVi, getTenLinhVuc]);

//   useEffect(() => {
//     TimKiemThuTuc();
//   }, [thongTinTimKiem]);

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header title="THỦ TỤC HÀNH CHÍNH" onPress={handleMenuPress} />

//       {showOverlay && (
//         <Modal transparent={true} animationType="slide">
//           <TouchableWithoutFeedback onPress={handleMenuPress}>
//             <View style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)'}}>
//               <View style={[styles.viewDrawer]}>
//                 <View style={{marginTop: 90}}>
//                   <TouchableOpacity onPress={handleMenuPress}>
//                     <Image
//                       source={require('../../../../../images/menu.png')}
//                       style={styles.iconMenu}
//                     />
//                   </TouchableOpacity>

//                   <View style={[styles.drawerText, {marginTop: 20}]}>
//                     <TouchableOpacity
//                       onPress={() => {
//                         props.navigation.navigate('TrangCaNhan');
//                       }}>
//                       <View style={styles.viewTouchableOpacity}>
//                         <Image
//                           source={require('../../../../../images/person.png')}
//                           style={styles.iconDrawer}
//                           tintColor={'#ffffff'}
//                         />
//                         <Text style={styles.textTouchableOpacity}>
//                           Trang cá nhân
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.drawerText}>
//                     <TouchableOpacity onPress={HuongDanSuDung}>
//                       <View style={styles.viewTouchableOpacity}>
//                         <Image
//                           source={require('../../../../../images/youtube.png')}
//                           style={styles.iconDrawer}
//                           tintColor={'#ffffff'}
//                         />
//                         <Text style={styles.textTouchableOpacity}>
//                           Hướng dẫn sử dụng
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>

//                   <View style={styles.drawerText}>
//                     <TouchableOpacity onPress={xuLyDangXuat}>
//                       <View style={styles.viewTouchableOpacity}>
//                         <Image
//                           source={require('../../../../../images/logout.png')}
//                           style={styles.iconDrawer}
//                           tintColor={'#ffffff'}
//                         />
//                         <Text style={styles.textTouchableOpacity}>
//                           Đăng xuất
//                         </Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               </View>
//             </View>
//           </TouchableWithoutFeedback>
//         </Modal>
//       )}

//       <ModalThongBao
//         visible={showModal}
//         onClose={closeModal}
//         message="Chưa hoàn thành!"
//       />

//       <ModalDonViVaLinhVuc
//         visible={modalDVLV}
//         onClose={closeModalDVLV}
//         getTenDonVi={getTenDonVi}
//         setTenDonVi={setTenDonVi}
//         getTenLinhVuc={getTenLinhVuc}
//         setTenLinhVuc={setTenLinhVuc}
//       />

//       <View style={styles.body}>
//         {getTenDonVi === '' ? (
//           <TouchableOpacity
//             style={[styles.openMenu, {width: 53}]}
//             onPress={openModalDVLV}>
//             <Image
//               source={require('../../../../../images/right-arrow.png')}
//               tintColor={'#ffff'}
//               style={styles.iconOpenMenu}
//             />
//           </TouchableOpacity>
//         ) : (
//           <View style={{flex: 0.8, alignItems: 'center'}}>
//             <TouchableOpacity
//               style={[styles.openMenu, {position: 'absolute', left: 0}]}
//               onPress={openModalDVLV}>
//               <Text style={{color: '#ffffff', fontSize: 16, marginLeft: 20}}>
//                 {getTenDonVi}
//               </Text>
//               <Image
//                 source={require('../../../../../images/right-arrow.png')}
//                 tintColor={'#ffff'}
//                 style={[styles.iconOpenMenu, {marginLeft: 10, marginRight: 20}]}
//               />
//             </TouchableOpacity>
//           </View>
//         )}

//         <View style={styles.marginBody}>
//           {/* Tìm kiếm */}
//           <View
//             style={{
//               marginTop: 5,
//               marginBottom: 15,
//               width: 50,
//               width: '100%',
//               flexDirection: 'row',
//             }}>
//             <TextInput
//               autoCapitalize="none"
//               placeholderTextColor={'gray'}
//               style={[styles.textInput]}
//               placeholder=" Tìm kiếm"
//               value={thongTinTimKiem}
//               onChangeText={text => setThongTinTimKiem(text)}
//             />

//             <View style={styles.containerSearchAndClose}>
//               {thongTinTimKiem !== '' ? (
//                 <View style={styles.containerClose}>
//                   <TouchableOpacity
//                     onPress={() => {
//                       setThongTinTimKiem('');
//                     }}>
//                     <Image
//                       source={require('../../../../../images/icon_close.png')}
//                       style={styles.image}
//                       tintColor={'gray'}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               ) : null}

//               <View
//                 style={[
//                   styles.containerClose,
//                   {position: 'absolute', right: 0},
//                 ]}>
//                 <TouchableOpacity onPress={TimKiemThuTuc}>
//                   <Image
//                     source={require('../../../../../images/icon_search.png')}
//                     style={styles.image}
//                     tintColor={'gray'}
//                   />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>

//           <ScrollView style={{height: 415}}>
//             {/* Danh sách thủ tục */}
//             <View style={styles.danhSachThuTucTieuDe}>
//               <View style={styles.viewSTT}>
//                 <Text style={styles.text}>STT</Text>
//               </View>

//               <View style={styles.viewTenThuTuc}>
//                 <Text style={styles.text}>Tên thủ tục</Text>
//               </View>

//               <View style={styles.viewLinhVuc}>
//                 <Text style={styles.text}>Lĩnh vực</Text>
//               </View>
//             </View>

//             {/* Chi tiết danh sách tên thủ tục */}
//             <View style={styles.viewData}>
//               {duLieuHienTai.map((tt, index) => (
//                 <TouchableOpacity
//                   key={index}
//                   onPress={() => {
//                     props.navigation.navigate('ChiTietThuTuc', {
//                       IDthutuc: tt.IDthutuc,
//                     });
//                   }}>
//                   <View style={styles.chiTietDanhSachThuTuc} key={index}>
//                     <View style={styles.chiTietViewSTT}>
//                       <Text style={[styles.text, {color: 'black'}]}>
//                         {index + 1 + viTri}
//                       </Text>
//                     </View>

//                     <View style={styles.chiTietViewTenThuTuc}>
//                       <Text style={[styles.text2, {fontWeight: 'bold'}]}>
//                         {tt.tenThuTuc}
//                       </Text>

//                       <View style={styles.chiTietViewTenThuTucMucDo}>
//                         <Text style={[styles.text2, {marginTop: 2}]}>
//                           Mức độ:
//                         </Text>
//                         <View style={styles.viewMucDo}>
//                           <Text style={[styles.text1, {color: '#ffffff'}]}>
//                             {tt.mucDo}
//                           </Text>
//                         </View>
//                       </View>

//                       {/* <Text
//                         style={[
//                           styles.text2,
//                           {
//                             color: 'red',
//                             fontWeight: 'bold',
//                             fontStyle: 'italic',
//                             marginTop: 2,
//                           },
//                         ]}>
//                         Nộp hồ sơ
//                       </Text> */}
//                     </View>

//                     <View style={styles.chiTietViewLinhVuc}>
//                       <Text style={[styles.text1, {color: 'black'}]}>
//                         {tt.tenLinhVuc}
//                       </Text>
//                     </View>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           </ScrollView>

//           <View style={styles.viewContainerPreNext}>
//             <View style={styles.viewPreNext}>
//               <TouchableOpacity
//                 onPress={() => {
//                   handlePrePrePage();
//                   getMangDanhSachThuTuc();
//                 }}>
//                 <View
//                   style={[
//                     styles.viewButtonNext,
//                     {
//                       backgroundColor: viTri === 0 ? '#a9a9a9' : '#245d7c',
//                     },
//                   ]}>
//                   <Image
//                     source={require('../../../../../images/previous.png')}
//                     style={styles.iconButtonNext}
//                     tintColor={'#ffffff'}
//                   />
//                 </View>
//               </TouchableOpacity>

//               <TouchableOpacity onPress={handlePrePage}>
//                 <View
//                   style={[
//                     styles.viewButtonNext,
//                     {
//                       marginLeft: 6,
//                       backgroundColor: viTri === 0 ? '#a9a9a9' : '#245d7c',
//                     },
//                   ]}>
//                   <Image
//                     source={require('../../../../../images/backk.png')}
//                     style={styles.iconButtonNext}
//                     tintColor={'#ffffff'}
//                   />
//                 </View>
//               </TouchableOpacity>

//               <View
//                 style={{
//                   position: 'absolute',
//                   right: 0,
//                   flexDirection: 'row',
//                   height: 31,
//                 }}>
//                 <TouchableOpacity onPress={handleNextPage}>
//                   <View
//                     style={[
//                       styles.viewButtonNext,
//                       {
//                         backgroundColor:
//                           duLieuHienTai.length >= soLuongBanGhiHienThi
//                             ? '#245d7c'
//                             : '#a9a9a9',
//                       },
//                     ]}>
//                     <Image
//                       source={require('../../../../../images/nextt.png')}
//                       style={styles.iconButtonNext}
//                       tintColor={'#ffffff'}
//                     />
//                   </View>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   onPress={() => {
//                     handleNextNextPage();
//                   }}>
//                   <View
//                     style={[
//                       styles.viewButtonNext,
//                       {
//                         borderRadius: 4,
//                         marginLeft: 6,
//                         backgroundColor:
//                           duLieuHienTai.length >= soLuongBanGhiHienThi
//                             ? '#245d7c'
//                             : '#a9a9a9',
//                       },
//                     ]}>
//                     <Image
//                       source={require('../../../../../images/right_right.png')}
//                       style={styles.iconButtonNext}
//                       tintColor={'#ffffff'}
//                     />
//                   </View>
//                 </TouchableOpacity>
//               </View>
//               {/*  */}
//             </View>
//           </View>
//         </View>
//       </View>

//       <Footer />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: getWidth,
//     height: getHeight,
//   },

//   body: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     borderTopLeftRadius: 40,
//     borderTopRightRadius: 40,
//     marginTop: -45,
//   },

//   openMenu: {
//     height: 33,
//     backgroundColor: '#245d7c',
//     marginTop: 15,
//     borderTopLeftRadius: 30,
//     borderBottomRightRadius: 30,
//     justifyContent: 'center',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },

//   iconOpenMenu: {
//     width: 16,
//     height: 16,
//   },

//   containerSearchAndClose: {
//     position: 'absolute',
//     right: 0,
//     bottom: 0,
//     width: 70,
//     height: 44,
//     flexDirection: 'row',
//   },

//   containerClose: {
//     width: '60%',
//     height: '100%',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   textInput: {
//     width: '100%',
//     fontSize: 16,
//     borderColor: 'gray',
//     borderWidth: 0.7,
//     padding: 3,
//     borderRadius: 20,
//     color: 'black',
//   },

//   image: {
//     width: 16,
//     height: 16,
//     marginTop: 8,
//   },

//   marginBody: {
//     marginLeft: 10,
//     marginRight: 10,
//   },

//   danhSachThuTucTieuDe: {
//     flexDirection: 'row',
//     height: 30,
//     marginBottom: 8,
//   },

//   text: {
//     color: '#ffffff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },

//   text1: {
//     fontSize: 16,
//   },

//   text2: {
//     fontSize: 15.5,
//     marginLeft: 10,
//     color: 'black',
//   },

//   viewSTT: {
//     width: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#245d7c',
//     borderTopLeftRadius: 13,
//     borderBottomLeftRadius: 13,
//   },

//   viewTenThuTuc: {
//     width: 265,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#245d7c',
//     marginLeft: 1.5,
//     marginRight: 1,
//   },

//   viewLinhVuc: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#245d7c',
//     borderTopRightRadius: 13,
//     borderBottomRightRadius: 13,
//   },

//   chiTietDanhSachThuTuc: {
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     height: 85,
//     borderWidth: 0.5,
//     marginBottom: 15,
//     borderRadius: 8,
//     borderColor: 'gray',
//     // shadowColor: 'gray',
//     // shadowOpacity: 0.4,
//     // shadowRadius: 4,
//     // shadowOffset: {width: 0, height: 2},
//     // elevation: 6,
//   },

//   chiTietViewSTT: {
//     width: 50,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRightWidth: 0.3,
//     borderRightColor: 'gray',
//   },

//   chiTietViewTenThuTuc: {
//     width: 265,
//     marginLeft: 1.5,
//     marginRight: 1,
//     justifyContent: 'center',
//   },

//   chiTietViewLinhVuc: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderLeftWidth: 0.3,
//     borderLeftColor: 'gray',
//   },

//   chiTietViewTenThuTucMucDo: {
//     flexDirection: 'row',
//     marginTop: 10,
//   },

//   viewMucDo: {
//     width: 18,
//     height: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'red',
//     borderRadius: 20,
//     marginLeft: 5,
//     marginTop: 5,
//   },

//   viewData: {
//     borderBottomColor: 'gray',
//     borderBottomWidth: 0.3,
//     marginBottom: 10,
//   },

//   viewContainerPreNext: {
//     height: 31,
//     marginTop: 5,
//     width: '100%',
//     alignItems: 'center',
//   },

//   viewPreNext: {
//     width: 270,
//     height: '100%',
//     flexDirection: 'row',
//   },

//   viewButtonNext: {
//     width: 31,
//     height: '100%',
//     backgroundColor: '#a9a9a9',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 4,
//   },

//   iconButtonNext: {
//     height: 19,
//     width: 19,
//   },

//   viewDrawer: {
//     width: (2 * getWidth) / 3,
//     height: getHeight,
//     backgroundColor: '#245d7c',
//   },

//   iconMenu: {
//     height: 30,
//     width: 25,
//     tintColor: '#fff',
//     marginLeft: 15,
//   },

//   drawerText: {
//     marginLeft: 40,
//     marginTop: 20,
//   },

//   viewTouchableOpacity: {
//     flexDirection: 'row',
//   },

//   iconDrawer: {
//     width: 28,
//     height: 28,
//   },

//   textTouchableOpacity: {
//     color: '#ffffff',
//     fontSize: 23,
//     marginLeft: 15,
//     fontWeight: 'bold',
//   },
// });
// export default TrangChu;
