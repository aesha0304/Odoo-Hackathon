import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, User, LogOut, Home, Users, MessageSquare } from 'lucide-react';
import { cn } from '../utils/cn';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SS</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Skill Swap</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            {user && (
              <>
                <Link
                  to="/swaps"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <MessageSquare size={18} />
                  <span>Swap Requests</span>
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              </>
            )}
          </div>

          {/* User Menu / Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePhoto}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-4 animate-slide-up">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2 py-2"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
            
            {user && (
              <>
                <Link
                  to="/swaps"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2 py-2"
                >
                  <MessageSquare size={18} />
                  <span>Swap Requests</span>
                </Link>
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="block text-gray-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2 py-2"
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={user.profilePhoto}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left text-gray-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2 py-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            )}
            
            {!user && (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="block btn-primary text-center"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 