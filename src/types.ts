export type VoiceName = 'Zephyr' | 'Kore' | 'Puck' | 'Charon' | 'Fenrir';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export type LanguageCode = 'en' | 'fr' | 'es' | 'ar' | 'pcm' | 'kri' | 'men' | 'tem' | 'lym' | 'kno';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  locale: string; // for web speech synthesis
  promptContext: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  emailAddress: string;
  date: string;
  time: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  remarks?: string;
  createdAt: Date;
  emailSent?: boolean;
}

export interface TranscriptItem {
  id: string;
  sender: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface VoiceOption {
  id: VoiceName;
  name: string;
  gender: string;
  description: string;
  emoji: string;
}

export const VOICES: VoiceOption[] = [
  { id: 'Zephyr', name: 'Zephyr', gender: 'Neutral (Alto)', description: 'Warm, cozy and deeply soothing tone, highly responsive.', emoji: '🍃' },
  { id: 'Kore', name: 'Kore', gender: 'Female (Mezzo)', description: 'Calm, clear and direct, ideal for professional queries.', emoji: '✨' },
  { id: 'Puck', name: 'Puck', gender: 'Male (Tenor)', description: 'Bright, energetic, bubbly and full of friendly cheer.', emoji: '🌞' },
  { id: 'Charon', name: 'Charon', gender: 'Male (Bass)', description: 'Deep, resonant, sincere, and slow-paced style.', emoji: '🌊' },
  { id: 'Fenrir', name: 'Fenrir', gender: 'Female (Soprano)', description: 'Rich, narrative prose with captivating style.', emoji: '🔮' },
];

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (Primary)',
    flag: '🇺🇸',
    locale: 'en-US',
    promptContext: 'Please communicate primarily in English. Maintain a highly professional and welcoming tone suitable for business appointments and scheduling inquiries.'
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    locale: 'fr-FR',
    promptContext: 'S\'il vous plaît, communiquez en français. Maintenez un ton poli, professionnel et accueillant adapté au service client d\'une entreprise française.'
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    locale: 'es-ES',
    promptContext: 'Por favor, comunícate en español. Mantén un tono formal, cálido y profesional ideal para la atención al cliente y reserva de citas.'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    locale: 'ar-SA',
    promptContext: 'يرجى التحدث باللغة العربية. حافظ على أسلوب لبق ومحترف ومرحب ومناسب لخدمة العملاء وحجز المواعيد.'
  },
  {
    code: 'pcm',
    name: 'Nigerian Pidgin',
    nativeName: 'Naija Pidgin',
    flag: '🇳🇬',
    locale: 'en-NG', // closest web synthesize voice
    promptContext: 'Abeg speak Nigerian Pidgin language. Make your voice dey friendly, warm, and highly professional like business customer service. Talk am well and naturally.'
  },
  {
    code: 'kri',
    name: 'Krio',
    nativeName: 'Sierra Leone Krio',
    flag: '🇸🇱',
    locale: 'en-GB', // closest web synthesize voice fallback
    promptContext: 'Do ya talk Sierra Leone Krio language. Make the voice sweet, respectful, and professional like customer service wey de help business book appointment fine fine.'
  },
  {
    code: 'men',
    name: 'Mende',
    nativeName: 'Mɛnde yia',
    flag: '🇸🇱',
    locale: 'en-GB',
    promptContext: 'Please communicate or translate from Mende (Mɛnde yia). Use traditional Mende warm greetings like "Bua" (Hello) or "Bi bɛi bɛi?" (How are you?), and translate user requests to English to log booking actions automatically.'
  },
  {
    code: 'tem',
    name: 'Temne',
    nativeName: 'Kʌthemnɛ',
    flag: '🇸🇱',
    locale: 'en-GB',
    promptContext: 'Please communicate or translate from Temne (Kʌthemnɛ). Use traditional Temne warm greetings like "Sekɛ" (Hello) or "Kɔ raye?" (How are you?), and translate user requests to English to log booking details.'
  },
  {
    code: 'lym',
    name: 'Limba',
    nativeName: 'Yalunka / Limba',
    flag: '🇸🇱',
    locale: 'en-GB',
    promptContext: 'Please communicate or translate from Limba. Use warm Limba greetings like "Malaŋ" (Hello) or "Aw bɛh?" (How are you?), and translate user requests to English to schedule dates.'
  },
  {
    code: 'kno',
    name: 'Kono',
    nativeName: 'Kɔnɔ yia',
    flag: '🇸🇱',
    locale: 'en-GB',
    promptContext: 'Please communicate or translate from Kono. Use warm Kono greetings like "Ah bɛɛ bɛi?" (Hello/How are you?) to assist the user, and translate requests into English.'
  }
];

