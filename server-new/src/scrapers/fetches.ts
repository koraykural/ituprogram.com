import axios, { AxiosRequestConfig } from 'axios';
import { decode } from 'iconv-lite';

const fetch = async (request: AxiosRequestConfig, isWin1254Encoding = false): Promise<string> => {
  let tryCount = 0;
  while (tryCount < 3) {
    try {
      const response = await axios.request({
        ...request,
        ...(isWin1254Encoding ? { responseType: 'arraybuffer' } : {}),
      });
      if (isWin1254Encoding) {
        return decode(response.data, 'win1254');
      } else {
        return response.data;
      }
    } catch (error) {
      await new Promise((r) => setTimeout(r, 200)); // Sleep
      tryCount++;
    }
  }
  return '';
};

export const fetchDersProgrami = async (level: 'LS', code: string): Promise<string> => {
  return fetch(
    {
      method: 'POST',
      url: 'https://www.sis.itu.edu.tr/TR/ogrenci/ders-programi/ders-programi.php?seviye=LS',
      data: `seviye=${level}&derskodu=${code}&B1=Göster`,
    },
    true,
  );
};

export const fetchDersPlanlari1 = async (facultyAbbrv: string): Promise<string> => {
  return fetch(
    {
      method: 'GET',
      url: `https://www.sis.itu.edu.tr/TR/ogrenci/lisans/ders-planlari/ders-planlari.php?fakulte=${facultyAbbrv}`,
    },
    false,
  );
};

export const fetchDersPlanlari2 = async (departmentAbbrv: string): Promise<string> => {
  return fetch(
    {
      method: 'GET',
      url: `https://www.sis.itu.edu.tr/TR/ogrenci/lisans/ders-planlari/plan/${departmentAbbrv}/`,
    },
    true,
  );
};

export const fetchDersPlani = async (
  departmentAbbrv: string,
  termLink: string,
): Promise<string> => {
  return fetch(
    {
      method: 'GET',
      url: `https://www.sis.itu.edu.tr/TR/ogrenci/lisans/ders-planlari/plan/${departmentAbbrv}/${termLink}`,
    },
    true,
  );
};

export const fetchDersBilgileri = async (code: string): Promise<string> => {
  const [subj, numb] = code.trim().split(' ');
  return fetch({
    method: 'POST',
    url: 'https://www.sis.itu.edu.tr/TR/ogrenci/lisans/ders-bilgileri/ders-bilgileri.php',
    data: `subj=${subj}&numb=${numb}`,
  });
};
