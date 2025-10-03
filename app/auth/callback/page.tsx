
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Giriş işlemi kontrol ediliyor...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL hash'ten auth data'yı al
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback hatası:', error);
          setStatus('error');
          setMessage('Giriş işleminde hata oluştu. Lütfen tekrar deneyin.');
          
          // 3 saniye sonra ana sayfaya yönlendir
          setTimeout(() => {
            window.location.href = '/';
          }, 3000);
          return;
        }

        if (data.session) {
          console.log('✅ Başarılı giriş:', data.session.user.email);
          setStatus('success');
          setMessage('Giriş başarılı! Ana panele yönlendiriliyor...');
          
          // Kısa gecikme ile dashboard'a yönlendir
          setTimeout(() => {
            window.location.href = '/app';
          }, 1500);
        } else {
          console.log('Session bulunamadı');
          setStatus('error');
          setMessage('Oturum bulunamadı. Ana sayfaya yönlendiriliyor...');
          
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
        }
      } catch (error) {
        console.error('Callback işlem hatası:', error);
        setStatus('error');
        setMessage('Beklenmeyen bir hata oluştu. Ana sayfaya yönlendiriliyor...');
        
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      }
    };

    // Sayfanın yüklenmesini bekle
    const timer = setTimeout(handleAuthCallback, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '🏆';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading': return 'from-blue-500 to-purple-600';
      case 'success': return 'from-green-500 to-emerald-600';
      case 'error': return 'from-red-500 to-pink-600';
      default: return 'from-blue-500 to-purple-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className={`w-20 h-20 bg-gradient-to-br ${getStatusColor()} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ${status === 'loading' ? 'animate-pulse' : ''}`}>
          <span className="text-white text-3xl">{getStatusIcon()}</span>
        </div>
        
        <h2 className="text-2xl font-['Pacifico'] text-gray-900 mb-3">
          {status === 'success' ? 'Hoş Geldin!' : 'LGS Liga'}
        </h2>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {status === 'loading' && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {status === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            <p className="font-medium mb-1">Sorun mu yaşıyorsun?</p>
            <p>Magic link'i tekrar istemek için ana sayfaya dön</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
            <p className="font-medium mb-1">🎉 Giriş Tamamlandı!</p>
            <p>Ana panele yönlendiriliyorsun...</p>
          </div>
        )}
      </div>
    </div>
  );
}
