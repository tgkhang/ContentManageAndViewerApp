import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';


export default function MainLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login');
  };

  const renderAdminMenu = () => (
    <ul className="mt-6">
      <li className="mb-2">
        <Link to="/admin/studentList" className="block py-2 px-4 rounded hover:bg-gray-100">
          Student List
        </Link>
      </li>
    </ul>
  );

  const renderEditorMenu = () => (
    <ul className="mt-6">
      <li className="mb-2">
        <Link to="/editor/dashboard" className="block py-2 px-4 rounded hover:bg-gray-100">
          Dashboard
        </Link>
      </li>
      <li className="mb-2">
        <Link to="/editor/course" className="block py-2 px-4 rounded hover:bg-gray-100">
          Courses
        </Link>
      </li>
    </ul>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">LMS System</h2>
        </div>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm text-gray-500">Logged in as:</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm text-gray-500 capitalize">{user?.role}</p>
          </div>
          
          {/* Role-based navigation */}
          {user?.role === 'admin' && renderAdminMenu()}
          {user?.role === 'editor' && renderEditorMenu()}
          
          <div className="mt-6 pt-6 border-t">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow">
          <div className="px-4 py-6">
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}