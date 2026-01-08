// Currency configuration system

export interface CurrencyConfig {
  code: 'BGN' | 'EUR';
  symbol: string;
  name: string;
  flag: string;
  denominations: number[];
  imageKeys: string[];
}

export const CURRENCIES: Record<string, CurrencyConfig> = {
  BGN: {
    code: 'BGN',
    symbol: 'лв',
    name: 'Български лев',
    flag: '🇧🇬',
    denominations: [1, 5, 10, 20, 50, 100],
    imageKeys: [
      'bgn_1',
      'bgn_5',
      'bgn_10',
      'bgn_20',
      'bgn_50',
      'bgn_100'
    ]
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Евро',
    flag: '🇪🇺',
    denominations: [5, 10, 20, 50, 100, 200, 500],
    imageKeys: [
      'eur_5',
      'eur_10',
      'eur_20',
      'eur_50',
      'eur_100',
      'eur_200',
      'eur_500'
    ]
  }
};

// Available music tracks - update this array to add/remove songs
export const AVAILABLE_MUSIC_TRACKS = [1, 2, 3, 4, 5, 6, 7];

export type MusicTrack = string;

export function getCurrencyConfig(code: 'BGN' | 'EUR'): CurrencyConfig {
  const config = CURRENCIES[code];
  if (!config) {
    console.warn(`Невалиден код на валута: ${code}, използва се ЛВ`);
    return CURRENCIES.BGN;
  }
  return config;
}

export function getCurrentCurrency(): 'BGN' | 'EUR' {
  try {
    const settings = localStorage.getItem('gameSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      const currency = parsed.currency;
      // Validate currency
      if (currency === 'BGN' || currency === 'EUR') {
        return currency;
      }
      // If currency is invalid (e.g., old 'RON' or 'USD'), reset to BGN
      console.warn(`Невалидна валута в настройките: ${currency}, нулиране към ЛВ`);
      localStorage.removeItem('gameSettings');
    }
  } catch (e) {
    console.error('Грешка при четене на настройките:', e);
    localStorage.removeItem('gameSettings');
  }
  return 'BGN';
}

export function getCurrentMusicTrack(): string {
  try {
    const settings = localStorage.getItem('gameSettings');
    if (settings) {
      const parsed = JSON.parse(settings);
      const track = parsed.musicTrack;
      // Validate that the track number exists in available tracks
      const trackNum = parseInt(track?.replace('song', '') || '1');
      if (AVAILABLE_MUSIC_TRACKS.includes(trackNum)) {
        return track;
      }
    }
  } catch (e) {
    console.error('Грешка при четене на музикалните настройки:', e);
  }
  return 'song1';
}

export function getMusicKey(trackId: string): string {
  const trackNum = parseInt(trackId.replace('song', ''));
  return trackNum === 1 ? 'bgMusic' : `bgMusic${trackNum}`;
}
