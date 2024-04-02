import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  Text,
  Touchable,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import HeaderBack from '../../../Untils/HeaderBack';
import {IDthutuc, MangQuyen} from '../DanhSachThuTuc/CBXL_DanhSachThuTuc';
import DatePicker from 'react-native-date-picker';
import {Button, DataTable, TextInput} from 'react-native-paper';
import {RadioButton} from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import moment from 'moment';
import {token} from '../../../../DangNhap/dangNhap';
import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import CheckBox from '@react-native-community/checkbox';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {
  ThongTinGiangVien,
  getThongTinhGiangVien,
} from '../../../../../api/GetThongTin/ThongTinGiangVien';
import ModalThongBao from '../../../Untils/ModalThongBao';
import {Nenfile} from './Nenfile';
import {
  TEMPLATE_EMAIL_SUBJECT,
  sendEmailTTHCGV_CBNV_TP,
  sendEmailTTHCGV_TP_CBNV,
  sendEmailTTHCGV_MucDo2,
  sendEmailTTHCGiangVien,
  sendEmailTTHCGV_TP_BGH,
} from './GuiEmail';

const getWidth = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
const Chitiethosoxuly = props => {
  const [openModal, setOpenModal] = useState(false);
  const [getTrangThai1, setTrangThai1] = useState('');
  const [chiTietTiepNhanHoSo, setChiTietTiepNhanHoSo] = useState([]);
  const [hasData, setHasData] = useState(false);

  const Open = tt => {
    setOpenModal(true);
    setTrangThai1(tt);
  };
  const Close = () => {
    setOpenModal(false);
  };
  const [tabledata, setTableData] = useState([]);
  const [YeuCauID, setYeuCauID] = useState(0);
  const [TrangThaiSTT, setTrangThaiSTT] = useState(0);
  const [idThuTuc, setidThuTuc] = useState(props.route.params.IDGuiYeuCau);
  const [MangBuocHienHanh, setMangBuocHienHanh] = useState({});
  const [MangQuyTrinh, Setmangquytrinh] = useState([]);
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
  var getAPI1 = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Load_R_Para_File`;
  const getDataHoSo = async IDthutuc => {
    const callApi = async IDthutuc => {
      const response = await axios.get(getAPI1, {
        params: {MC_TTHC_GV_GuiYeuCau_ID: IDthutuc},
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTableData(await response.data.body[0]);
      // console.log(response.data.body[0]);
      console.log(
        'Trạng thái id:' + response.data.body[0].MC_TTHC_GV_TrangThai_STT,
      );
      console.log('ID thủ tục: ' + idThuTuc);

      if (response.data.body[0].MC_TTHC_GV_TrangThai_STT === null) {
        setTrangThaiSTT(0);
      } else {
        setTrangThaiSTT(response.data.body[0].MC_TTHC_GV_TrangThai_STT + 1);
      }

      setYeuCauID(response.data.body[0].MC_TTHC_GV_GuiYeuCau_YeuCau_ID);
    };
    try {
      await retry(() => callApi(IDthutuc));
    } catch (error) {
      console.error(error + 'Getdatahoso');
    }
  };
  const [tabledata2, setTableData2] = useState([]);
  var getAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_ThanhPhanHoSoTiepNhan/GuiYeuCau_Load_ByIDGuiYeuCau?MC_TTHC_GV_GuiYeuCau_ID=${idThuTuc}`;
  const getDataTabble = async () => {
    const callApi = async () => {
      const response = await axios.get(getAPI, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setTableData2(response.data.body);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdatatbale');
    }
  };
  const getDataQuyTrinh = async () => {
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TrangThaiTiepNhan/TrangThai_Load_ByIDGoc?MC_TTHC_GV_IDTTHC=${YeuCauID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setquytrinh(response.data.body);
      //console.log("Data quy trinh:"+response.data.body);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdataquytrinh');
    }
  };
  const [TenTrangThai, setTenTrangThai] = useState('');
  const getTrangThaiHienHanh = async TrangThaiSTT => {
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TrangThaiTiepNhan/TrangThai_GetID_BySTT?MC_TTHC_GV_GuiYeuCau_YeuCau_ID=${YeuCauID}&MC_TTHC_GV_TrangThai_STT=${TrangThaiSTT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.data.body[0];
      console.log(data);
      setMangBuocHienHanh(data);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdatatrangthaihienhanh');
    }
  };
  const getTrangThaiHienHanh1 = async TrangThaiSTT => {
    if (checked === '1') {
      TrangThaiSTT = TrangThaiSTT - 2;
      handleModalPress3();
    }
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TrangThaiTiepNhan/TrangThai_GetID_BySTT?MC_TTHC_GV_GuiYeuCau_YeuCau_ID=${YeuCauID}&MC_TTHC_GV_TrangThai_STT=${TrangThaiSTT}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.data.body[0];
      console.log(data);
      const TrangThai = data.MC_TTHC_GV_TrangThai_ID;
      const TenTrangThai = data.MC_TTHC_GV_TrangThai_TenTrangThai;
      if (PostYeuCau({TrangThai, TenTrangThai}) === 200) {
        handleModalPress2();
      } else {
        // handleModalPress11();
        setcheckstatuspost('1');
      }
      await getDataHoSo(idThuTuc);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdatatrangthaihienhanh');
    }
  };
  const getQuytrinhXuly = async () => {
    const callApi = async () => {
      const response = await axios.get(
        `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_CBNV_TheoDoi_QuyTrinhXuLy_Load_Para?MC_TTHC_GV_GuiYeuCau_ID=${idThuTuc}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      const data = await response.data.body;
      console.log(data);
      Setmangquytrinh(data);
      //   console.log('data trạng thái hiện hành: '+
      // await response.data.body[0]);
      console.log(data);
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getdataquytrinhxuly');
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
      if (response.status === 400) {
        console.log('Lỗi cmnr');
      }
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
        console.log('Mảng chi tiết hồ sơ:' + mangChiTietTiepNhanHoSo);
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
  const [emailcbxl, setemailcbxl] = useState('');
  const apigetemailcbxl = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_PhanQuyenTiepNhan/Load_CanBoXuLy_ByIDGoc?MC_TTHC_GV_PhanQuyen_IDTTHC=${idThuTuc}`;
  const getemailcbxl = async () => {
    const callApi = async () => {
      const response = await axios.get(apigetemailcbxl, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.body.length === 0) {
        setemailcbxl('');
      } else {
        console.log('Email CBXL: ' + response.body[0].QTPM_QLEMAIL_EmailUneti);
        setemailcbxl(response.body[0].QTPM_QLEMAIL_EmailUneti);
      }
    };
    try {
      await retry(callApi);
    } catch (error) {
      console.error(error + 'Getemailcbxl');
    }
  };

  useEffect(() => {
    if (tabledata2 === 0) return;
    getDataTabble();
  }, [tabledata2]);
  const [dataquytrinh, setquytrinh] = useState([]);
  useEffect(() => {
    getQuytrinhXuly();
  }, []);
  useEffect(() => {
    getDataHoSo(idThuTuc);
    getemailcbxl();
  }, []);
  useEffect(() => {
    if (TrangThaiSTT === 0 || YeuCauID === 0) return;
    getDataQuyTrinh();
    getTrangThaiHienHanh(TrangThaiSTT);
  }, [TrangThaiSTT, YeuCauID]);

  useEffect(() => {
    getThongTinhGiangVien();
  }, []);
  useEffect(() => {
    if (YeuCauID !== '' || getTrangThai1 !== '') {
      getChiTietTiepNhanHoSo(idThuTuc, getTrangThai1);
    }
  }, [idThuTuc, getTrangThai1]);
  useEffect(() => {
    if (!isSecondViewVisible) {
      setFirstViewHeight(20); // Reset height if second view is visible
    } else {
      setFirstViewHeight(600); // Set height to 50 when second view is invisible
    }
    if (tabledata.MC_TTHC_GV_TrangThai_STT_TPD === TrangThaiSTT) {
      setFirstViewHeight(670);
    }
  });

  const [checked, setChecked] = useState('');
  const [checked1, setChecked1] = useState('0');
  const [status, setstatus] = useState(true);
  const [status1, setstatus1] = useState(true);
  const [status2, setstatus2] = useState(true);
  const [status3, setstatus3] = useState(true);
  const [isSecondViewVisible, setIsSecondViewVisible] = useState(true);
  const [firstViewHeight, setFirstViewHeight] = useState(600);
  const [open, setopen] = useState(false);
  const [ngaygui, setngaygui] = useState(new Date());
  const handlePress = () => {
    setopen(!open);
  };
  const [checkedNNHS, setCheckedNNHS] = useState(true);
  const [checkedCBXL, setCheckedCBXL] = useState(true);
  const [checkedTPDV, setCheckedTPDV] = useState(true);
  const [checkboxColor, setCheckboxColor] = useState('#245d7c');
  const [checkboxUncheckedColor, setCheckboxUncheckedColor] = useState('gray');
  const [isDisabled, setIsDisabled] = useState(false);
  const [isDisabled1, setIsDisabled1] = useState(false);
  const [noidung, setnoidung] = useState('');
  const [link, setlink] = useState('');
  const [diadiem, setdiadiem] = useState('');
  const [checkstatuspost, setcheckstatuspost] = useState('');
  useEffect(() => {
    if (MangQuyen[0] === '16' || MangQuyen[0] === '24') {
      setIsDisabled(!isDisabled);
    }
    if (MangQuyen[0] === '16' || MangQuyen[0] === '25') {
      setIsDisabled1(!isDisabled1);
    }
  }, []);
  const [FileName, setFileName] = useState('');
  const [base64FileChoose, setBase64] = useState('');
  const readFileAsBase64 = async fileUri => {
    try {
      const base64Data = await RNFS.readFile(fileUri, 'base64');
      return base64Data;
    } catch (error) {
      console.error('Error reading file:', error);
      return null;
    }
  };
  const chooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
        allowMultiSelection: true,
      });
      var dem1 = 0;
      var dem2 = 0;
      console.log('TYpe: ' + res[0].type);
      for (var i = 0; i < res.length; i++) {
        if (res[i].type === 'application/pdf') {
          dem1++;
        }
        if (
          res[i].type === 'image/jpeg' ||
          res[i].type === 'image/png' ||
          res[i].type === 'image/jpg'
        ) {
          dem2++;
        }
      }
      if (dem1 != 0 && dem2 != 0) {
        handleModalPress9();
      }
      if (dem1 != 0 && dem2 == 0) {
        setFileName(res[0].name);
        handleModalPress8();
        const base64Content1 = await readFileAsBase64(res[0].uri);
        setBase64('data:' + res[0].type + ';base64,' + base64Content1);
      }
      if (dem1 == 0 && dem2 != 0) {
        for (var i = 0; i < res.length; i++) {
          console.log(res[i].uri);
          if (FileName.slice(-3) === 'pdf') {
            setFileName('');
          }
          setFileName(FileName => FileName + '+)' + res[i].name + '\n');
        }
        const nenhtml = await Nenfile(res);
        const options = {
          html: nenhtml,
          fileName: 'convertedPdf',
          directory: 'Documents',
        };
        // console.log("Tep nen"+nenhtml);

        RNHTMLtoPDF.convert(options)
          .then(async filePath => {
            console.log(filePath);
            const pdfContent = await RNFS.readFile(filePath.filePath, 'base64');
            setBase64('data:application/pdf;base64,' + pdfContent);
          })
          .catch(error => {
            handleModalPress7();
            setFileName('');
            setBase64('');
          });
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('Hủy chọn tệp');
      } else {
        handleModalPress10();
      }
    }
  };

  var PutAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Edit_Para`;
  const PostYeuCau = async ({TrangThai, TenTrangThai}) => {
    var postdata = {
      MC_TTHC_GV_GuiYeuCau_ID: idThuTuc ? idThuTuc : '',
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu
          ? tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu
          : '',
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email
          ? tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email
          : '',
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT
          ? tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT
          : '',
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa
          ? tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa
          : '',
      MC_TTHC_GV_GuiYeuCau_YeuCau_ID: YeuCauID ? YeuCauID : '',
      MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu: tabledata
        ? tabledata.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu
        : '',
      MC_TTHC_GV_GuiYeuCau_TrangThai_ID: TrangThai ? TrangThai : '',

      MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu: TenTrangThai ? TenTrangThai : '',

      MC_TTHC_GV_GuiYeuCau_NgayGui: moment
        .utc(moment(), 'DD/MM/YYYY')
        .toISOString(),
      MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
        tabledata.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
      MC_TTHC_GV_GuiYeuCau_DaNop: tabledata.MC_TTHC_GV_GuiYeuCau_DaNop,
      MC_TTHC_GV_GuiYeuCau_NgayHenTra:
        tabledata.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
      MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: FileName ? FileName : '',
      MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: base64FileChoose
        ? base64FileChoose
        : '',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: checked ? checked : '',
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: 'string',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: checked1,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: 'string',
      MC_TTHC_GV_GuiYeuCau_NgayGiaoTra:
        tabledata.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
      MC_TTHC_GV_GuiYeuCau_NoiTraKetQua:
        tabledata.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
      MC_TTHC_GV_GuiYeuCau_NguonTiepNhan:
        tabledata.MC_TTHC_GV_GuiYeuCau_NguonTiepNhan,
    };
    console.log(postdata);
    try {
      const response = await axios.put(PutAPI, postdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.status;
    } catch (error) {
      console.error(error);
    }
  };
  var PutAPI = `https://apiv2.uneti.edu.vn/api/SP_MC_TTHC_GV_TiepNhan/GuiYeuCau_Edit_Para`;
  const Huytra = async () => {
    var postdata = {
      MC_TTHC_GV_GuiYeuCau_ID: idThuTuc,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_SDT,
      MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa:
        tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa,
      MC_TTHC_GV_GuiYeuCau_YeuCau_ID: YeuCauID,
      MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu:
        tabledata.MC_TTHC_GV_GuiYeuCau_YeuCau_GhiChu,
      MC_TTHC_GV_GuiYeuCau_TrangThai_ID: -1,

      MC_TTHC_GV_GuiYeuCau_TrangThai_GhiChu: 'Hủy trả hồ sơ',

      MC_TTHC_GV_GuiYeuCau_NgayGui: moment
        .utc(moment(), 'DD/MM/YYYY')
        .toISOString(),
      MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong:
        tabledata.MC_TTHC_GV_GuiYeuCau_KetQua_SoLuong,
      MC_TTHC_GV_GuiYeuCau_DaNop: tabledata.MC_TTHC_GV_GuiYeuCau_DaNop,
      MC_TTHC_GV_GuiYeuCau_NgayHenTra:
        tabledata.MC_TTHC_GV_GuiYeuCau_NgayHenTra,
      MC_TTHC_GV_GuiYeuCau_TraKetQua_TenFile: '',
      MC_TTHC_GV_GuiYeuCau_TraKetQua_DataFile: null,
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetTruongPhong: null,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetTruongPhong: '',
      MC_TTHC_GV_GuiYeuCau_TrangThaiPheDuyetBGH: null,
      MC_TTHC_GV_GuiYeuCau_MoTaTTPheDuyetBGH: '',
      MC_TTHC_GV_GuiYeuCau_NgayGiaoTra:
        tabledata.MC_TTHC_GV_GuiYeuCau_NgayGiaoTra,
      MC_TTHC_GV_GuiYeuCau_NoiTraKetQua:
        tabledata.MC_TTHC_GV_GuiYeuCau_NoiTraKetQua,
      MC_TTHC_GV_GuiYeuCau_NguonTiepNhan:
        tabledata.MC_TTHC_GV_GuiYeuCau_NguonTiepNhan,
    };
    console.log(postdata);
    try {
      const response = await axios.put(PutAPI, postdata, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.status === 200) {
        handleModalPress5();
      }
    } catch (error) {
      console.error(error);
    }
  };
  var SendEmail = `https://apiv2.uneti.edu.vn/api/send-email/Verifier`;
  const sendEmail = async acTion => {
    const {contentReply, emailHtml, subjectEmail} = sendEmailTTHCGiangVien({
      action: acTion,
      contentSubject: 'Send email',
      dataUserSuggest: tabledata,
      dataUserHandle: {
        HoDem: ThongTinGiangVien.HoDem,
        Ten: ThongTinGiangVien.Ten,
        Email: ThongTinGiangVien.Email,
        SoDienThoai: ThongTinGiangVien.SoDienThoai,
      },
      listThanhPhanHoSo: tabledata2,
      contentReply: noidung,
      linkFileKemTheo: link,
    });
    console.log('Dữ liệu 429', contentReply);
    const data = {
      to: tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email
        ? tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email
        : '', //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: contentReply, //Nội dung email
      tenfile: FileName, //ten file đó
      dulieu: base64FileChoose, //dữ liệu của file đó
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thông báo', 'Yêu cầu đã được gửi trước đó');
      } else {
        if (response.status == 200) {
          handleModalPress2();
        }
      }

      if (response.status === 403) {
      }
      if (response.status === 400) {
        setcheckstatuspost('1');
      }
    } catch (error) {
      console.error(error);
      setcheckstatuspost('1');
    }
  };
  const sendEmail1 = async () => {
    const {subjectEmail, emailHtml, contentEmail} =
      await sendEmailTTHCGV_CBNV_TP(
        '', // contentSubject
        tabledata, // dataUserSuggest
        {
          // dataUserHandle
          HoDem: ThongTinGiangVien.HoDem,
          Ten: ThongTinGiangVien.Ten,
          Email: ThongTinGiangVien.Email,
          SoDienThoai: ThongTinGiangVien.SoDienThoai,
        },
        tabledata2, // listThanhPhanHoSo
        noidung, // contentEmail
        link,
      );

    const data = {
      to: tabledata.MC_TTHC_GV_EmailTruongPhongPheDuyet, // Email muốn gửi đến
      subject: subjectEmail, // contentTitle // Tiêu đề email
      text: contentEmail, // Nội dung email
      tenfile: FileName, //ten file đó
      dulieu: base64FileChoose, //dữ liệu của file đó
      html: emailHtml,
    };
    console.log('🚀 ~ sendEmail1 ~ data:', data);
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thông báo', 'Yêu cầu đã được gửi trước đó');
      } else {
        if (response.status == 200) {
          handleModalPress2();
        }
      }
      if (response.status === 400) {
        setcheckstatuspost('1');
      }
      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
      // handleModalPress11();
      setcheckstatuspost('1');
    }
  };
  const sendEmail2 = async () => {
    let contentSubject = '';
    if (checked === '0') {
      contentSubject = 'Phê duyệt';
    }
    if (checked === '1') {
      contentSubject = 'Không phê duyệt';
    }
    if (checked === '2') {
      contentSubject = 'Trình duyệt';
    }
    const {emailHtml, subjectEmail, noiDungLyDo} =
      await sendEmailTTHCGV_TP_CBNV(
        contentSubject,
        tabledata,
        {
          HoDem: ThongTinGiangVien.HoDem,
          Ten: ThongTinGiangVien.Ten,
          Email: ThongTinGiangVien.Email,
          SoDienThoai: ThongTinGiangVien.SoDienThoai,
        },
        tabledata2,
        noidung,
        link,
      );

    const data = {
      to: emailcbxl ? emailcbxl : '', //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: noiDungLyDo, //Nội dung email
      tenfile: FileName, //ten file đó
      dulieu: base64FileChoose, //dữ liệu của file đó
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thông báo', 'Yêu cầu đã được gửi trước đó');
      } else {
        if (response.status == 200) {
          handleModalPress2();
        }
      }
      if (response.status === 400) {
        setcheckstatuspost('1');
      }
      if (response.status === 403) {
      }
    } catch (error) {
      console.error(error);
      setcheckstatuspost('1');
    }
  };
  const sendEmail3 = async () => {
    const {emailHtml, subjectEmail, noiDungTrinhDuyet} =
      await sendEmailTTHCGV_TP_BGH(
        'Trình duyệt',
        tabledata,
        {
          MaNhanSu: ThongTinGiangVien.MaNhanSu,
          HienTaiPhongBan: ThongTinGiangVien.HienTaiPhongBan,
          HoDem: ThongTinGiangVien.HoDem,
          Ten: ThongTinGiangVien.Ten,
          Email: ThongTinGiangVien.Email,
          SoDienThoai: ThongTinGiangVien.SoDienThoai,
        },
        tabledata2,
        noidung,
        link,
      );

    const data = {
      to: tabledata.MC_TTHC_GV_EmailBGHPheDuyet, //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: noiDungTrinhDuyet, //Nội dung email
      tenfile: FileName, //ten file đó
      dulieu: base64FileChoose, //dữ liệu của file đó
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thông báo', 'Yêu cầu đã được gửi trước đó');
      } else {
        if (response.status == 200) {
          handleModalPress2();
        }
      }
      if (response.status === 403) {
      }
      if (response.status === 400) {
        setcheckstatuspost('1');
      }
    } catch (error) {
      console.error(error);
      setcheckstatuspost('1');
    }
  };
  const senEmailMD2 = async () => {
    let momentTime = moment.utc(ngaygui).utcOffset('+07:00');
    let ngaygio = momentTime.format('DD/MM/YYYY HH:mm:ss');
    const {emailHtml, subjectEmail, contentReply} =
      await sendEmailTTHCGV_MucDo2(
        TenTrangThai,
        tabledata,
        {
          HoDem: ThongTinGiangVien.HoDem,
          Ten: ThongTinGiangVien.Ten,
          Email: ThongTinGiangVien.Email,
          SoDienThoai: ThongTinGiangVien.SoDienThoai,
        },
        noidung,
        ngaygio,
        diadiem,
        tabledata2,
        link,
      );
    const data = {
      to: tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email, //Email muốn gửi đến
      subject: subjectEmail, // contentTitle //Tiêu đề email
      text: contentReply, //Nội dung email
      tenfile: FileName, //ten file đó
      dulieu: base64FileChoose, //dữ liệu của file đó
      html: emailHtml,
    };
    try {
      const response = await axios.post(SendEmail, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log(response);
      if (response.data.message === 'Bản ghi bị trùng.') {
        Alert.alert('Thông báo', 'Yêu cầu đã được gửi trước đó');
      } else {
        if (response.status == 200) {
          handleModalPress2();
        }
      }
      if (response.status === 403) {
      }
      if (response.status === 400) {
        setcheckstatuspost('1');
      }
    } catch (error) {
      console.error(error);
      setcheckstatuspost('1');
    }
  };
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
  const [showModal10, setShowModal10] = useState(false);
  const handleModalPress10 = () => {
    setShowModal10(true);
  };
  const handleCloseModal10 = () => {
    setShowModal10(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBack
        title="CHI TIẾT XỬ LÝ HỒ SƠ"
        onPress={() => {
          props.navigation.goBack();
        }}
      />
      <ModalThongBao
        visible={showModal}
        onClose={handleCloseModal}
        message="Mời nhập đủ nội dung!!!"
      />
      <ModalThongBao
        visible={showModal1}
        onClose={handleCloseModal1}
        message="Bạn không có quyền xử lý bước này!!!"
      />
      <ModalThongBao
        visible={showModal2}
        onClose={handleCloseModal2}
        message="Gửi yêu cầu thành công. Vui lòng kiểm tra email gửi về!!!"
      />
      <ModalThongBao
        visible={showModal3}
        onClose={handleCloseModal3}
        message="Hồ sơ không được phê duyệt!!!"
      />
      <ModalThongBao
        visible={showModal4}
        onClose={handleCloseModal4}
        message="Hãy nhập đầy đủ thông tin (*)"
      />
      <ModalThongBao
        visible={showModal5}
        onClose={handleCloseModal5}
        message="Đã hủy trả hồ sơ!!!"
      />
      <ModalThongBao
        visible={showModal6}
        onClose={handleCloseModal6}
        message="Hãy chọn trạng thái!!!"
      />
      <ModalThongBao
        visible={showModal7}
        onClose={handleCloseModal7}
        message="Lỗi chọn tệp!Hãy thử lại"
      />
      <ModalThongBao
        visible={showModal8}
        onClose={handleCloseModal8}
        message="Bạn chỉ được chọn 1 tệp .PDF!!!"
      />
      <ModalThongBao
        visible={showModal9}
        onClose={handleCloseModal9}
        message="Bạn chỉ được chọn 1 trong 2 : Ảnh hoặc .PDF!!!"
      />
      <ModalThongBao
        visible={showModal10}
        onClose={handleCloseModal10}
        message="Hãy chọn tệp đún định dạng : Ảnh hoặc .PDF!!!"
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
      <ScrollView>
        <View>
          <View style={styles.tieudelon}>
            <TouchableOpacity
              onPress={() => {
                setstatus(!status);
                getemailcbxl();
              }}>
              {status ? (
                <Image
                  source={require('../../../../../images/minus.png')}
                  style={{width: 20, height: 20}}
                />
              ) : (
                <Image
                  source={require('../../../../../images/add.png')}
                  style={{width: 20, height: 20}}
                />
              )}
            </TouchableOpacity>

            <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
              Thông tin người nộp hồ sơ
            </Text>
          </View>
          {status ? (
            <View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Mã nhân sự: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_MaNhanSu}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Họ và tên: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.HoTen}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Ngày sinh: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {moment(tabledata.NgaySinh).format('DD/MM/YYYY')}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Email: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Email}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Đơn vị: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', marginLeft: 40},
                    ]}>
                    {tabledata.MC_TTHC_GV_GuiYeuCau_NhanSuGui_Khoa}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}

          <View style={styles.tieudelon}>
            <TouchableOpacity
              onPress={() => {
                setstatus1(!status1);
              }}>
              {status1 ? (
                <Image
                  source={require('../../../../../images/minus.png')}
                  style={{width: 20, height: 20}}
                />
              ) : (
                <Image
                  source={require('../../../../../images/add.png')}
                  style={{width: 20, height: 20}}
                />
              )}
            </TouchableOpacity>

            <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
              Thông tin hồ sơ
            </Text>
          </View>
          {status1 ? (
            <View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Lĩnh vực: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_LinhVuc}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Tên thủ tục: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text
                    style={[
                      styles.TextNormal,
                      {textAlign: 'left', width: 240},
                    ]}>
                    {tabledata.MC_TTHC_GV_TenThuTuc}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '25%'}}>
                  <Text style={styles.TextBold}>Mã thủ tục: </Text>
                </View>
                <View style={{width: '80%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_MaThuTuc}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '35%'}}>
                  <Text style={styles.TextBold}>Mức độ thủ tục: </Text>
                </View>
                <View style={{width: '65%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_IDMucDo}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '35%'}}>
                  <Text style={styles.TextBold}>Ngày nộp hồ sơ: </Text>
                </View>
                <View style={{width: '65%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {moment(tabledata.MC_TTHC_GV_GuiYeuCau_NgayGui).format(
                      'DD/MM/YYYY',
                    )}
                  </Text>
                </View>
              </View>
              <View style={styles.ViewNgang}>
                <View style={{width: '35%'}}>
                  <Text style={styles.TextBold}>Đơn vị tiếp nhận: </Text>
                </View>
                <View style={{width: '65%'}}>
                  <Text style={[styles.TextNormal, {textAlign: 'left'}]}>
                    {tabledata.MC_TTHC_GV_NoiTiepNhan}
                  </Text>
                </View>
              </View>
              <View style={{marginTop: 20}}>
                <Text style={[styles.TextBold, {marginLeft: 30}]}>
                  Giấy tờ kèm theo:
                </Text>
                <ScrollView horizontal>
                  <DataTable
                    style={{
                      width: 500,
                      marginLeft: -10,
                      marginRight: -10,
                      marginBottom: 10,
                      marginTop: 5,
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
                          STT
                        </Text>
                      </DataTable.Title>
                      <DataTable.Title
                        style={[
                          {
                            flex: 0.6,
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
                            flex: 0.4,
                            borderTopRightRadius: 10,
                          },
                          styles.TitleTable,
                        ]}>
                        <Text style={[styles.TextBold, {color: 'white'}]}>
                          Giấy tờ kèm theo
                        </Text>
                      </DataTable.Title>
                    </DataTable.Header>
                    {tabledata2
                      ? tabledata2.map((td, index) => (
                          <DataTable.Row key={index}>
                            <DataTable.Cell
                              style={[
                                styles.CellTableFirst,
                                {
                                  flex: 0.1,
                                },
                              ]}>
                              <Text style={styles.TextNormal}>{++index}</Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                              style={[
                                styles.CellTableFirst,
                                {
                                  flex: 0.6,
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
                                  flex: 0.4,
                                },
                              ]}>
                              <TouchableOpacity
                                onPress={() => {
                                  // handleDownloadFile(td);
                                  //console.log(base64Content);
                                  let bufferdata =
                                    td
                                      .MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_DataFile
                                      .data;
                                  let buffer = Buffer.from(bufferdata);
                                  let base64content = buffer.toString('base64');
                                  // //  console.log("B64: "+base64content);
                                  const directory =
                                    Platform.OS === 'android'
                                      ? '/storage/emulated/0/Download'
                                      : RNFS.DocumentDirectoryPath;
                                  saveBufferToFile(
                                    base64content,
                                    td.MC_TTHC_GV_ThanhPhanHoSo_GuiYeuCau_TenFile,
                                    directory,
                                  );
                                }}>
                                <Text style={styles.TextNormal}>Xem</Text>
                              </TouchableOpacity>
                            </DataTable.Cell>
                          </DataTable.Row>
                        ))
                      : null}
                  </DataTable>
                </ScrollView>
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.tieudelon}>
          <TouchableOpacity
            onPress={() => {
              setstatus2(!status2);
            }}>
            {status2 ? (
              <Image
                source={require('../../../../../images/minus.png')}
                style={{width: 20, height: 20}}
              />
            ) : (
              <Image
                source={require('../../../../../images/add.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </TouchableOpacity>

          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Quy trình xử lý
          </Text>
        </View>
        {status2
          ? dataquytrinh
            ? dataquytrinh.map(td => (
                <View style={{marginTop: -10}}>
                  <View style={{flexDirection: 'row'}}>
                    {td.MC_TTHC_GV_TrangThai_STT < TrangThaiSTT ? (
                      <Image
                        source={require('../../../../../images/check-mark.png')}
                        style={{
                          width: 50,
                          height: 50,
                          marginLeft: 10,
                          marginTop: 10,
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../../../../images/dry-clean.png')}
                        style={{
                          width: 50,
                          height: 50,
                          marginLeft: 10,
                          marginTop: 10,
                        }}
                      />
                    )}

                    {td.MC_TTHC_GV_TrangThai_STT < TrangThaiSTT ? (
                      <View style={[styles.tieudebuoc]}>
                        <Text style={styles.texttieudebuoc}>
                          Bước {td.MC_TTHC_GV_TrangThai_STT}:{' '}
                          {td.MC_TTHC_GV_TrangThai_TenTrangThai}
                        </Text>
                      </View>
                    ) : (
                      <View style={[styles.tieudebuoc1]}>
                        <Text style={styles.texttieudebuoc1}>
                          Bước {td.MC_TTHC_GV_TrangThai_STT}:{' '}
                          {td.MC_TTHC_GV_TrangThai_TenTrangThai}
                        </Text>
                      </View>
                    )}
                  </View>

                  {MangBuocHienHanh != null ? (
                    MangBuocHienHanh.MC_TTHC_GV_TrangThai_ID ===
                    td.MC_TTHC_GV_TrangThai_ID ? (
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            height: firstViewHeight,
                            marginTop: -11,
                            width: 1,
                            borderWidth: 1,
                            backgroundColor: '#2e6b8b',
                            borderColor: '#2e6b8b',
                            marginLeft: 33,
                          }}
                        />
                        {TrangThaiSTT === 1 ? (
                          <View style={[styles.noidungtungbuoc]}>
                            <Text
                              style={[
                                styles.TextBold,
                                {marginTop: 5, textAlign: 'center'},
                              ]}>
                              THÔNG BÁO
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {marginLeft: 15, textAlign: 'left'},
                              ]}>
                              Gửi email:
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginLeft: 15,
                                marginTop: 5,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <CheckBox
                                  value={checkedNNHS}
                                  tintColors={{
                                    true: checkboxColor,
                                    false: checkboxUncheckedColor,
                                  }}
                                />
                                <Text
                                  style={[
                                    styles.TextNormal,
                                    {
                                      alignItems: 'center',
                                      marginTop: 7,
                                      fontSize: 13,
                                    },
                                  ]}>
                                  Người nộp hồ sơ
                                </Text>
                              </View>
                            </View>
                            {tabledata.MC_TTHC_GV_IDMucDo === 2 ? (
                              <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: 10, marginLeft: 15}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Ngày giờ hẹn trả
                                  </Text>
                                  <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                      onPress={handlePress}
                                      style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        width: '65%',
                                        borderRadius: 5,
                                      }}>
                                      <DatePicker
                                        modal
                                        mode="datetime"
                                        open={open}
                                        date={ngaygui}
                                        onConfirm={ngaygui => {
                                          setopen(false);
                                          setngaygui(ngaygui);
                                        }}
                                        onCancel={() => {
                                          setopen(false);
                                        }}
                                      />
                                      <TextInput
                                        readOnly={true}
                                        style={{
                                          height: 30,
                                          width: '80%',
                                          backgroundColor: '#ffffff',
                                        }}
                                        value={ngaygui
                                          .toLocaleDateString('vi-VN')
                                          .toString()}
                                      />

                                      <Image
                                        source={require('../../../../../images/calendar.png')}
                                        style={{
                                          width: 25,
                                          height: 25,
                                          marginTop: 2.5,
                                          marginLeft: -3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{marginTop: 10, marginLeft: -30}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Địa điểm hẹn trả
                                    <Text style={{color: 'red'}}>(*)</Text>
                                  </Text>

                                  <TextInput
                                    style={{
                                      height: 20,
                                      width: 120,
                                      fontSize: 18,

                                      borderColor: 'black',
                                      borderWidth: 0.5,
                                      padding: 5,
                                      borderRadius: 5,
                                      borderTopLeftRadius: 5,
                                      borderTopRightRadius: 5,
                                      color: 'black',
                                      backgroundColor: '#ffffff',
                                      backgroundColor: '#ffffff',
                                    }}
                                    onChangeText={text => setdiadiem(text)}
                                    value={diadiem}
                                    multiline={true}
                                    numberOfLines={4}
                                    underlineColor="transparent"
                                  />
                                </View>
                              </View>
                            ) : null}
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Nội dung:<Text style={{color: 'red'}}>(*)</Text>
                            </Text>
                            <TextInput
                              style={{
                                width: '91%',
                                marginLeft: 15,
                                backgroundColor: '#ffffff',
                                marginRight: 15,
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 70,
                              }}
                              value={noidung}
                              onChangeText={text => setnoidung(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Tài liệu kèm theo:
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Links tệp đính kèm:
                            </Text>
                            <TextInput
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 30,
                              }}
                              placeholder="Nhập link tệp đính kèm"
                              value={link}
                              onChangeText={text => setlink(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Hoặc
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm:
                            </Text>
                            <View
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  chooseFile();
                                }}
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  width: '30%',
                                  backgroundColor: '#C0C0C0',
                                  marginLeft: 2,
                                  height: 30,
                                  marginTop: 2,
                                  marginBottom: 2,
                                  justifyContent: 'center',
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
                              <View
                                style={{
                                  width: '69%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <ScrollView nestedScrollEnabled={true}>
                                  <Text
                                    numberOfLines={10}
                                    style={[
                                      styles.TextNormal,
                                      {
                                        marginLeft: 3,
                                        textAlign: 'left',
                                        width: '90%',
                                        marginTop: 16,
                                      },
                                    ]}>
                                    {FileName ? FileName : 'Chưa có tệp'}
                                  </Text>
                                </ScrollView>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm phải có dạng PDF
                            </Text>
                            <Text
                              style={[
                                styles.TextBold,
                                {
                                  textAlign: 'left',
                                  color: 'red',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              (Kích thước tối đa 5 MB)
                            </Text>
                            <View style={styles.viewFooter}>
                              <View
                                style={[
                                  styles.buttonHuy,
                                  {marginLeft: 30, backgroundColor: '#245d7c'},
                                ]}>
                                <TouchableOpacity
                                  style={styles.touchableOpacity}
                                  onPress={() => {
                                    if (noidung === '') {
                                      handleModalPress();
                                    } else {
                                      if (MangQuyen[0] != 16) {
                                        handleModalPress1();
                                      } else {
                                        getTrangThaiHienHanh1(TrangThaiSTT);
                                        if (
                                          tabledata.MC_TTHC_GV_IDMucDo === 2
                                        ) {
                                          if (diadiem === '') {
                                            handleModalPress4();
                                          } else {
                                            senEmailMD2();
                                          }
                                        } else {
                                          sendEmail(
                                            TEMPLATE_EMAIL_SUBJECT.RECEIVED,
                                          );
                                        }
                                      }
                                    }
                                  }}>
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    Tiếp nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View
                                style={[styles.buttonHuy, {marginRight: 30}]}>
                                <TouchableOpacity
                                  style={[
                                    styles.touchableOpacity,
                                    {backgroundColor: 'red'},
                                  ]}
                                  onPress={() => {
                                    Huytra();
                                    sendEmail(TEMPLATE_EMAIL_SUBJECT.CANCEL);
                                  }}>
                                  <Text
                                    style={{color: '#ffffff', fontSize: 19}}>
                                    Hủy trả
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : TrangThaiSTT === 2 ? (
                          <View style={[styles.noidungtungbuoc]}>
                            <Text
                              style={[
                                styles.TextBold,
                                {marginTop: 5, textAlign: 'center'},
                              ]}>
                              THÔNG BÁO
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {marginLeft: 15, textAlign: 'left'},
                              ]}>
                              Gửi email:
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '94.5%',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginLeft: 15,
                                marginTop: 5,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <CheckBox
                                  value={checkedNNHS}
                                  onValueChange={() => {
                                    setCheckedNNHS(!checkedNNHS);
                                  }}
                                  tintColors={{
                                    true: checkboxColor,
                                    false: checkboxUncheckedColor,
                                  }}
                                />
                                <Text
                                  style={[
                                    styles.TextNormal,
                                    {
                                      alignItems: 'center',
                                      marginTop: 7,
                                      fontSize: 13,
                                    },
                                  ]}>
                                  Người nộp hồ sơ
                                </Text>
                              </View>
                              {tabledata.MC_TTHC_GV_IDMucDo != 2 ? (
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    marginLeft: 0,
                                  }}>
                                  <CheckBox
                                    value={checkedTPDV}
                                    tintColors={{
                                      true: checkboxColor,
                                      false: checkboxUncheckedColor,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      alignItems: 'center',
                                      marginTop: 7,
                                      textAlign: 'center',
                                      color: 'black',
                                      fontSize: 13,
                                    }}>
                                    Trưởng/phó đơn vị
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                            {tabledata.MC_TTHC_GV_IDMucDo === 2 ? (
                              <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: 10, marginLeft: 15}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Ngày giờ hẹn trả
                                  </Text>
                                  <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                      onPress={handlePress}
                                      style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        width: '65%',
                                        borderRadius: 5,
                                      }}>
                                      <DatePicker
                                        modal
                                        mode="datetime"
                                        open={open}
                                        date={ngaygui}
                                        onConfirm={ngaygui => {
                                          setopen(false);
                                          setngaygui(ngaygui);
                                        }}
                                        onCancel={() => {
                                          setopen(false);
                                        }}
                                      />
                                      <TextInput
                                        readOnly={true}
                                        style={{
                                          height: 30,
                                          width: '80%',
                                          backgroundColor: '#ffffff',
                                        }}
                                        value={ngaygui
                                          .toLocaleDateString('vi-VN')
                                          .toString()}
                                      />

                                      <Image
                                        source={require('../../../../../images/calendar.png')}
                                        style={{
                                          width: 25,
                                          height: 25,
                                          marginTop: 2.5,
                                          marginLeft: -3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{marginTop: 10, marginLeft: -30}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Địa điểm hẹn trả{' '}
                                    <Text style={{color: 'red'}}>(*)</Text>
                                  </Text>

                                  <TextInput
                                    style={{
                                      height: 20,
                                      width: 120,
                                      fontSize: 18,

                                      borderColor: 'black',
                                      borderWidth: 0.5,
                                      padding: 5,
                                      borderRadius: 5,
                                      borderTopLeftRadius: 5,
                                      borderTopRightRadius: 5,
                                      color: 'black',
                                      backgroundColor: '#ffffff',
                                      backgroundColor: '#ffffff',
                                    }}
                                    onChangeText={text => setdiadiem(text)}
                                    value={diadiem}
                                    multiline={true}
                                    numberOfLines={4}
                                    underlineColor="transparent"
                                  />
                                </View>
                              </View>
                            ) : null}
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Nội dung:<Text style={{color: 'red'}}>(*)</Text>
                            </Text>
                            <TextInput
                              style={{
                                width: '91%',
                                marginLeft: 15,
                                backgroundColor: '#ffffff',
                                marginRight: 15,
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 70,
                              }}
                              value={noidung}
                              onChangeText={text => setnoidung(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Tài liệu kèm theo:
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Links tệp đính kèm:
                            </Text>
                            <TextInput
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 30,
                              }}
                              placeholder="Nhập link tệp đính kèm"
                              value={link}
                              onChangeText={text => setlink(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Hoặc
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm:
                            </Text>
                            <View
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 60,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  chooseFile();
                                }}
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  width: '30%',
                                  backgroundColor: '#C0C0C0',
                                  marginLeft: 2,
                                  height: 30,
                                  marginTop: 2,
                                  marginBottom: 2,
                                  justifyContent: 'center',
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
                              <View
                                style={{
                                  width: '69%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <ScrollView nestedScrollEnabled={true}>
                                  <Text
                                    numberOfLines={10}
                                    style={[
                                      styles.TextNormal,
                                      {
                                        marginLeft: 3,
                                        textAlign: 'left',
                                        width: '90%',
                                        marginTop: 16,
                                      },
                                    ]}>
                                    {FileName ? FileName : 'Chưa có tệp'}
                                  </Text>
                                </ScrollView>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm phải có dạng PDF
                            </Text>
                            <Text
                              style={[
                                styles.TextBold,
                                {
                                  textAlign: 'left',
                                  color: 'red',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              (Kích thước tối đa 5 MB)
                            </Text>
                            <View style={styles.viewFooter}>
                              <View
                                style={[
                                  styles.buttonHuy,
                                  {marginLeft: 30, backgroundColor: '#245d7c'},
                                ]}>
                                <TouchableOpacity
                                  style={styles.touchableOpacity}
                                  onPress={() => {
                                    if (noidung === '') {
                                      handleModalPress();
                                    } else {
                                      if (MangQuyen[0] != 16) {
                                        handleModalPress1();
                                      } else {
                                        getTrangThaiHienHanh1(TrangThaiSTT);

                                        if (checkedNNHS === true) {
                                          if (
                                            tabledata.MC_TTHC_GV_IDMucDo === 2
                                          ) {
                                            if (diadiem === '') {
                                              handleModalPress4();
                                            } else {
                                              senEmailMD2();
                                            }
                                          } else {
                                            sendEmail(
                                              TEMPLATE_EMAIL_SUBJECT.PENDING,
                                            );
                                            sendEmail1();
                                          }
                                        } else {
                                          if (
                                            tabledata.MC_TTHC_GV_IDMucDo === 2
                                          ) {
                                            if (diadiem === '') {
                                              handleModalPress4();
                                            } else {
                                              senEmailMD2();
                                            }
                                          } else {
                                            sendEmail1();
                                          }
                                        }
                                      }
                                    }
                                  }}>
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    Tiếp nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View
                                style={[styles.buttonHuy, {marginRight: 30}]}>
                                <TouchableOpacity
                                  style={[
                                    styles.touchableOpacity,
                                    {backgroundColor: 'red'},
                                  ]}
                                  onPress={() => {
                                    Huytra();
                                    sendEmail(TEMPLATE_EMAIL_SUBJECT.CANCEL);
                                  }}>
                                  <Text
                                    style={{color: '#ffffff', fontSize: 19}}>
                                    Hủy trả
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : tabledata.MC_TTHC_GV_TrangThai_STT_TPD ===
                          TrangThaiSTT ? (
                          <View style={[styles.noidungtungbuoc, {height: 650}]}>
                            <Text
                              style={[
                                styles.TextBold,
                                {marginTop: 5, textAlign: 'center'},
                              ]}>
                              THÔNG BÁO
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {marginLeft: 15, textAlign: 'left'},
                              ]}>
                              Gửi email:
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginLeft: 15,
                                marginTop: 5,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <CheckBox
                                  value={checkedCBXL}
                                  onValueChange={() => {
                                    setCheckedCBXL(!checkedCBXL);
                                  }}
                                  tintColors={{
                                    true: checkboxColor,
                                    false: checkboxUncheckedColor,
                                  }}
                                />
                                <Text
                                  style={[
                                    styles.TextNormal,
                                    {
                                      alignItems: 'center',
                                      marginTop: 7,
                                      fontSize: 13,
                                    },
                                  ]}>
                                  Cán bộ xử lý
                                </Text>
                              </View>
                            </View>

                            <RadioButton.Group
                              onValueChange={newValue => setChecked(newValue)}
                              value={checked}>
                              {tabledata.MC_TTHC_GV_TrangThai_STT_BGHD ==
                              null ? (
                                <View style={{marginLeft: 5}}>
                                  <View
                                    style={[styles.radioItem, {marginLeft: 5}]}>
                                    <RadioButton
                                      value="0"
                                      color="black"
                                      uncheckedColor="black"
                                    />
                                    <Text style={styles.modalText}>
                                      Phê duyệt
                                    </Text>
                                  </View>
                                  <View
                                    style={[styles.radioItem, {marginLeft: 5}]}>
                                    <RadioButton
                                      value="1"
                                      color="black"
                                      uncheckedColor="black"
                                    />
                                    <Text style={styles.modalText}>
                                      Không phê duyệt
                                    </Text>
                                  </View>
                                </View>
                              ) : (
                                <View style={{marginLeft: 5}}>
                                  <View
                                    style={[styles.radioItem, {marginLeft: 5}]}>
                                    <RadioButton
                                      value="1"
                                      color="black"
                                      uncheckedColor="black"
                                    />
                                    <Text style={styles.modalText}>
                                      Không phê duyệt
                                    </Text>
                                  </View>
                                  <View
                                    style={[styles.radioItem, {marginLeft: 5}]}>
                                    <RadioButton
                                      value="2"
                                      color="black"
                                      uncheckedColor="black"
                                    />
                                    <Text style={styles.modalText}>
                                      Trình duyệt
                                    </Text>
                                  </View>
                                </View>
                              )}
                            </RadioButton.Group>

                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Nội dung:
                            </Text>
                            <TextInput
                              style={{
                                width: '91%',
                                marginLeft: 15,
                                backgroundColor: '#ffffff',
                                marginRight: 15,
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 70,
                              }}
                              value={noidung}
                              onChangeText={text => setnoidung(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Tài liệu kèm theo:
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Links tệp đính kèm:
                            </Text>
                            <TextInput
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 30,
                              }}
                              placeholder="Nhập links tệp đính kèm"
                              value={link}
                              onChangeText={text => setlink(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Hoặc
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm:
                            </Text>
                            <View
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  chooseFile();
                                }}
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  width: '30%',
                                  backgroundColor: '#C0C0C0',
                                  marginLeft: 2,
                                  height: 30,
                                  marginTop: 2,
                                  marginBottom: 2,
                                  justifyContent: 'center',
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
                              <View
                                style={{
                                  width: '69%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <ScrollView nestedScrollEnabled={true}>
                                  <Text
                                    numberOfLines={10}
                                    style={[
                                      styles.TextNormal,
                                      {
                                        marginLeft: 3,
                                        textAlign: 'left',
                                        width: '90%',
                                        marginTop: 16,
                                      },
                                    ]}>
                                    {FileName ? FileName : 'Chưa có tệp'}
                                  </Text>
                                </ScrollView>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm phải có dạng PDF
                            </Text>
                            <Text
                              style={[
                                styles.TextBold,
                                {
                                  textAlign: 'left',
                                  color: 'red',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              (Kích thước tối đa 5 MB)
                            </Text>
                            <View style={styles.viewFooter1}>
                              <View
                                style={[
                                  styles.buttonHuy,
                                  {marginLeft: 30, backgroundColor: '#245d7c'},
                                ]}>
                                <TouchableOpacity
                                  style={styles.touchableOpacity}
                                  onPress={() => {
                                    if (noidung === '') {
                                      handleModalPress();
                                    } else {
                                      if (MangQuyen[0] != 24) {
                                        handleModalPress1();
                                      }
                                      if (checked === '') {
                                        handleModalPress6();
                                      } else {
                                        getTrangThaiHienHanh1(TrangThaiSTT);

                                        if (checkedCBXL === true) {
                                          sendEmail2();
                                        }
                                        if (checked === '2') {
                                          sendEmail3();
                                        }
                                      }
                                    }
                                  }}>
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    Gửi
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : tabledata.MC_TTHC_GV_TrangThai_STT_BGHD ===
                          TrangThaiSTT ? (
                          <View style={[styles.noidungtungbuoc]}>
                            <Text
                              style={[
                                styles.TextBold,
                                {marginTop: 5, textAlign: 'center'},
                              ]}>
                              THÔNG BÁO
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {marginLeft: 15, textAlign: 'left'},
                              ]}>
                              Gửi email:
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginLeft: 15,
                                marginTop: 5,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <CheckBox
                                  value={checkedTPDV}
                                  onValueChange={() => {
                                    setCheckedCBXL(!checkedTPDV);
                                  }}
                                  tintColors={{
                                    true: checkboxColor,
                                    false: checkboxUncheckedColor,
                                  }}
                                />
                                <Text
                                  style={{
                                    alignItems: 'center',
                                    marginTop: 7,
                                    textAlign: 'center',
                                    color: 'black',
                                    fontSize: 13,
                                  }}>
                                  Trưởng/Phó đơn vị
                                </Text>
                              </View>
                            </View>

                            <RadioButton.Group
                              onValueChange={newValue => setChecked1(newValue)}
                              value={checked1}>
                              <View style={{flexDirection: 'row'}}>
                                <View
                                  style={[styles.radioItem, {marginLeft: 15}]}>
                                  <RadioButton
                                    value="0"
                                    color="black"
                                    uncheckedColor="black"
                                  />
                                  <Text style={styles.modalText}>
                                    Phê duyệt
                                  </Text>
                                </View>
                                <View
                                  style={[styles.radioItem, {marginLeft: 50}]}>
                                  <RadioButton
                                    value="1"
                                    color="black"
                                    uncheckedColor="black"
                                  />
                                  <Text style={styles.modalText}>
                                    Không phê duyệt
                                  </Text>
                                </View>
                              </View>
                            </RadioButton.Group>

                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Nội dung:
                            </Text>
                            <TextInput
                              style={{
                                width: '91%',
                                marginLeft: 15,
                                backgroundColor: '#ffffff',
                                marginRight: 15,
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 70,
                              }}
                              value={noidung}
                              onChangeText={text => setnoidung(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Tài liệu kèm theo:
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Links tệp đính kèm:
                            </Text>
                            <TextInput
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 30,
                              }}
                              placeholder="Nhập links tệp đính kèm"
                              value={link}
                              onChangeText={text => setlink(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Hoặc
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm:
                            </Text>
                            <View
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  chooseFile();
                                }}
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  width: '30%',
                                  backgroundColor: '#C0C0C0',
                                  marginLeft: 2,
                                  height: 30,
                                  marginTop: 2,
                                  marginBottom: 2,
                                  justifyContent: 'center',
                                }}>
                                <Text
                                  style={{
                                    color: 'black',
                                    fontSize: 16,
                                    textAlign: 'center',
                                    marginTop: 16,
                                  }}>
                                  Chọn tệp
                                </Text>
                              </TouchableOpacity>
                              <View
                                style={{
                                  width: '69%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <ScrollView nestedScrollEnabled={true}>
                                  <Text
                                    numberOfLines={10}
                                    style={[
                                      styles.TextNormal,
                                      {
                                        marginLeft: 3,
                                        textAlign: 'left',
                                        width: '90%',
                                        marginTop: 16,
                                      },
                                    ]}>
                                    {FileName ? FileName : 'Chưa có tệp'}
                                  </Text>
                                </ScrollView>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm phải có dạng PDF
                            </Text>
                            <Text
                              style={[
                                styles.TextBold,
                                {
                                  textAlign: 'left',
                                  color: 'red',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              (Kích thước tối đa 5 MB)
                            </Text>
                            <View style={styles.viewFooter1}>
                              <View
                                style={[
                                  styles.buttonHuy,
                                  {marginLeft: 30, backgroundColor: '#245d7c'},
                                ]}>
                                <TouchableOpacity
                                  style={styles.touchableOpacity}
                                  onPress={() => {
                                    if (noidung === '') {
                                      handleModalPress();
                                    } else {
                                      if (MangQuyen[0] != 25) {
                                        handleModalPress1();
                                      } else {
                                        getTrangThaiHienHanh1(TrangThaiSTT);

                                        //  getDataHoSo(idThuTuc);
                                        if (checkedTPDV === true) {
                                          sendEmail1();
                                        }
                                      }
                                    }
                                  }}>
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    Gửi
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : tabledata.MC_TTHC_GV_TrangThai_STTMAX ===
                          TrangThaiSTT ? (
                          <View style={[styles.noidungtungbuoc]}>
                            <Text
                              style={[
                                styles.TextBold,
                                {marginTop: 5, textAlign: 'center'},
                              ]}>
                              THÔNG BÁO
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {marginLeft: 15, textAlign: 'left'},
                              ]}>
                              Gửi email:
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginLeft: 15,
                                marginTop: 5,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <CheckBox
                                  value={checkedNNHS}
                                  tintColors={{
                                    true: checkboxColor,
                                    false: checkboxUncheckedColor,
                                  }}
                                />
                                <Text
                                  style={[
                                    styles.TextNormal,
                                    {
                                      alignItems: 'center',
                                      marginTop: 7,
                                      fontSize: 13,
                                    },
                                  ]}>
                                  Người nộp hồ sơ
                                </Text>
                              </View>
                            </View>
                            {tabledata.MC_TTHC_GV_IDMucDo === 2 ||
                            tabledata.MC_TTHC_GV_IDMucDo === 3 ? (
                              <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: 10, marginLeft: 15}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Ngày giờ hẹn trả
                                  </Text>
                                  <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                      onPress={handlePress}
                                      style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        width: '65%',
                                        borderRadius: 5,
                                      }}>
                                      <DatePicker
                                        modal
                                        mode="datetime"
                                        open={open}
                                        date={ngaygui}
                                        onConfirm={ngaygui => {
                                          setopen(false);
                                          setngaygui(ngaygui);
                                        }}
                                        onCancel={() => {
                                          setopen(false);
                                        }}
                                      />
                                      <TextInput
                                        readOnly={true}
                                        style={{
                                          height: 30,
                                          width: '80%',
                                          backgroundColor: '#ffffff',
                                        }}
                                        value={ngaygui
                                          .toLocaleDateString('vi-VN')
                                          .toString()}
                                      />

                                      <Image
                                        source={require('../../../../../images/calendar.png')}
                                        style={{
                                          width: 25,
                                          height: 25,
                                          marginTop: 2.5,
                                          marginLeft: -3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{marginTop: 10, marginLeft: -30}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Địa điểm hẹn trả
                                    <Text style={{color: 'red'}}>(*)</Text>
                                  </Text>
                                  <TextInput
                                    style={{
                                      height: 20,
                                      width: 120,
                                      fontSize: 18,

                                      borderColor: 'black',
                                      borderWidth: 0.5,
                                      padding: 5,
                                      borderRadius: 5,
                                      borderTopLeftRadius: 5,
                                      borderTopRightRadius: 5,
                                      color: 'black',
                                      backgroundColor: '#ffffff',
                                      backgroundColor: '#ffffff',
                                    }}
                                    onChangeText={text => setdiadiem(text)}
                                    value={diadiem}
                                    multiline={true}
                                    numberOfLines={4}
                                    underlineColor="transparent"
                                  />
                                </View>
                              </View>
                            ) : null}

                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Nội dung:<Text style={{color: 'red'}}>(*)</Text>
                            </Text>
                            <TextInput
                              style={{
                                width: '91%',
                                marginLeft: 15,
                                backgroundColor: '#ffffff',
                                marginRight: 15,
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 70,
                              }}
                              value={noidung}
                              onChangeText={text => setnoidung(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Tài liệu kèm theo:
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Links tệp đính kèm:
                            </Text>
                            <TextInput
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 30,
                              }}
                              placeholder="Nhập links tệp đính kèm"
                              value={link}
                              onChangeText={text => setlink(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Hoặc
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm:
                            </Text>
                            <View
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  chooseFile();
                                }}
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  width: '30%',
                                  backgroundColor: '#C0C0C0',
                                  marginLeft: 2,
                                  height: 30,
                                  marginTop: 2,
                                  marginBottom: 2,
                                  justifyContent: 'center',
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
                              <View
                                style={{
                                  width: '69%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <ScrollView nestedScrollEnabled={true}>
                                  <Text
                                    numberOfLines={10}
                                    style={[
                                      styles.TextNormal,
                                      {
                                        marginLeft: 3,
                                        textAlign: 'left',
                                        width: '90%',
                                        marginTop: 16,
                                      },
                                    ]}>
                                    {FileName ? FileName : 'Chưa có tệp'}
                                  </Text>
                                </ScrollView>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm phải có dạng PDF
                            </Text>
                            <Text
                              style={[
                                styles.TextBold,
                                {
                                  textAlign: 'left',
                                  color: 'red',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              (Kích thước tối đa 5 MB)
                            </Text>
                            <View style={styles.viewFooter}>
                              <View
                                style={[
                                  styles.buttonHuy,
                                  {marginLeft: 30, backgroundColor: '#245d7c'},
                                ]}>
                                <TouchableOpacity
                                  style={styles.touchableOpacity}
                                  onPress={() => {
                                    if (noidung === '') {
                                      handleModalPress();
                                    } else {
                                      if (MangQuyen[0] != 16) {
                                        handleModalPress1();
                                      } else {
                                        getTrangThaiHienHanh1(TrangThaiSTT);

                                        if (checkedNNHS === true) {
                                          if (
                                            tabledata.MC_TTHC_GV_IDMucDo === 2
                                          ) {
                                            if (diadiem === '') {
                                              handleModalPress4();
                                            } else {
                                              senEmailMD2();
                                            }
                                          } else {
                                            sendEmail(
                                              TEMPLATE_EMAIL_SUBJECT.SUCCESS,
                                            );
                                          }
                                        }
                                      }
                                    }

                                    console.log(
                                      ngaygui
                                        .toLocaleDateString('vi-vn')
                                        .toString(),
                                    );
                                  }}>
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    Tiếp nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View
                                style={[styles.buttonHuy, {marginRight: 30}]}>
                                <TouchableOpacity
                                  style={[
                                    styles.touchableOpacity,
                                    {backgroundColor: 'red'},
                                  ]}
                                  onPress={() => {
                                    Huytra();
                                    sendEmail(TEMPLATE_EMAIL_SUBJECT.CANCEL);
                                  }}>
                                  <Text
                                    style={{color: '#ffffff', fontSize: 19}}>
                                    Hủy trả
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : tabledata.MC_TTHC_GV_TrangThai_STTMAX - 1 ===
                          TrangThaiSTT ? (
                          <View style={[styles.noidungtungbuoc]}>
                            <Text
                              style={[
                                styles.TextBold,
                                {marginTop: 5, textAlign: 'center'},
                              ]}>
                              THÔNG BÁO
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {marginLeft: 15, textAlign: 'left'},
                              ]}>
                              Gửi email:
                            </Text>
                            <View
                              style={{
                                flexDirection: 'row',
                                width: '90%',
                                borderWidth: 1,
                                borderRadius: 5,
                                marginLeft: 15,
                                marginTop: 5,
                              }}>
                              <View style={{flexDirection: 'row'}}>
                                <CheckBox
                                  value={checkedNNHS}
                                  tintColors={{
                                    true: checkboxColor,
                                    false: checkboxUncheckedColor,
                                  }}
                                />
                                <Text
                                  style={[
                                    styles.TextNormal,
                                    {
                                      alignItems: 'center',
                                      marginTop: 7,
                                      fontSize: 13,
                                    },
                                  ]}>
                                  Người nộp hồ sơ
                                </Text>
                              </View>
                            </View>
                            {tabledata.MC_TTHC_GV_IDMucDo === 2 ||
                            tabledata.MC_TTHC_GV_IDMucDo === 3 ? (
                              <View style={{flexDirection: 'row'}}>
                                <View style={{marginTop: 10, marginLeft: 15}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Ngày giờ hẹn trả
                                  </Text>
                                  <View style={{flexDirection: 'row'}}>
                                    <TouchableOpacity
                                      onPress={handlePress}
                                      style={{
                                        flexDirection: 'row',
                                        borderWidth: 1,
                                        width: '65%',
                                        borderRadius: 5,
                                      }}>
                                      <DatePicker
                                        modal
                                        mode="datetime"
                                        open={open}
                                        date={ngaygui}
                                        onConfirm={ngaygui => {
                                          setopen(false);
                                          setngaygui(ngaygui);
                                        }}
                                        onCancel={() => {
                                          setopen(false);
                                        }}
                                      />
                                      <TextInput
                                        readOnly={true}
                                        style={{
                                          height: 30,
                                          width: '80%',
                                          backgroundColor: '#ffffff',
                                        }}
                                        value={ngaygui
                                          .toLocaleDateString('vi-VN')
                                          .toString()}
                                      />

                                      <Image
                                        source={require('../../../../../images/calendar.png')}
                                        style={{
                                          width: 25,
                                          height: 25,
                                          marginTop: 2.5,
                                          marginLeft: -3,
                                        }}
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={{marginTop: 10, marginLeft: -30}}>
                                  <Text
                                    style={[
                                      styles.TextNormal,
                                      {textAlign: 'left'},
                                    ]}>
                                    Địa điểm hẹn trả
                                    <Text style={{color: 'red'}}>(*)</Text>
                                  </Text>
                                  <TextInput
                                    style={{
                                      height: 20,
                                      width: 120,
                                      fontSize: 18,

                                      borderColor: 'black',
                                      borderWidth: 0.5,
                                      padding: 5,
                                      borderRadius: 5,
                                      borderTopLeftRadius: 5,
                                      borderTopRightRadius: 5,
                                      color: 'black',
                                      backgroundColor: '#ffffff',
                                      backgroundColor: '#ffffff',
                                    }}
                                    onChangeText={text => setdiadiem(text)}
                                    value={diadiem}
                                    multiline={true}
                                    numberOfLines={4}
                                    underlineColor="transparent"
                                  />
                                </View>
                              </View>
                            ) : null}

                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Nội dung:<Text style={{color: 'red'}}>(*)</Text>
                            </Text>
                            <TextInput
                              style={{
                                width: '91%',
                                marginLeft: 15,
                                backgroundColor: '#ffffff',
                                marginRight: 15,
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 70,
                              }}
                              value={noidung}
                              onChangeText={text => setnoidung(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 15,
                                  marginTop: 5,
                                },
                              ]}>
                              Tài liệu kèm theo:
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Links tệp đính kèm:
                            </Text>
                            <TextInput
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 30,
                              }}
                              placeholder="Nhập links tệp đính kèm"
                              value={link}
                              onChangeText={text => setlink(text)}
                            />
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Hoặc
                            </Text>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm:
                            </Text>
                            <View
                              style={{
                                width: '87%',
                                marginLeft: 30,
                                backgroundColor: '#ffffff',
                                borderWidth: 1,
                                borderRadius: 5,
                                height: 50,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <TouchableOpacity
                                onPress={() => {
                                  chooseFile();
                                }}
                                style={{
                                  borderRadius: 5,
                                  borderWidth: 1,
                                  width: '30%',
                                  backgroundColor: '#C0C0C0',
                                  marginLeft: 2,
                                  height: 30,
                                  marginTop: 2,
                                  marginBottom: 2,
                                  justifyContent: 'center',
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
                              <View
                                style={{
                                  width: '69%',
                                  height: '100%',
                                  justifyContent: 'center',
                                }}>
                                <ScrollView nestedScrollEnabled={true}>
                                  <Text
                                    numberOfLines={10}
                                    style={[
                                      styles.TextNormal,
                                      {
                                        marginLeft: 3,
                                        textAlign: 'left',
                                        width: '90%',
                                        marginTop: 16,
                                      },
                                    ]}>
                                    {FileName ? FileName : 'Chưa có tệp'}
                                  </Text>
                                </ScrollView>
                              </View>
                            </View>
                            <Text
                              style={[
                                styles.TextNormal,
                                {
                                  textAlign: 'left',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              Tệp đính kèm phải có dạng PDF
                            </Text>
                            <Text
                              style={[
                                styles.TextBold,
                                {
                                  textAlign: 'left',
                                  color: 'red',
                                  marginLeft: 30,
                                  marginTop: 1,
                                },
                              ]}>
                              (Kích thước tối đa 5 MB)
                            </Text>
                            <View style={styles.viewFooter}>
                              <View
                                style={[
                                  styles.buttonHuy,
                                  {marginLeft: 30, backgroundColor: '#245d7c'},
                                ]}>
                                <TouchableOpacity
                                  style={styles.touchableOpacity}
                                  onPress={() => {
                                    if (noidung === '') {
                                      handleModalPress();
                                    } else {
                                      if (MangQuyen[0] != 16) {
                                        handleModalPress1();
                                      } else {
                                        if (checkedNNHS === true) {
                                          if (
                                            tabledata.MC_TTHC_GV_IDMucDo === 2
                                          ) {
                                            if (diadiem === '') {
                                              handleModalPress4();
                                            } else {
                                              senEmailMD2();
                                            }
                                          } else {
                                            sendEmail(
                                              TEMPLATE_EMAIL_SUBJECT.SUCCESS,
                                            );
                                          }
                                        }
                                      }
                                    }
                                  }}>
                                  <Text style={{color: 'white', fontSize: 18}}>
                                    Tiếp nhận
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              <View
                                style={[styles.buttonHuy, {marginRight: 30}]}>
                                <TouchableOpacity
                                  style={[
                                    styles.touchableOpacity,
                                    {backgroundColor: 'red'},
                                  ]}
                                  onPress={() => {
                                    Huytra();
                                    sendEmail(TEMPLATE_EMAIL_SUBJECT.CANCEL);
                                  }}>
                                  <Text
                                    style={{color: '#ffffff', fontSize: 19}}>
                                    Hủy trả
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        ) : null}
                      </View>
                    ) : null
                  ) : null}
                </View>
              ))
            : null
          : null}

        <View style={styles.tieudelon}>
          <TouchableOpacity
            onPress={() => {
              setstatus3(!status3);
            }}>
            {status3 ? (
              <Image
                source={require('../../../../../images/minus.png')}
                style={{width: 20, height: 20}}
              />
            ) : (
              <Image
                source={require('../../../../../images/add.png')}
                style={{width: 20, height: 20}}
              />
            )}
          </TouchableOpacity>

          <Text style={[styles.TextBold, {marginLeft: 5, fontSize: 18}]}>
            Quá trình xử lý hồ sơ
          </Text>
        </View>
        <ScrollView horizontal>
          <ScrollView>
            {status3 ? (
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
            ) : null}
            {status3
              ? MangQuyTrinh
                ? MangQuyTrinh.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        Open(item.MC_TTHC_GV_TrangThai_TenTrangThai);
                        //console.log('Mảng chi tiết: ' + chiTietTiepNhanHoSo);
                      }}>
                      <View style={styles.chiTietDanhSachHoSo}>
                        <View style={styles.chiTietViewBuoc}>
                          <Text style={styles.text}>
                            {item.MC_TTHC_GV_TrangThai_STT}
                          </Text>
                        </View>
                        <View style={styles.chiTietViewTenCongViec}>
                          <Text style={styles.text}>
                            {item.MC_TTHC_GV_TrangThai_TenTrangThai}
                          </Text>
                        </View>
                        <View style={styles.chiTietViewNgayXuLy}>
                          <Text style={styles.text}>
                            {item.MC_TTHC_GV_GuiYeuCau_DateEditor
                              ? moment(
                                  item.MC_TTHC_GV_GuiYeuCau_DateEditor,
                                ).format('DD/MM/YYYY HH:mm:ss')
                              : ''}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))
                : null
              : null}
          </ScrollView>
        </ScrollView>

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
                  <View style={styles.danhSachThuTucTieuDe}>
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

                  {chiTietTiepNhanHoSo ? (
                    chiTietTiepNhanHoSo.length !== 0 ? (
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
                    ) : null
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
                </ScrollView>
              </ScrollView>
              <TouchableOpacity style={styles.closeButton} onPress={Close}>
                <Text style={styles.textStyle}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
export default Chitiethosoxuly;
const styles = StyleSheet.create({
  disabled: {
    pointerEvents: 'none',
    opacity: 0.6,
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
    fontSize: 19,
    fontWeight: 'bold',
  },

  text1: {
    color: 'black',
    fontSize: 15,
    textAlign: 'center',
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
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },

  viewChiTietNoiTraKetQua: {
    width: 130,
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
  viewSTT: {
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
    marginLeft: 0,
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
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderRightWidth: 1,
    borderColor: '#ffff',
  },

  viewNoiTraKetQua: {
    width: 130,
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

  textWhite1: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chiTietViewBuoc: {
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },
  text: {
    color: 'black',
    fontSize: 14.5,
  },
  chiTietViewTenCongViec: {
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 0.3,
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
  },
  chiTietViewNgayXuLy: {
    width: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: 'gray',
    backgroundColor: '#f8f8ff',
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
  },
  viewNgayXuLy: {
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopRightRadius: 13,
  },
  textWhite: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  viewTenCongViec: {
    width: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    marginLeft: 1.5,
    marginRight: 1.5,
  },

  viewBuoc: {
    width: 55,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#245d7c',
    borderTopLeftRadius: 13,
  },
  danhSachThuTucTieuDe: {
    flexDirection: 'row',
    height: 35,
    marginBottom: 7,
    marginTop: 8,
  },
  viewFooter: {
    height: '10%',
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    marginLeft: 15,
    marginTop: 20,
  },
  viewFooter1: {
    height: '10%',
    width: '80%',

    alignItems: 'center',

    backgroundColor: '#ffffff',
    marginLeft: 15,
    marginTop: 20,
  },
  touchableOpacity: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    shadowColor: 'black',
  },
  buttonHuy: {
    width: '35%',
    height: 40,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  container: {
    backgroundColor: '#ffffff',
    width: getWidth,
    height: getHeight,
  },

  tieudelon: {
    flexDirection: 'row',
    marginLeft: 10,
    marginTop: 10,
  },
  dropdown: {
    flex: 1,
    marginLeft: 16,
    marginTop: 10,
    height: 30,
    borderColor: 'black',
    borderWidth: 0.8,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  TitleTable: {
    backgroundColor: '#2e6b8b',
    justifyContent: 'center',
    marginLeft: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  tieudebuoc: {
    backgroundColor: '#2e6b8b',

    height: 50,
    marginTop: 10,
    marginLeft: 30,
    width: '70%',
    borderRadius: 40,
    justifyContent: 'center',
    marginBottom: 10,
  },
  ViewNgang: {
    flexDirection: 'row',
    marginLeft: 30,
    marginTop: 10,
    marginRight: 5,
  },
  modalText: {
    fontSize: 16,
    color: 'black',
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  texttieudebuoc: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 17,
    color: 'white',
  },
  tieudebuoc1: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    height: 50,
    marginTop: 10,
    marginLeft: 30,
    width: '70%',
    borderRadius: 40,
    justifyContent: 'center',
    marginBottom: 10,
    borderColor: '#2e6b8b',
  },
  texttieudebuoc1: {
    marginLeft: 20,
    fontWeight: 'bold',
    fontSize: 17,
    color: '#2e6b8b',
  },
  noidungtungbuoc: {
    height: 580,
    borderWidth: 1,
    marginLeft: 15,
    marginRight: 25,
    borderRadius: 20,
    width: 0.84 * getWidth,
  },
  textTieuDe: {
    color: 'black',
    fontSize: 22,
    fontFamily: 'Times New Roman',
    fontWeight: 'bold',
  },
  TextNormal: {
    fontSize: 14.5,
    color: 'black',
    textAlign: 'center',
  },
  TextBold: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdown1: {
    width: '100%',

    height: 20,
    borderColor: 'gray',
    borderWidth: 0.8,
    borderRadius: 5,
    paddingHorizontal: 8,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'gray',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
  },

  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
});
