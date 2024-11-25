export interface LabTest {
  testCode: string;
  testName: string;
  result: number | string;
  unit: string;
  refRangeLow?: string;
  refRangeHigh?: string;
  collectionDate: string;
  collectionTime: string;
  note?: string;
  nonSpecRefs?: string;
  patientInfo: {
    id: string;
    name: string;
    dob: string;
    gender: string;
  };
}

export interface PatientResult {
  testName: string;
  value: number;
  date: string;
  refRangeLow?: number;
  refRangeHigh?: number;
}
