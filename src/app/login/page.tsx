'use client'; // Essential for client-side functionality in Next.js App Router

import Link from "next/link";
import React, { useState } from "react";
import { supabase } from '@/lib/supabase'; // Adjust this path if your supabase client is in a different location
import { useRouter } from 'next/navigation'; // For Next.js 13+ App Router
// If you are using Next.js Pages Router, use: import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter(); // Initialize useRouter hook

  // State variables for form inputs
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  // State variables for UI feedback
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior (page reload)
    setLoading(true);   // Set loading state to true
    setError(null);     // Clear previous errors

    try {
      // Call Supabase to sign in the user with email and password
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        // If there's an error during login (e.g., "Invalid credentials")
        setError(authError.message);
        setLoading(false);
        return; // Stop the function here
      }

      // If login is successful, redirect to the dashboard
      router.push('/dashboard'); // Navigate to your main authenticated page

    } catch (err: any) {
      // Catch any unexpected errors during the process
      console.error('An unexpected error occurred:', err);
      setError(err.message || 'An unexpected error occurred during login. Please try again.');
    } finally {
      setLoading(false); // Always set loading to false when the process finishes
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"> {/* Changed background color for clarity and standard Tailwind */}
      <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
      <form onSubmit={handleLogin} className="flex flex-col items-center space-y-4 mt-10 w-[500px] bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-4">Login</h1>
        <p className="text-gray-600 mb-4">Please enter your credentials</p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required // Basic HTML validation
          className="p-2 border border-gray-300 rounded w-64 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Password Input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required // Basic HTML validation
          className="p-2 border border-gray-300 rounded w-64 focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Display Error Feedback */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading} // Disable button during submission
          className="bg-[#31e28d] text-[#080808] p-2 rounded w-64 hover:bg-[#28c77a] disabled:opacity-50 flex justify-center items-center"
        >
          {loading ? 'Logging In...' : 'Login'} {/* Change text based on loading state */}
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;
