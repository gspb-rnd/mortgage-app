import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { MortgageApplication } from '../types/MortgageTypes';
import { createMortgageApplication, updateMortgageApplication, getRequiredFields } from '../services/api';

interface MortgageFormProps {
  initialData?: MortgageApplication;
  applicationId?: string;
  onSave: (application: MortgageApplication) => void;
}

const MortgageForm: React.FC<MortgageFormProps> = ({ initialData, applicationId, onSave }) => {
  const [requiredFields, setRequiredFields] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCoBorrower, setHasCoBorrower] = useState(initialData?.coBorrowerInfo !== undefined);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<MortgageApplication>({
    defaultValues: initialData || {
      loanAmount: 0,
      interestRate: 0,
      loanTerm: 30,
      propertyType: 'Single-family',
      propertyValue: 0,
      borrowerName: '',
      income: 0,
      creditScore: 700,
      employmentStatus: 'Employed',
      downPayment: 0,
      loanType: 'Conventional',
      firstTimeBuyer: true,
      region: '',
      governmentAssistance: false,
      completed: false
    }
  });

  const watchedValues = watch();

  useEffect(() => {
    const fetchRequiredFields = async () => {
      try {
        const fields = await getRequiredFields(watchedValues);
        setRequiredFields(fields);
      } catch (error) {
        console.error('Error fetching required fields:', error);
      }
    };

    const timer = setTimeout(() => {
      fetchRequiredFields();
    }, 500);

    return () => clearTimeout(timer);
  }, [
    watchedValues.loanAmount,
    watchedValues.loanType,
    watchedValues.region,
    watchedValues.firstTimeBuyer
  ]);

  const onSubmit = async (data: MortgageApplication) => {
    setIsSubmitting(true);
    try {
      let savedApplication;
      
      if (applicationId) {
        savedApplication = await updateMortgageApplication(applicationId, data);
      } else {
        savedApplication = await createMortgageApplication(data);
      }
      
      onSave(savedApplication);
    } catch (error) {
      console.error('Error saving mortgage application:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProgress = async () => {
    const data = watchedValues;
    data.completed = false;
    
    try {
      let savedApplication;
      
      if (applicationId) {
        savedApplication = await updateMortgageApplication(applicationId, data);
      } else {
        savedApplication = await createMortgageApplication(data);
      }
      
      onSave(savedApplication);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Mortgage Application</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Loan Details Section */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('loanAmount', { required: 'Loan amount is required', min: { value: 1, message: 'Loan amount must be positive' } })}
                />
                {errors.loanAmount && <p className="mt-1 text-sm text-red-600">{errors.loanAmount.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('interestRate', { 
                    required: 'Interest rate is required',
                    min: { value: 0, message: 'Interest rate must be positive' },
                    max: { value: 100, message: 'Interest rate must be less than 100' }
                  })}
                />
                {errors.interestRate && <p className="mt-1 text-sm text-red-600">{errors.interestRate.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Term (Years)</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('loanTerm', { required: 'Loan term is required' })}
                >
                  <option value={10}>10 years</option>
                  <option value={15}>15 years</option>
                  <option value={20}>20 years</option>
                  <option value={30}>30 years</option>
                </select>
                {errors.loanTerm && <p className="mt-1 text-sm text-red-600">{errors.loanTerm.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Loan Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('loanType', { required: 'Loan type is required' })}
                >
                  <option value="Conventional">Conventional</option>
                  <option value="FHA">FHA</option>
                  <option value="VA">VA</option>
                  <option value="USDA">USDA</option>
                </select>
                {errors.loanType && <p className="mt-1 text-sm text-red-600">{errors.loanType.message}</p>}
              </div>
            </div>
          </div>
          
          {/* Property Details Section */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Property Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Type</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('propertyType', { required: 'Property type is required' })}
                >
                  <option value="Single-family">Single-family</option>
                  <option value="Multi-family">Multi-family</option>
                  <option value="Condo">Condo</option>
                  <option value="Townhouse">Townhouse</option>
                </select>
                {errors.propertyType && <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Property Value ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('propertyValue', { 
                    required: 'Property value is required',
                    min: { value: 1, message: 'Property value must be positive' },
                    validate: value => value >= Number(watchedValues.loanAmount) || 'Property value must be greater than loan amount'
                  })}
                />
                {errors.propertyValue && <p className="mt-1 text-sm text-red-600">{errors.propertyValue.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Down Payment ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('downPayment', { 
                    required: 'Down payment is required',
                    min: { value: 0, message: 'Down payment must be positive' }
                  })}
                />
                {errors.downPayment && <p className="mt-1 text-sm text-red-600">{errors.downPayment.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Region/State</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('region', { required: 'Region is required' })}
                />
                {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region.message}</p>}
              </div>
            </div>
          </div>
          
          {/* Borrower Details Section */}
          <div className="col-span-2">
            <h3 className="text-xl font-semibold mb-4">Borrower Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Borrower Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('borrowerName', { required: 'Borrower name is required' })}
                />
                {errors.borrowerName && <p className="mt-1 text-sm text-red-600">{errors.borrowerName.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Annual Income ($)</label>
                <input
                  type="number"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('income', { 
                    required: 'Income is required',
                    min: { value: 1, message: 'Income must be positive' }
                  })}
                />
                {errors.income && <p className="mt-1 text-sm text-red-600">{errors.income.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Credit Score</label>
                <input
                  type="number"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('creditScore', { 
                    required: 'Credit score is required',
                    min: { value: 300, message: 'Credit score must be at least 300' },
                    max: { value: 850, message: 'Credit score must be at most 850' }
                  })}
                />
                {errors.creditScore && <p className="mt-1 text-sm text-red-600">{errors.creditScore.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  {...register('employmentStatus', { required: 'Employment status is required' })}
                >
                  <option value="Employed">Employed</option>
                  <option value="Self-Employed">Self-Employed</option>
                  <option value="Unemployed">Unemployed</option>
                </select>
                {errors.employmentStatus && <p className="mt-1 text-sm text-red-600">{errors.employmentStatus.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">First-Time Buyer</label>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      value="true"
                      {...register('firstTimeBuyer', { required: 'Please select first-time buyer status' })}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="form-radio"
                      value="false"
                      {...register('firstTimeBuyer', { required: 'Please select first-time buyer status' })}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.firstTimeBuyer && <p className="mt-1 text-sm text-red-600">{errors.firstTimeBuyer.message}</p>}
              </div>
            </div>
          </div>
          
          {/* Co-Borrower Section */}
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-semibold">Co-Borrower Information</h3>
              <div className="ml-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    className="form-checkbox"
                    checked={hasCoBorrower}
                    onChange={(e) => setHasCoBorrower(e.target.checked)}
                  />
                  <span className="ml-2">Include Co-Borrower</span>
                </label>
              </div>
            </div>
            
            {hasCoBorrower && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Co-Borrower Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    {...register('coBorrowerInfo.name', { required: hasCoBorrower ? 'Co-borrower name is required' : false })}
                  />
                  {errors.coBorrowerInfo?.name && <p className="mt-1 text-sm text-red-600">{errors.coBorrowerInfo.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Co-Borrower Annual Income ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    {...register('coBorrowerInfo.income', { 
                      required: hasCoBorrower ? 'Co-borrower income is required' : false,
                      min: hasCoBorrower ? { value: 1, message: 'Co-borrower income must be positive' } : undefined
                    })}
                  />
                  {errors.coBorrowerInfo?.income && <p className="mt-1 text-sm text-red-600">{errors.coBorrowerInfo.income.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Co-Borrower Credit Score</label>
                  <input
                    type="number"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    {...register('coBorrowerInfo.creditScore', { 
                      required: hasCoBorrower ? 'Co-borrower credit score is required' : false,
                      min: hasCoBorrower ? { value: 300, message: 'Co-borrower credit score must be at least 300' } : undefined,
                      max: hasCoBorrower ? { value: 850, message: 'Co-borrower credit score must be at most 850' } : undefined
                    })}
                  />
                  {errors.coBorrowerInfo?.creditScore && <p className="mt-1 text-sm text-red-600">{errors.coBorrowerInfo.creditScore.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Co-Borrower Employment Status</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    {...register('coBorrowerInfo.employmentStatus', { required: hasCoBorrower ? 'Co-borrower employment status is required' : false })}
                  >
                    <option value="Employed">Employed</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Unemployed">Unemployed</option>
                  </select>
                  {errors.coBorrowerInfo?.employmentStatus && <p className="mt-1 text-sm text-red-600">{errors.coBorrowerInfo.employmentStatus.message}</p>}
                </div>
              </div>
            )}
          </div>
          
          {/* Additional Required Fields Section */}
          {requiredFields.includes('governmentAssistance') && (
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-4">Government Assistance</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">Are you using government assistance?</label>
                <div className="mt-1">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      className="form-radio"
                      value="true"
                      {...register('governmentAssistance', { required: 'Please select government assistance status' })}
                    />
                    <span className="ml-2">Yes</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      className="form-radio"
                      value="false"
                      {...register('governmentAssistance', { required: 'Please select government assistance status' })}
                    />
                    <span className="ml-2">No</span>
                  </label>
                </div>
                {errors.governmentAssistance && <p className="mt-1 text-sm text-red-600">{errors.governmentAssistance.message}</p>}
              </div>
            </div>
          )}
          
          {/* Dynamic Required Fields */}
          {requiredFields.includes('californiaDisclosure') && (
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-4">California Disclosure</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  California requires additional disclosure for mortgage applications. By proceeding, you acknowledge that you have received and reviewed the California Mortgage Disclosure document.
                </p>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2 text-sm">I acknowledge receipt of the California Mortgage Disclosure</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {requiredFields.includes('newYorkDisclosure') && (
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-4">New York Disclosure</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  New York requires additional disclosure for mortgage applications. By proceeding, you acknowledge that you have received and reviewed the New York Mortgage Disclosure document.
                </p>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2 text-sm">I acknowledge receipt of the New York Mortgage Disclosure</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {requiredFields.includes('jumboLoanDisclosure') && (
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-4">Jumbo Loan Disclosure</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Your loan amount exceeds the conventional loan limit and is considered a jumbo loan. Jumbo loans may have different requirements and interest rates. By proceeding, you acknowledge that you understand the implications of a jumbo loan.
                </p>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2 text-sm">I understand that I am applying for a jumbo loan</span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {requiredFields.includes('firstTimeBuyerCertification') && (
            <div className="col-span-2">
              <h3 className="text-xl font-semibold mb-4">First-Time Buyer Certification</h3>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  As a first-time homebuyer, you may be eligible for special programs and assistance. By proceeding, you certify that you have not owned a home in the past three years.
                </p>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2 text-sm">I certify that I am a first-time homebuyer</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-between pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleSaveProgress}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Save Progress
          </button>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MortgageForm;
