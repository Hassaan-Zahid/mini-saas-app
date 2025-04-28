import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemsList from './pages/ItemsList';
import ItemDetail from './pages/ItemDetail';
import CreateItem from './pages/CreateItem';
import EditItem from './pages/EditItem';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import AuthRedirect from "./components/AuthRedirect";

function App() {
  return (
      <Router>
        <AuthProvider>
          <Navbar />
          <div className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={
                <AuthRedirect>
                  <Login />
                </AuthRedirect>
              } />
              <Route path="/register" element={
                <AuthRedirect>
                  <Register />
                </AuthRedirect>
              } />
              <Route path="/items" element={<ItemsList />} />
              <Route path="/items/:id" element={<ItemDetail />} />

              <Route element={<PrivateRoute />}>
                <Route path="/dashboard" element={<UserDashboard />} />
                <Route path="/items/create" element={<CreateItem />} />
                <Route path="/items/:id/edit" element={<EditItem />} />
              </Route>

              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
              </Route>

              <Route path="/" element={<ItemsList />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
  );
}

export default App;