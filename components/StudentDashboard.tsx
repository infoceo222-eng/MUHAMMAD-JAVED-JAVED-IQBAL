
import React, { useState } from 'react';
import { Student, Material, Assignment, LiveSession } from '../types';

interface StudentDashboardProps {
  student: Student;
  materials: Material[];
  assignments: Assignment[];
  onSubmitAssignment: (assignment: Assignment) => void;
  liveSession: LiveSession;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  student, materials, assignments, onSubmitAssignment, liveSession 
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({ title: '', content: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitAssignment({
      id: Date.now().toString(),
      studentId: student.id,
      studentName: student.name,
      title: uploadData.title,
      fileContent: uploadData.content,
      status: 'PENDING',
      date: new Date().toISOString()
    });
    setShowUpload(false);
    setUploadData({ title: '', content: '' });
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Live Class Alert */}
      {liveSession.isActive && (
        <div className="bg-red-600 text-white p-4 rounded-2xl shadow-lg flex justify-between items-center animate-bounce">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🔴</span>
            <p className="font-bold">جناب {liveSession.teacherName} کی لائیو کلاس جاری ہے!</p>
          </div>
          <button className="bg-white text-red-600 px-6 py-2 rounded-full font-bold hover:bg-slate-100">کلاس میں شامل ہوں</button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="bg-emerald-800 h-32" />
        <div className="px-8 pb-8 pt-4 -mt-12 flex flex-col md:flex-row gap-6 items-start">
          <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center text-4xl">👤</div>
          <div className="flex-1 mt-4">
            <h2 className="text-3xl font-bold nastaliq text-emerald-900">{student.name}</h2>
            <p className="text-slate-500 font-bold">کلاس: {student.class} | رول نمبر: {student.rollNumber}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 border-b pb-2 flex items-center gap-2">📚 لیکچرز اور سلائیڈز</h3>
            <div className="space-y-3">
              {materials.map(m => (
                <div key={m.id} className="p-3 bg-slate-50 rounded-xl flex justify-between items-center border border-slate-100 hover:border-emerald-300 transition cursor-pointer">
                  <div>
                    <p className="font-bold text-emerald-900">{m.title}</p>
                    <p className="text-xs text-slate-400">{m.type} • {new Date(m.date).toLocaleDateString('ur-PK')}</p>
                  </div>
                  <button className="text-emerald-600 font-bold text-sm">ڈاؤن لوڈ کریں</button>
                </div>
              ))}
              {materials.length === 0 && <p className="text-center py-4 text-slate-400 italic">کوئی میٹیریل موجود نہیں</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-4 border-b pb-2">📊 میرے نتائج (اسائنمنٹ رپورٹس)</h3>
            <div className="space-y-3">
              {assignments.map(a => (
                <div key={a.id} className="p-3 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{a.title}</p>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${a.status === 'PASS' ? 'bg-green-100 text-green-700' : a.status === 'FAIL' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                      {a.status === 'PENDING' ? 'زیر غور' : a.status === 'PASS' ? 'پاس' : 'فیل'}
                    </span>
                  </div>
                  {a.marks !== undefined && <p className="text-sm font-bold mt-1 text-emerald-700">نمبر: {a.marks}/100</p>}
                  {a.teacherComment && <p className="text-xs text-slate-500 mt-1 italic">استاد کا تبصرہ: {a.teacherComment}</p>}
                </div>
              ))}
              {assignments.length === 0 && <p className="text-center py-4 text-slate-400 italic">کوئی اسائنمنٹ نہیں بھیجی گئی</p>}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-emerald-700 text-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl font-bold mb-4">اسائنمنٹ اپ لوڈ کریں</h3>
            {!showUpload ? (
              <button 
                onClick={() => setShowUpload(true)}
                className="w-full bg-white text-emerald-800 py-3 rounded-xl font-bold hover:bg-slate-100 transition shadow-md"
              >
                نیا کام جمع کروائیں
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="عنوان" className="w-full p-2 rounded text-slate-900" value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} />
                <textarea required placeholder="جواب لکھیں یا فائل کا لنک دیں" className="w-full p-2 rounded text-slate-900" rows={4} value={uploadData.content} onChange={e => setUploadData({...uploadData, content: e.target.value})}></textarea>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-emerald-500 py-2 rounded font-bold">ارسال کریں</button>
                  <button type="button" onClick={() => setShowUpload(false)} className="bg-white/20 py-2 px-4 rounded font-bold">کینسل</button>
                </div>
              </form>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-lg mb-2">تعلیمی نوٹس بورڈ</h3>
            <p className="text-sm text-slate-600">سکول کی تمام اپ ڈیٹس یہاں دکھائی دیں گی۔ آئی ٹی برانچ کی طرف سے خوش آمدید۔</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
