
import React, { useState, useRef } from 'react';
import { Student, Material, Assignment, LiveSession } from '../types';

interface TeacherDashboardProps {
  students: Student[];
  materials: Material[];
  assignments: Assignment[];
  onAddMaterial: (material: Material) => void;
  onGradeAssignment: (id: string, status: 'PASS' | 'FAIL', marks: number, comment: string) => void;
  liveSession: LiveSession;
  onToggleLive: (active: boolean, name: string) => void;
  userName: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ 
  students, materials, assignments, onAddMaterial, onGradeAssignment, liveSession, onToggleLive, userName 
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MATERIALS' | 'ASSIGNMENTS' | 'LIVE'>('OVERVIEW');
  const [matForm, setMatForm] = useState({ title: '', type: 'LECTURE' as any, content: '' });
  const [grading, setGrading] = useState<{id: string, marks: number, comment: string} | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleStartLive = async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(media);
      if (videoRef.current) videoRef.current.srcObject = media;
      onToggleLive(true, userName);
    } catch (err) {
      alert("کیمرہ تک رسائی حاصل نہیں ہو سکی۔");
    }
  };

  const handleStopLive = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    onToggleLive(false, userName);
  };

  const playBell = () => {
    const audio = new Audio('https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3');
    audio.play();
  };

  const pendingAssignments = assignments.filter(a => a.status === 'PENDING');

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-right">
          <h2 className="text-3xl font-bold nastaliq text-blue-900">ٹیچر پورٹل</h2>
          <p className="text-slate-500">خوش آمدید، {userName}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={playBell} className="bg-yellow-500 text-white px-4 py-2 rounded-xl font-bold shadow hover:bg-yellow-600 flex items-center gap-2">
            🔔 سکول بیل
          </button>
          <button 
            onClick={() => setActiveTab('LIVE')}
            className={`px-4 py-2 rounded-xl font-bold shadow transition ${liveSession.isActive ? 'bg-red-600 animate-pulse text-white' : 'bg-blue-600 text-white'}`}
          >
            {liveSession.isActive ? 'لائیو کلاس جاری ہے' : 'لائیو کلاس شروع کریں'}
          </button>
        </div>
      </div>

      <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {['OVERVIEW', 'MATERIALS', 'ASSIGNMENTS', 'LIVE'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-3 text-sm font-bold transition ${activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-slate-50'}`}
          >
            {tab === 'OVERVIEW' ? 'جائزہ' : tab === 'MATERIALS' ? 'میٹیریل / سلائیڈز' : tab === 'ASSIGNMENTS' ? 'اسائنمنٹس' : 'لائیو روم'}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <h4 className="text-slate-500 text-xs font-bold mb-2">زیر التواء اسائنمنٹس</h4>
            <div className="text-3xl font-bold text-blue-800">{pendingAssignments.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <h4 className="text-slate-500 text-xs font-bold mb-2">اپ لوڈ کردہ لیکچرز</h4>
            <div className="text-3xl font-bold text-blue-800">{materials.length}</div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-blue-100">
            <h4 className="text-slate-500 text-xs font-bold mb-2">کل طلباء</h4>
            <div className="text-3xl font-bold text-blue-800">{students.length}</div>
          </div>
        </div>
      )}

      {activeTab === 'MATERIALS' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-blue-100">
            <h3 className="font-bold mb-4">نیا میٹیریل اپ لوڈ کریں (سلائیڈز / نوٹس)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input placeholder="عنوان" className="border p-2 rounded" value={matForm.title} onChange={e => setMatForm({...matForm, title: e.target.value})} />
              <select className="border p-2 rounded" value={matForm.type} onChange={e => setMatForm({...matForm, type: e.target.value as any})}>
                <option value="LECTURE">لیکچر</option>
                <option value="SLIDE">سلائیڈ</option>
                <option value="DOCUMENT">دستاویز</option>
              </select>
              <button 
                onClick={() => {
                  onAddMaterial({ ...matForm, id: Date.now().toString(), date: new Date().toISOString() });
                  setMatForm({ title: '', type: 'LECTURE', content: '' });
                }}
                className="bg-blue-600 text-white font-bold rounded"
              >
                شامل کریں
              </button>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-slate-50"><tr><th className="p-4">عنوان</th><th className="p-4">قسم</th><th className="p-4">تاریخ</th></tr></thead>
              <tbody>
                {materials.map(m => (
                  <tr key={m.id} className="border-t">
                    <td className="p-4 font-bold">{m.title}</td>
                    <td className="p-4 text-xs bg-blue-50 m-2 rounded">{m.type}</td>
                    <td className="p-4 text-xs">{new Date(m.date).toLocaleDateString('ur-PK')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'ASSIGNMENTS' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg">طلباء کی بھیجی گئی اسائنمنٹس</h3>
          {assignments.map(a => (
            <div key={a.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold">{a.studentName} <span className="text-xs text-slate-400">({a.title})</span></p>
                <p className="text-xs text-blue-600 italic">فائل: {a.fileContent.substring(0, 30)}...</p>
                <div className="mt-2 flex gap-2">
                  <span className={`text-xs px-2 py-1 rounded font-bold ${a.status === 'PASS' ? 'bg-green-100 text-green-700' : a.status === 'FAIL' ? 'bg-red-100 text-red-700' : 'bg-gray-100'}`}>
                    {a.status === 'PENDING' ? 'زیر غور' : a.status === 'PASS' ? 'پاس' : 'فیل'}
                  </span>
                  {a.marks && <span className="text-xs font-bold">نمبر: {a.marks}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setGrading({ id: a.id, marks: 0, comment: '' })} className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm font-bold">نمبر لگائیں</button>
              </div>
            </div>
          ))}
          {grading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
              <div className="bg-white p-6 rounded-2xl w-full max-w-md">
                <h3 className="font-bold mb-4">نمبر اور سٹیٹس</h3>
                <input type="number" placeholder="نمبر (0-100)" className="w-full border p-2 mb-4" onChange={e => setGrading({...grading, marks: parseInt(e.target.value)})} />
                <textarea placeholder="تبصرہ" className="w-full border p-2 mb-4" onChange={e => setGrading({...grading, comment: e.target.value})}></textarea>
                <div className="flex gap-2">
                  <button onClick={() => { onGradeAssignment(grading.id, 'PASS', grading.marks, grading.comment); setGrading(null); }} className="flex-1 bg-green-600 text-white py-2 rounded font-bold">پاس</button>
                  <button onClick={() => { onGradeAssignment(grading.id, 'FAIL', grading.marks, grading.comment); setGrading(null); }} className="flex-1 bg-red-600 text-white py-2 rounded font-bold">فیل</button>
                  <button onClick={() => setGrading(null)} className="flex-1 bg-slate-200 py-2 rounded font-bold">کینسل</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'LIVE' && (
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl relative min-h-[400px] flex flex-col items-center justify-center">
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full absolute object-cover opacity-50" />
          <div className="z-10 text-center text-white space-y-6 p-8">
            <h3 className="text-4xl font-bold nastaliq">لائیو کلاس روم</h3>
            {liveSession.isActive ? (
              <div className="space-y-4">
                <p className="bg-red-600 px-4 py-1 rounded-full animate-pulse inline-block">آپ لائیو ہیں</p>
                <p>اساتذہ اور طلباء آپ کا کیمرہ دیکھ سکتے ہیں۔</p>
                <button onClick={handleStopLive} className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-xl hover:bg-slate-100">کلاس ختم کریں</button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="opacity-70">کلاس شروع کرنے کے لیے بٹن دبائیں۔ طلباء کو الرٹ مل جائے گا۔</p>
                <button onClick={handleStartLive} className="bg-emerald-500 text-white px-8 py-3 rounded-full font-bold text-xl hover:bg-emerald-600 shadow-xl transition">کلاس شروع کریں (کیمرہ کھولیں)</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
