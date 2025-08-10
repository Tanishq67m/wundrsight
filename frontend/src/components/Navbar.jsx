import React from "react";
import { Calendar, User, LogOut, UserPlus, LogIn } from "lucide-react";

const Button = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white focus:ring-blue-500 shadow-lg hover:shadow-xl",
    ghost: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white focus:ring-red-500 shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm"
  };
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default function Navbar({ user, onLogout, onShowLogin, onShowRegister }) {
  return (
    <nav className="bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              AppointmentPro
            </h1>
          </div>
          
          <div className="flex items-center space-x-3">
            {!user ? (
              <>
                <Button variant="ghost" onClick={onShowLogin}>
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
                <Button onClick={onShowRegister}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Register
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-lg">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700 capitalize">{user.role}</span>
                </div>
                <Button variant="danger" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}