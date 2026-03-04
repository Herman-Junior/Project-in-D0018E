import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useContext(ShopContext);

  // new - decode JWT manually without jwt-decode library
  const token = localStorage.getItem("token");
  let isAdmin = false;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      isAdmin = payload.is_admin;
    } catch {}
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="pt-14 flex flex-col items-center">

      <div className="inline-flex items-center gap-2 mb-10">
        <hr className="border-none h-[1.5px] w-8" style={{ backgroundColor: '#6f1811' }} />
        <h1 className="text-3xl uppercase font-semibold tracking-tighter"
          style={{ color: '#6f1811' }}>My Profile</h1>
        <hr className="border-none h-[1.5px] w-8" style={{ backgroundColor: '#6f1811' }} />
      </div>

      <div className="w-full max-w-sm flex flex-col gap-4">

        <button onClick={() => navigate("/orders")}
          className="py-4 uppercase tracking-widest text-sm font-bold border transition-all hover:text-white"
          style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5C1A1B'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
          My Orders
        </button>

        {/* only visible to admin accounts */}
        {isAdmin && (
          <button onClick={() => navigate("/admin")}
            className="py-4 uppercase tracking-widest text-sm font-bold border transition-all hover:text-white"
            style={{ color: '#5C1A1B', borderColor: '#5C1A1B' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#5C1A1B'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            Admin Panel
          </button>
        )}

        <button onClick={handleLogout}
          className="py-4 uppercase tracking-widest text-sm font-bold border border-red-600 text-red-600 transition-all hover:bg-red-600 hover:text-white">
          Sign Out
        </button>

      </div>
    </div>
  );
};

export default Profile;