export const CAR_MODELS = [
  // Suzuki
  'Suzuki Alto',
  'Suzuki Cultus',
  'Suzuki Wagon R',
  'Suzuki Swift',
  'Suzuki Ciaz',
  'Suzuki Bolan',
  'Suzuki Every',
  // Honda
  'Honda City',
  'Honda Civic',
  'Honda HR-V',
  'Honda BR-V',
  // Toyota
  'Toyota Corolla',
  'Toyota Yaris',
  'Toyota Fortuner',
  'Toyota Hilux',
  'Toyota Hiace',
  // Hyundai
  'Hyundai Tucson',
  'Hyundai Elantra',
  'Hyundai Sonata',
  // Kia
  'Kia Sportage',
  'Kia Stonic',
  'Kia Picanto',
  // MG
  'MG HS',
  'MG ZS',
  // DFSK
  'DFSK Glory 580',
  'DFSK Glory 500',
  // Prince / FAW
  'Prince Pearl',
  'FAW V2',
  'FAW Carrier',
  // Changan
  'Changan Alsvin',
  'Changan Oshan X7',
  // Free text fallback
  'Other',
] as const;

export type CarModel = (typeof CAR_MODELS)[number];
