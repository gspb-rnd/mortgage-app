import axios from 'axios';
import { MortgageApplication, RequiredFieldsResponse } from '../types/MortgageTypes';

const API_URL = 'http://localhost:8080/api';

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
