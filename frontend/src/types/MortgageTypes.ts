export interface MortgageApplication {
  id?: string;
  loanAmount: number;
  interestRate: number;
  loanTerm: number;
  propertyType: string;
  propertyValue: number;
  borrowerName: string;
  income: number;
  creditScore: number;
  employmentStatus: string;
  downPayment: number;
  loanType: string;
  firstTimeBuyer: boolean;
  coBorrowerInfo?: CoBorrowerInfo;
  region: string;
  governmentAssistance?: boolean;
  createdAt?: string;
  updatedAt?: string;
  completed?: boolean;
  requiredFields?: string[];
}

export interface CoBorrowerInfo {
  name: string;
  income: number;
  creditScore: number;
  employmentStatus: string;
}

export interface RequiredFieldsResponse {
  requiredFields: string[];
}

export type PropertyType = 'Single-family' | 'Multi-family' | 'Condo' | 'Townhouse';
export type LoanTerm = 10 | 15 | 20 | 30;
export type EmploymentStatus = 'Employed' | 'Self-Employed' | 'Unemployed';
export type LoanType = 'Conventional' | 'FHA' | 'VA' | 'USDA';
