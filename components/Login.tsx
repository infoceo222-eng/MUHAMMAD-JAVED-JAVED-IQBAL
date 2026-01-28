
import React, { useState } from 'react';
import { UserRole, Student } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, id: string, name: string) => void;
  students: Student[];
}

const Login: React.FC<LoginProps> = ({ onLogin, students }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Admin Login check
    if (username === 'admin' && password === '12345') {
      onLogin(UserRole.ADMIN, 'admin-id', 'ہیڈ ماسٹر / ایڈمن');
      return;
    }

    // Teacher Login check
    if (username === 'teacher' && password === '1234') {
      onLogin(UserRole.TEACHER, 'teacher-id', 'جناب استاد صاحب');
      return;
    }

    // Student Login check (by Roll Number)
    const student = students.find(s => s.rollNumber === username && s.password === password);
    if (student) {
      onLogin(UserRole.STUDENT, student.id, student.name);
      return;
    }

    setError('غلط صارف نام یا پاس ورڈ۔ براہ کرم دوبارہ کوشش کریں۔');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold nastaliq text-emerald-800">لاگ ان پورٹل</h2>
        <p className="text-slate-500 mt-2">براہ کرم اپنی معلومات درج کریں</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">صارف نام یا رول نمبر</label>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            placeholder="اپنا صارف نام درج کریں"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">پاس ورڈ</label>
          <input 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none transition"
            placeholder="پاس ورڈ درج کریں"
            required
          />
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
            {error}
          </div>
        )}

        <button 
          type="submit"
          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95"
        >
          داخل ہوں
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 text-xs text-center text-slate-400">
        ایڈمن: admin / 12345 | ٹیچر: teacher / 1234
      </div>
    </div>
  );
};

export default Login;
