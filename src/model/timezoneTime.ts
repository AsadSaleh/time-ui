export interface TimezoneTime {
  abbreviation: string;
  client_ip: string;
  datetime: Date | string;
  day_of_week: number;
  day_of_year: number;
  dst: boolean;
  dst_from: null;
  dst_offset: number;
  dst_until: null;
  raw_offset: number;
  timezone: string;
  unixtime: number;
  utc_datetime: Date | string;
  utc_offset: string;
  week_number: number;
}
