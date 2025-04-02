import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MortgageForm from '../components/MortgageForm';
import { MortgageApplication } from '../types/MortgageTypes';
import { getMortgageApplication } from '../services/api';

const MortgageApplicationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<MortgageApplication | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(!!id);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplication = async () => {
      if (id) {
        try {
          setLoading(true);
          const data = await getMortgageApplication(id);
          setApplication(data);
          setError(null);
        } catch (err) {
          console.error('Error fetching application:', err);
          setError('Failed to load mortgage application. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplication();
  }, [id]);

  const handleSave = (savedApplication: MortgageApplication) => {
    setApplication(savedApplication);
    
    if (!id && savedApplication.id) {
      navigate(`/application/${savedApplication.id}`);
    }
    
    alert(savedApplication.completed 
      ? 'Your mortgage application has been submitted successfully!' 
      : 'Your progress has been saved. You can return to complete your application later.');
    
    if (savedApplication.completed) {
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {id ? 'Edit Mortgage Application' : 'New Mortgage Application'}
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      ) : (
        <MortgageForm 
          initialData={application} 
          applicationId={id} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default MortgageApplicationPage;
