import {maSinhVien} from '../../components/DangNhap/dangNhap';
import axios from 'axios';
import {token} from '../../components/DangNhap/dangNhap';
import {maGiangVien} from '../../components/DangNhap/dangNhap';
import {matkhau} from '../../components/DangNhap/dangNhap';
var api = 'https://apiv2.uneti.edu.vn/api/SP_HT_USER_GIANGVIEN/Load_MaND_HRM';
const ThongTinGiangVien = {
  IDSinhVien: '',
  IDNhanSu: '',
  MaNhanSu: '',
  SoThuTu: '',
  HoDem: '',
  Ten: '',
  NgaySinh: '',
  NoiSinh: '',
  GioiTinh: '',
  NguyenQuan: '',
  HoKhau: '',
  NoiOHienTai: '',
  SoCMND: '',
  NgayCapCMND: '',
  NoiCapCMND: '',
  SoDienThoai: '',
  SoDiDong: '',
  Email: '',
  ATM1: '',
  ATM2: '',
  GiaoVien: '',
  DanToc: '',
  TonGiao: '',
  HienTaiDonVi: '',
  HienTaiChucVu: '',
  HienTaiPhongBan: '',
  HienTaiChucVuTuNgay: '',
  HienTaiChucVuDenNgay: '',
  ChuyenMon: '',
  HocVan: '',
  HocHam: '',
  HocHamNamPhong: '',
  HocVi: '',
  HocViNamHoc: '',
  HocViNamBaoVe: '',
  HocViNoiHoc: '',
  NgoaiNgu1: '',
  NgoaiNgu2: '',
  TrinhDoNgoaiNgu1: '',
  TrinhDoNgoaiNgu2: '',
  TrinhDoChinhTri: '',
  TrinhDoQuanLyNhaNuoc: '',
  TrinhDoQuanLyGiaoDuc: '',
  DangVienNgayVao: '',
  DangVienChinhThuc: '',
  DangVienChucVu: '',
  MaSoThue: '',
  LoaiTaiKhoan: '',
  Role: '',
  HT_GROUPUSER_ID: [],
  EmailUneti: '',
};

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
        `Attempt ${attempt} failed. Retrying in ${delay / 1000} seconds...`,
      );
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= backoff;
      attempt++;
    }
  }
};

const getThongTinhGiangVien = async () => {
  const response = await axios.post(
    api,
    {
      HT_USER_TenDN: maGiangVien,
      HT_USER_MK: matkhau,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );

  if (
    response.status != 400 &&
    response.data &&
    response.data.body &&
    response.data.body.length > 0
  ) {
    response.data.body.map(function (td) {
      ThongTinGiangVien.IDSinhVien = td.IdSinhVien;
      ThongTinGiangVien.IDNhanSu = td.IDNhanSu;
      ThongTinGiangVien.MaNhanSu = td.MaNhanSu;
      ThongTinGiangVien.SoThuTu = td.SoThuTu;
      ThongTinGiangVien.HoDem = td.HoDem;
      ThongTinGiangVien.Ten = td.Ten;
      ThongTinGiangVien.NgaySinh = td.NgaySinh;
      ThongTinGiangVien.NoiSinh = td.NoiSinh;
      ThongTinGiangVien.GioiTinh = td.GioiTinh;
      ThongTinGiangVien.NguyenQuan = td.NguyenQuan;
      ThongTinGiangVien.HoKhau = td.HoKhau;
      ThongTinGiangVien.NoiOHienTai = td.NoiOHienTai;
      ThongTinGiangVien.SoCMND = td.SoCMND;
      ThongTinGiangVien.NgayCapCMND = td.NgayCapCMND;
      ThongTinGiangVien.NoiCapCMND = td.NoiCapCMND;
      ThongTinGiangVien.SoDienThoai = td.SoDienThoai;
      ThongTinGiangVien.SoDiDong = td.SoDiDong;
      ThongTinGiangVien.Email = td.Email;
      ThongTinGiangVien.ATM1 = td.ATM1;
      ThongTinGiangVien.ATM2 = td.ATM2;
      ThongTinGiangVien.GiaoVien = td.GiaoVien;
      ThongTinGiangVien.DanToc = td.DanToc;
      ThongTinGiangVien.TonGiao = td.TonGiao;
      ThongTinGiangVien.HienTaiDonVi = td.HienTaiDonVi;
      ThongTinGiangVien.HienTaiChucVu = td.HienTaiChucVu;
      ThongTinGiangVien.HienTaiPhongBan = td.HienTaiPhongBan;
      ThongTinGiangVien.HienTaiChucVuTuNgay = td.HienTaiChucVuTuNgay;
      ThongTinGiangVien.HienTaiChucVuDenNgay = td.HienTaiChucVuDenNgay;
      ThongTinGiangVien.ChuyenMon = td.ChuyenMon;
      ThongTinGiangVien.HocVan = td.HocVan;
      ThongTinGiangVien.HocHam = td.HocHam;
      ThongTinGiangVien.HocHamNamPhong = td.HocHamNamPhong;
      ThongTinGiangVien.HocVi = td.HocVi;
      ThongTinGiangVien.HocViNamHoc = td.HocViNamHoc;
      ThongTinGiangVien.HocViNamBaoVe = td.HocViNamBaoVe;
      ThongTinGiangVien.HocViNoiHoc = td.HocViNoiHoc;
      ThongTinGiangVien.NgoaiNgu1 = td.NgoaiNgu1;
      ThongTinGiangVien.NgoaiNgu2 = td.NgoaiNgu2;
      ThongTinGiangVien.TrinhDoNgoaiNgu1 = td.TrinhDoNgoaiNgu1;
      ThongTinGiangVien.TrinhDoNgoaiNgu2 = td.TrinhDoNgoaiNgu2;
      ThongTinGiangVien.TrinhDoChinhTri = td.TrinhDoChinhTri;
      ThongTinGiangVien.TrinhDoQuanLyNhaNuoc = td.TrinhDoQuanLyNhaNuoc;
      ThongTinGiangVien.TrinhDoQuanLyGiaoDuc = td.TrinhDoQuanLyGiaoDuc;
      ThongTinGiangVien.DangVienNgayVao = td.DangVienNgayVao;
      ThongTinGiangVien.DangVienChinhThuc = td.DangVienChinhThuc;
      ThongTinGiangVien.DangVienChucVu = td.DangVienChucVu;
      ThongTinGiangVien.MaSoThue = td.MaSoThue;
      ThongTinGiangVien.LoaiTaiKhoan = td.LoaiTaiKhoan;
      ThongTinGiangVien.Role = td.Role;
      ThongTinGiangVien.HT_GROUPUSER_ID = td.HT_GROUPUSER_ID;
      ThongTinGiangVien.EmailUneti = td.EmailUneti;
    });

    return ThongTinGiangVien;
  }
  try {
  } catch (error) {
    console.error('Get thong tin giang vien', error);
    return {};
  }
};

export {getThongTinhGiangVien, ThongTinGiangVien};
