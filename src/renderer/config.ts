const isElectron = typeof window !== 'undefined' && 
                   typeof (window as any).moodEngine !== 'undefined';

export const config = {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    isElectron,
} as const;