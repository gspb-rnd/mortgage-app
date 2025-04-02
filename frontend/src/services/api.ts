import axios from 'axios';
import { MortgageApplication, RequiredFieldsResponse } from '../types/MortgageTypes';

const API_URL = 'https://user:38e5708e6054f85e48a55636a6614031@mortgage-app-website-tunnel-6ora91nu.devinapps.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createMortgageApplication = async (application: MortgageApplication): Promise<MortgageApplication> => {
  const response = await api.post<MortgageApplication>('/mortgage/create', application);
  return response.data;
};

export const getMortgageApplication = async (id: string): Promise<MortgageApplication> => {
  const response = await api.get<MortgageApplication>(`/mortgage/${id}`);
  return response.data;
};

export const updateMortgageApplication = async (id: string, application: Partial<MortgageApplication>): Promise<MortgageApplication> => {
  const response = await api.put<MortgageApplication>(`/mortgage/update/${id}`, application);
  return response.data;
};

export const getRequiredFields = async (application: Partial<MortgageApplication>): Promise<string[]> => {
  const response = await api.post<RequiredFieldsResponse>('/mortgage/requirements', application);
  return response.data.requiredFields;
};
