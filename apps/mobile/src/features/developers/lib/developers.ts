import type { ImageSourcePropType } from 'react-native';

export type Developer = {
  nama_peneliti: string;
  nomor_induk: {
    jenis: 'NIDN' | 'NIP';
    nomor: string;
  };
  instansi: string;
  institutionLogo?: ImageSourcePropType;
  photo: ImageSourcePropType;
};

const logoPkManado = require('../../../../assets/instance/logo_pk_manado.png');
const logoPkBandung = require('../../../../assets/instance/logo_pk_bandung.png');

export const developers: Developer[] = [
  {
    nama_peneliti: 'Yulien Adam, SST., M.Kes.',
    nomor_induk: { jenis: 'NIDN', nomor: '4025077301' },
    instansi: 'Poltekkes Kemenkes Manado',
    institutionLogo: logoPkManado,
    photo: require('../../../../assets/developers/yulien_adam.png'),
  },
  {
    nama_peneliti: 'Dian Pratiwi, S.S.T., M.Keb.',
    nomor_induk: { jenis: 'NIDN', nomor: '4004059101' },
    instansi: 'Poltekkes Kemenkes Manado',
    institutionLogo: logoPkManado,
    photo: require('../../../../assets/developers/dian_pratiwi.png'),
  },
  {
    nama_peneliti: 'Bayu Irianti, S.ST, M.Keb.',
    nomor_induk: { jenis: 'NIDN', nomor: '0426028703' },
    instansi: 'Poltekkes Kemenkes Bandung',
    institutionLogo: logoPkBandung,
    photo: require('../../../../assets/developers/bayu_irianti.png'),
  },
  {
    nama_peneliti: 'Senny Rondonuwu, M.Keb.',
    nomor_induk: { jenis: 'NIP', nomor: '197912032002122001' },
    instansi: 'Poltekkes Kemenkes Manado',
    institutionLogo: logoPkManado,
    photo: require('../../../../assets/developers/senny_rondonuwu.png'),
  },
];
