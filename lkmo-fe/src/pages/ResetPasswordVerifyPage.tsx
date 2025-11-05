import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CookingPotIcon, ArrowLeft, Clock } from 'lucide-react';
import { passwordResetAPI } from '../services/api';

export default function ResetPasswordVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes in seconds

  useEffect(() => {
    if (!email) {
      navigate('/reset-password');
      return;
    }

    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await passwordResetAPI.verifyOTP(email, otp);
      if (response.success) {
        navigate('/reset-password/set', {
          state: { email, otpId: response.otpId }
        });
      } else {
        setError(response.message || 'Kode OTP tidak valid');
      }
    } catch (err: any) {
      if (err.response?.status === 429) {
        const remainingSeconds = err.response?.data?.remainingSeconds || 0;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        setError(`Terlalu banyak percobaan. Silakan request OTP baru dan tunggu ${minutes}:${seconds.toString().padStart(2, '0')} menit.`);
      } else {
        const remainingAttempts = err.response?.data?.remainingAttempts;
        if (remainingAttempts !== undefined) {
          setError(err.response?.data?.message || `Kode OTP salah. Sisa percobaan: ${remainingAttempts}`);
        } else {
          setError(err.response?.data?.message || err.message || 'Kode OTP tidak valid');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen bg-orange-50/30 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-2">
            <CookingPotIcon size={32} className="text-orange-500" />
            <h1 className="text-2xl font-bold text-orange-500">
              YangPentingMakan
            </h1>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-800">
          Verifikasi Kode OTP
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Masukkan kode OTP yang dikirim ke {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Link
            to="/reset-password"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Kembali
          </Link>

          {timeLeft === 0 && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-md text-sm">
              Kode OTP telah kadaluarsa. Silakan request OTP baru.
            </div>
          )}

          {timeLeft > 0 && (
            <div className="mb-4 flex items-center justify-center text-sm text-gray-600">
              <Clock size={16} className="mr-2" />
              <span>Kode berlaku selama: <strong className="text-orange-600">{formatTime(timeLeft)}</strong></span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                Kode OTP (6 digit)
              </label>
              <div className="mt-1">
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // Only numbers
                    setOtp(value);
                  }}
                  disabled={timeLeft === 0}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm text-center text-2xl tracking-widest font-mono disabled:bg-gray-100"
                  placeholder="000000"
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Masukkan 6 digit kode yang dikirim ke email Anda
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || timeLeft === 0 || otp.length !== 6}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memverifikasi...' : 'Verifikasi'}
              </button>
            </div>

            {timeLeft === 0 && (
              <div className="text-center">
                <Link
                  to="/reset-password"
                  className="text-sm text-orange-600 hover:text-orange-700"
                >
                  Request OTP Baru
                </Link>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

