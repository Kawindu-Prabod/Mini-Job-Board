"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [sessionStatus, setSessionStatus] = useState(0); // 0 = logged out, 1 = logged in
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [user, setUser] = useState(null);

  // Load session status from localStorage
  useEffect(() => {
    const status = localStorage.getItem("sessionStatus");
    setSessionStatus(parseInt(status) || 0);
  }, []);
  // Set User
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user); // use a state variable to store user
    }
  }, []);


  // Auto logout after 15 minutes (optional)
  // useEffect(() => {
  //   if (sessionStatus === 1) {
  //     const timeout = setTimeout(() => {
  //       setSessionStatus(0);
  //       localStorage.setItem("sessionStatus", "0");
  //       console.log("Session expired.");
  //     }, 15 * 60 * 1000);

  //     return () => clearTimeout(timeout);
  //   }
  // }, [sessionStatus]);
  useEffect(() => {
    if (sessionStatus === 1) {
      let logoutTimer;
      let lastActivityTime;

      const startLogoutTimer = () => {
        logoutTimer = setTimeout(() => {
          const now = Date.now();
          const inactiveTime = now - lastActivityTime;

          if (inactiveTime >= 15 * 60 * 1000) {
            setSessionStatus(0);
            localStorage.setItem("sessionStatus", "0");
            localStorage.removeItem("lastActivityTime");
            setShowDropdown(false);
            console.log("Session expired due to inactivity.");
            location.reload();
          }
        }, 15 * 60 * 1000 + 1000);
      };

      const resetTimer = () => {
        lastActivityTime = Date.now();
        localStorage.setItem("lastActivityTime", lastActivityTime.toString());
        clearTimeout(logoutTimer);
        startLogoutTimer();
      };

      // Initialize once on mount
      lastActivityTime = parseInt(localStorage.getItem("lastActivityTime")) || Date.now();
      startLogoutTimer();

      // Listen for user activity
      window.addEventListener("mousemove", resetTimer);
      window.addEventListener("keydown", resetTimer);
      window.addEventListener("focus", resetTimer);
      window.addEventListener("click", resetTimer);

      return () => {
        clearTimeout(logoutTimer);
        window.removeEventListener("mousemove", resetTimer);
        window.removeEventListener("keydown", resetTimer);
        window.removeEventListener("focus", resetTimer);
        window.removeEventListener("click", resetTimer);
      };
    }
  }, [sessionStatus]);


  // //Toggle Session
  // const toggleSession = () => {
  //   const newStatus = sessionStatus === 1 ? 0 : 1;
  //   setSessionStatus(newStatus);
  //   localStorage.setItem("sessionStatus", newStatus.toString());

  //   if (newStatus === 1) {
  //     const now = Date.now();
  //     const expiresAt = now + 15 * 60 * 1000;

  //     localStorage.setItem("sessionExpiresAt", expiresAt.toString());
  //     localStorage.setItem("lastActivityTime", now.toString()); // ✅ This line was missing
  //   } else {
  //     localStorage.removeItem("sessionExpiresAt");
  //     localStorage.removeItem("lastActivityTime");
  //   }

  //   location.reload(); // optional brute force refresh
  // };


  useEffect(() => {
    const interval = setInterval(() => {
      const storedTime = parseInt(localStorage.getItem("lastActivityTime"));
      const timeLeft = storedTime + 15 * 60 * 1000 - Date.now();

      if (timeLeft <= 0 && sessionStatus === 1) {
        setSessionStatus(0);
        localStorage.setItem("sessionStatus", "0");
        localStorage.removeItem("lastActivityTime");
        localStorage.removeItem("user");
        setShowDropdown(false);
        setTimeLeft(null);
        location.reload();
      } else {
        setTimeLeft(timeLeft);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStatus]);


  const handleLogout = () => {
    setSessionStatus(0);
    localStorage.setItem("sessionStatus", "0");
    localStorage.removeItem("sessionExpiresAt");
    localStorage.removeItem("lastActivityTime");
    setShowDropdown(false);
    localStorage.removeItem("user");
    location.reload();
  };


  return (
    <nav className="bg-grey shadow-md px-6 py-4 flex justify-between items-center">
      <div className="flex space-x-6 ml-4">
        <Link href="/" className="text-lg font-semibold hover:text-blue-600">Home</Link>
        <Link href="/jobs" className="text-lg font-semibold hover:text-blue-600">Jobs</Link>
      </div>

      {/*Show Welcome User*/}
      {sessionStatus === 1 && user && (
        <span className="text-lg font-semibold">
          Welcome, {user.fname} {user.lname}
        </span>
      )}


      <div className="flex items-center space-x-4">


        {/* How much time left simulation*/}
        {timeLeft !== null && (
          <span className="text-sm text-gray-600 ml-4">
            Session expires in: {Math.floor(timeLeft / 60000)}:
            {(Math.floor((timeLeft % 60000) / 1000)).toString().padStart(2, "0")}
          </span>
        )}



        {/* Simulated Session Switch (Dev Only) */}
        { <button
          onClick={toggleSession}
          className="bg-yellow-200 px-2 py-1 rounded text-sm font-mono hover:bg-yellow-300"
        >
          Toggle Session ({sessionStatus === 1 ? "Active" : "Inactive"})
        </button> }

        {sessionStatus === 1 ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-lg font-semibold bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
            >
              Profile
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 bg-white border rounded shadow-md w-40 z-10">
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/signup" className="text-lg font-semibold hover:text-blue-600">Sign up</Link>
            <Link href="/login" className="text-lg font-semibold hover:text-blue-600">Log in</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
