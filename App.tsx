
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRole, Student, AuthState, Material, Assignment, LiveSession } from './types';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import StudentDashboard from './components/StudentDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({ user: null });
  const [students, setStudents] = useState<Student[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [liveSession, setLiveSession] = useState<LiveSession>({ isActive: false, teacherName: '' });

  // Load initial data
  useEffect(() => {
    const savedStudents = localStorage.getItem('ghs_students');
    if (savedStudents) setStudents(JSON.parse(savedStudents));
    
    const savedMaterials = localStorage.getItem('ghs_materials');
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));

    const savedAssignments = localStorage.getItem('ghs_assignments');
    if (savedAssignments) setAssignments(JSON.parse(savedAssignments));
    
    const savedAuth = localStorage.getItem('ghs_auth');
    if (savedAuth) setAuth(JSON.parse(savedAuth));
  }, []);

  // Save data
  useEffect(() => { localStorage.setItem('ghs_students', JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem('ghs_materials', JSON.stringify(materials)); }, [materials]);
  useEffect(() => { localStorage.setItem('ghs_assignments', JSON.stringify(assignments)); }, [assignments]);
  useEffect(() => { localStorage.setItem('ghs_auth', JSON.stringify(auth)); }, [auth]);

  const handleLogin = (role: UserRole, id: string, name: string) => {
    setAuth({ user: { role, id, name } });
  };

  const handleLogout = () => {
    setAuth({ user: null });
  };

  const addStudent = (student: Student) => setStudents(prev => [...prev, student]);
  
  const addMaterial = (material: Material) => setMaterials(prev => [material, ...prev]);

  const submitAssignment = (assignment: Assignment) => setAssignments(prev => [assignment, ...prev]);

  const gradeAssignment = (id: string, status: 'PASS' | 'FAIL', marks: number, comment: string) => {
    setAssignments(prev => prev.map(a => a.id === id ? { ...a, status, marks, teacherComment: comment } : a));
  };

  const toggleLive = (active: boolean, name: string) => {
    setLiveSession({ isActive: active, teacherName: active ? name : '', startTime: active ? new Date().toISOString() : undefined });
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
        <Navbar auth={auth} onLogout={handleLogout} />
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route 
              path="/" 
              element={
                auth.user ? (
                  auth.user.role === UserRole.ADMIN ? <Navigate to="/admin" /> :
                  auth.user.role === UserRole.TEACHER ? <Navigate to="/teacher" /> :
                  <Navigate to="/student" />
                ) : (
                  <Login onLogin={handleLogin} students={students} />
                )
              } 
            />
            
            <Route 
              path="/admin" 
              element={
                auth.user?.role === UserRole.ADMIN ? (
                  <AdminDashboard 
                    students={students} 
                    onAddStudent={addStudent} 
                    assignments={assignments}
                    materials={materials}
                  />
                ) : <Navigate to="/" />
              } 
            />
            
            <Route 
              path="/teacher" 
              element={
                auth.user?.role === UserRole.TEACHER ? (
                  <TeacherDashboard 
                    students={students} 
                    materials={materials}
                    assignments={assignments}
                    onAddMaterial={addMaterial}
                    onGradeAssignment={gradeAssignment}
                    liveSession={liveSession}
                    onToggleLive={toggleLive}
                    userName={auth.user.name}
                  />
                ) : <Navigate to="/" />
              } 
            />
            
            <Route 
              path="/student" 
              element={
                auth.user?.role === UserRole.STUDENT ? (
                  <StudentDashboard 
                    student={students.find(s => s.id === auth.user?.id)!} 
                    materials={materials}
                    assignments={assignments.filter(a => a.studentId === auth.user?.id)}
                    onSubmitAssignment={submitAssignment}
                    liveSession={liveSession}
                  />
                ) : <Navigate to="/" />
              } 
            />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

export default App;
