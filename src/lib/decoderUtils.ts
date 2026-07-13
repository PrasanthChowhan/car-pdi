// Indian Automotive VIN and Tyre DOT Decoder Utilities

export interface VINDecodeResult {
  vin: string;
  isValid: boolean;
  manufacturer: string;
  country: string;
  year: number | null;
  message: string;
}

export interface TyreDOTDecodeResult {
  dotCode: string;
  isValid: boolean;
  week: number | null;
  year: number | null;
  ageMonths: number | null;
  status: 'fresh' | 'caution' | 'flagged';
  message: string;
}

// Global VIN Year map (10th character)
const VIN_YEAR_MAP: Record<string, number> = {
  A: 2010, B: 2011, C: 2012, D: 2013, E: 2014, F: 2015, G: 2016, H: 2017,
  J: 2018, K: 2019, L: 2020, M: 2021, N: 2022, P: 2023, R: 2024, S: 2025,
  T: 2026, V: 2027, W: 2028, X: 2029, Y: 2030,
  '1': 2031, '2': 2032, '3': 2033, '4': 2034, '5': 2035, '6': 2036
};


/**
 * Decodes an Indian Vehicle Identification Number (chassis number)
 */
export function decodeIndianVIN(rawVin: string): VINDecodeResult {
  const vin = rawVin.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  const result: VINDecodeResult = {
    vin,
    isValid: false,
    manufacturer: 'Unknown Manufacturer',
    country: 'Unknown',
    year: null,
    message: 'VIN must be 17 or 19 characters long.'
  };

  if (vin.length !== 17 && vin.length !== 19) {
    return result;
  }

  result.isValid = true;

  // 1. Identify Brand & Country from WMI (first 3 chars)
  const wmi = vin.substring(0, 3);
  let brand = 'Other';
  let country = 'Unknown';

  if (wmi.startsWith('MA3')) {
    brand = 'Maruti Suzuki';
    country = 'India';
  } else if (wmi.startsWith('MAL')) {
    brand = 'Hyundai';
    country = 'India';
  } else if (wmi.startsWith('MAT') || wmi.startsWith('MBL')) {
    brand = 'Tata Motors';
    country = 'India';
  } else if (wmi.startsWith('MA1')) {
    brand = 'Mahindra & Mahindra';
    country = 'India';
  } else if (wmi.startsWith('ME3') || wmi.startsWith('MAK')) {
    brand = 'Honda';
    country = 'India';
  } else if (wmi.startsWith('MZ2') || wmi.startsWith('MZ3')) {
    brand = 'Kia';
    country = 'India';
  } else if (wmi.startsWith('MB1')) {
    brand = 'Skoda / Volkswagen';
    country = 'India';
  } else if (wmi.startsWith('MB8')) {
    brand = 'Toyota';
    country = 'India';
  } else if (wmi.startsWith('PL1') || wmi.startsWith('PL2')) {
    brand = 'VinFast';
    country = 'Vietnam';
  } else {
    // Basic country codes fallback
    const firstChar = vin.charAt(0);
    if (firstChar >= 'A' && firstChar <= 'H') country = 'Africa / UK';
    else if (firstChar >= 'J' && firstChar <= 'R') {
      if (vin.substring(0, 2) >= 'MA' && vin.substring(0, 2) <= 'ME') {
        country = 'India';
      } else if (firstChar === 'J') {
        country = 'Japan';
      } else if (firstChar === 'K') {
        country = 'South Korea';
      } else {
        country = 'Asia';
      }
    } else if (firstChar >= 'S' && firstChar <= 'Z') country = 'Europe';
    else if (firstChar >= '1' && firstChar <= '5') country = 'North America';
    else if (firstChar === '6' || firstChar === '7') country = 'Oceania';
    else if (firstChar === '8' || firstChar === '9') country = 'South America';
  }

  result.manufacturer = brand === 'Other' ? `Generic (${wmi})` : brand;
  result.country = country;

  // 2. Decode Year (10th character is Model Year globally)
  const yearChar = vin.charAt(9);
  let decodedYear = VIN_YEAR_MAP[yearChar] || null;

  // Skoda / Volkswagen India specific year check (can override 10th char with 5th/6th digits)
  if (brand === 'Skoda / Volkswagen') {
    const yearDigits = vin.substring(4, 6);
    if (/^\d{2}$/.test(yearDigits)) {
      decodedYear = 2000 + parseInt(yearDigits, 10);
    }
  }

  result.year = decodedYear;

  if (result.year) {
    result.message = `Model Year: ${result.year}. Check the B-pillar compliance plate for exact manufacturing month.`;
  } else {
    result.message = `VIN decoded from country: ${result.country}. Year codes could not be automatically determined.`;
  }

  return result;
}

/**
 * Decodes a 4-digit Tyre DOT manufacturing code (WWYY)
 */
export function decodeTyreDOT(rawDot: string): TyreDOTDecodeResult {
  const dotCode = rawDot.trim().replace(/[^0-9]/g, '');

  const result: TyreDOTDecodeResult = {
    dotCode,
    isValid: false,
    week: null,
    year: null,
    ageMonths: null,
    status: 'flagged',
    message: 'Tyre DOT code must be exactly 4 digits.'
  };

  if (dotCode.length !== 4) {
    return result;
  }

  const week = parseInt(dotCode.substring(0, 2), 10);
  const yearDigits = parseInt(dotCode.substring(2, 4), 10);

  if (week < 1 || week > 52) {
    result.message = 'Invalid week code. Must be between 01 and 52.';
    return result;
  }

  const year = 2000 + yearDigits;
  result.week = week;
  result.year = year;
  result.isValid = true;

  // Approximate tyre month (4.33 weeks per month)
  const monthNum = Math.ceil(week / 4.33);
  
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-indexed

  const age = (currentYear - year) * 12 + (currentMonth - monthNum);
  result.ageMonths = age;

  if (age < 0) {
    result.status = 'flagged';
    result.message = `Future tyre manufacture date decoded (Week ${week}, ${year}). Check DOT input.`;
  } else if (age <= 6) {
    result.status = 'fresh';
    result.message = `Tyre is fresh (${age} month${age === 1 ? '' : 's'} old). Approved for delivery.`;
  } else if (age <= 12) {
    result.status = 'caution';
    result.message = `⚠️ Caution: Tyre is ${age} months old. Yard exposure may have aged the rubber. Check for cracks.`;
  } else {
    result.status = 'flagged';
    result.message = `🚨 Flagged: Tyre is extremely old (${age} months old). Rubber degradation risk! Demand replacement tyres.`;
  }

  return result;
}
