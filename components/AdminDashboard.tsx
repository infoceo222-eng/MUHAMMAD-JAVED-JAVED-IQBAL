
import React, { useState } from 'react';
import { Student, Assignment, Material } from '../types';

interface AdminDashboardProps {
  students: Student[];
  assignments: Assignment[];
  materials: Material[];
  onAddStudent: (student: Student) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ students, assignments, materials, onAddStudent }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    class: '',
    rollNumber: '',
    password: ''
  });

  const generateStudentId = () => 'GHS-KSR-' + Math.floor(1000 + Math.random() * 9000);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    onAddStudent({
      ...formData,
      id: generateStudentId(),
      createdAt: new Date().toISOString()
    });
    setShowForm(false);
    setFormData({ name: '', fatherName: '', class: '', rollNumber: '', password: '' });
  };

  const passRate = assignments.length > 0 
    ? (assignments.filter(a => a.status === 'PASS').length / assignments.length * 100).toFixed(0) 
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold nastaliq text-emerald-900 underline underline-offset-8">ایڈمن ڈیش بورڈ</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-2 rounded-xl font-bold shadow-md transition"
        >
          {showForm ? 'فارم بند کریں' : 'نیا طالب علم شامل کریں'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-slate-500 text-sm">کل طلباء</p>
          <h3 className="text-3xl font-bold text-emerald-800">{students.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-slate-500 text-sm">کل لیکچرز</p>
          <h3 className="text-3xl font-bold text-emerald-800">{materials.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-slate-500 text-sm">اسائنمنٹ پاس ریٹ</p>
          <h3 className="text-3xl font-bold text-emerald-800">{passRate}%</h3>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
          <p className="text-slate-500 text-sm">آئی ٹی برانچ</p>
          <h3 className="text-xl font-bold text-green-600">فعال (آن لائن)</h3>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-emerald-500 animate-in fade-in zoom-in duration-300">
          <h3 className="text-xl font-bold mb-6 text-emerald-800 border-b pb-4">طالب علم کی معلومات درج کریں</h3>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold mb-2">طالب علم کا نام</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">والد کا نام</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.fatherName} onChange={(e) => setFormData({...formData, fatherName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">کلاس</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">رول نمبر</label>
              <input required className="w-full px-4 py-2 border rounded-lg" value={formData.rollNumber} onChange={(e) => setFormData({...formData, rollNumber: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">پاس ورڈ</label>
              <input required type="password" className="w-full px-4 py-2 border rounded-lg" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
            </div>
            <div className="md:col-span-2">
              <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold text-lg hover:bg-emerald-700">محفوظ کریں</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
        <div className="bg-slate-50 p-4 border-b">
          <h3 className="font-bold">طلباء کا ڈیٹا</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-emerald-50 text-emerald-900">
              <tr>
                <th className="p-4">آئی ڈی</th>
                <th className="p-4">نام</th>
                <th className="p-4">کلاس</th>
                <th className="p-4">رول نمبر</th>
                <th className="p-4">سٹیٹس</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-t hover:bg-slate-50">
                  <td className="p-4 font-mono text-xs">{student.id}</td>
                  <td className="p-4 font-semibold">{student.name}</td>
                  <td className="p-4">{student.class}</td>
                  <td className="p-4">{student.rollNumber}</td>
                  <td className="p-4"><span className="text-green-600 text-xs font-bold">فعال</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
