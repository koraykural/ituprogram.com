import { ApiClass } from '../interfaces';

export interface TableHeader {
  shown: string;
  identifier: keyof ApiClass;
}

export const headers: TableHeader[] = [
  { shown: 'Kod', identifier: 'code' },
  { shown: 'Ders', identifier: 'name' },
  { shown: 'Eğitmen(ler)', identifier: 'lecturer' },
  { shown: 'Gün', identifier: 'days' },
  { shown: 'Saat', identifier: 'hours' },
  { shown: 'Bina', identifier: 'buildings' },
  { shown: 'Kayıtlı', identifier: 'enrolled' },
  { shown: 'Kontenjan', identifier: 'capacity' },
  { shown: 'Bölüm sınırlaması', identifier: 'restricts' },
  { shown: 'CRN', identifier: 'crn' },
];
