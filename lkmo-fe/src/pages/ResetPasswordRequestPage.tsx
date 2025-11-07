import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, LogIn } from 'lucide-react';
import { passwordResetAPI } from '../services/api';
import { initializeGoogleSignIn, triggerGoogleSignIn } from '../utils/googleAuth';
import { useAuth } from '../contexts/AuthContext';

export default function ResetPasswordRequestPage() {
  const navigate = useNavigate();
  const { loginGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isGoogleAccount, setIsGoogleAccount] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsGoogleAccount(false);
    setLoading(true);

    try {
      const response = await passwordResetAPI.requestOTP(email);
      if (response.success) {
        setSuccess(true);
        // Navigate to verify OTP page after 2 seconds
        setTimeout(() => {
          navigate('/reset-password/verify', { state: { email } });
        }, 2000);
      } else {
        setError(response.message || 'Gagal mengirim OTP');
      }
    } catch (err: any) {
      // Check if this is a Google account
      if (err.response?.status === 400 && err.response?.data?.isGoogleAccount) {
        setIsGoogleAccount(true);
        setError('');
      } else if (err.response?.status === 429) {
        const remainingSeconds = err.response?.data?.remainingSeconds || 0;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        setError(`Terlalu banyak permintaan. Silakan tunggu ${minutes}:${seconds.toString().padStart(2, '0')} menit lagi.`);
      } else {
        setError(err.response?.data?.message || err.message || 'Gagal mengirim OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      // Re-initialize with current state
      await initializeGoogleSignIn(async (credential) => {
        try {
          await loginGoogle(credential);
          navigate('/');
        } catch (err: any) {
          setError(err.message || 'Login dengan Google gagal');
        } finally {
          setGoogleLoading(false);
        }
      });
      triggerGoogleSignIn();
    } catch (err: any) {
      setError(err.message || 'Gagal memuat Google Sign-In');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img src="/buku.svg" alt="YangPentingMakan" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-green-500">
              YangPentingMakan
            </h1>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masukkan email Anda untuk menerima kode OTP
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Email Terkirim!
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Kode OTP telah dikirim ke email Anda. Silakan cek inbox email Anda.
              </p>
              <p className="mt-2 text-xs text-gray-400">
                Mengarahkan ke halaman verifikasi...
              </p>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm"
              >
                <ArrowLeft size={16} className="mr-1" />
                Kembali ke Login
              </Link>

              {isGoogleAccount ? (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <LogIn className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className="text-sm font-medium text-blue-800">
                        Akun Google Terdeteksi
                      </h3>
                      <div className="mt-2 text-sm text-blue-700">
                        <p>
                          Email <strong>{email}</strong> terdaftar menggunakan akun Google. 
                          Silakan login dengan Google untuk mengakses akun Anda.
                        </p>
                      </div>
                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={handleGoogleLogin}
                          disabled={googleLoading}
                          className="w-full flex items-center justify-center gap-3 px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          {googleLoading ? 'Memproses...' : 'Login dengan Google'}
                        </button>
                        <p className="mt-2 text-xs text-blue-600 text-center">
                          atau{' '}
                          <Link
                            to="/login"
                            className="font-medium underline hover:text-blue-800"
                          >
                            kembali ke halaman login
                          </Link>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}

                  <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      placeholder="nama@email.com"
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Mengirim...' : 'Kirim Kode OTP'}
                  </button>
                </div>
              </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

