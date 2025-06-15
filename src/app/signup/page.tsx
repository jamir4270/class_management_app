'use client'; // This directive is essential for client-side functionality in Next.js App Router

import Link from "next/link";
import React, { useState } from "react";
import { supabase } from '@/lib/supabase'; // Adjust this path if your supabase client is in a different location
import { useRouter } from 'next/navigation'; // For Next.js 13+ App Router
// If you are using Next.js Pages Router, use: import { useRouter } from 'next/router';

const SignUp = () => {
    const router = useRouter(); // Initialize useRouter hook

    // State variables for form inputs
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    // State variables for UI feedback
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setLoading(true);   // Set loading state to true
        setError(null);     // Clear previous errors
        setMessage(null);   // Clear previous messages

        try {
            // Step 1: Authenticate the user with Supabase Auth
            // This creates an entry in the auth.users table securely
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: email,
                password: password,
            });

            if (authError) {
                // Handle authentication errors (e.g., "Email already registered", "Password too weak")
                setError(authError.message);
                setLoading(false);
                return; // Stop the function here
            }

            // Check if a user object was returned.
            // If email confirmation is enabled in Supabase, authData.user might be null initially.
            const user = authData.user;

            if (!user) {
                // This typically means an email confirmation link has been sent
                setMessage('Please check your email to confirm your account and complete registration.');
                setLoading(false);
                // You might want to redirect them to a confirmation message page
                router.push('/check-email');
                return;
            }

            // Step 2: If authentication is successful (and user object is present),
            // create the teacher's profile in your public.teachers table
            const { data: teacherProfileData, error: teacherProfileError } = await supabase
                .from('teachers')
                .insert([
                    {
                        user_id: user.id,       // Link to the Supabase Auth user's UUID
                        first_name: firstName,
                        last_name: lastName,
                        email: email,           // Store email in profile for convenience
                        // No need to add department or phone_number here if they are not in the form
                        // If you add them to the form, add them here:
                        // department: department || null,
                        // phone_number: phoneNumber || null,
                    },
                ]);

            if (teacherProfileError) {
                // Handle errors during profile creation.
                // This is a critical point: if auth succeeded but profile failed,
                // you might want to consider deleting the auth user too to avoid orphaned accounts.
                // For now, we'll just log and display the error.
                console.error('Error creating teacher profile:', teacherProfileError);
                setError(`Failed to create teacher profile: ${teacherProfileError.message}. Please try again or contact support.`);
                // Optionally, sign out the authenticated user if profile creation failed to prevent orphaned data
                await supabase.auth.signOut();
                setLoading(false);
                return;
            }

            setMessage('Account created successfully! Redirecting to login...');
            // Redirect the user to the login page
            router.push('/login');

        } catch (err: any) {
            // Catch any unexpected errors
            console.error('An unexpected error occurred:', err);
            setError(err.message || 'An unexpected error occurred during signup. Please try again.');
        } finally {
            setLoading(false); // Always set loading to false when done
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-6">Create an Account</h1>
            <form onSubmit={handleSignup} className="flex flex-col items-center space-y-4 mt-10 w-[500px] bg-white p-6 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
                <p className="text-gray-600 mb-4">Please enter your credentials</p>

                {/* First Name Input */}
                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required // Added required attribute for basic HTML validation
                    className="p-2 border border-gray-300 rounded w-64"
                />

                {/* Last Name Input */}
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required // Added required
                    className="p-2 border border-gray-300 rounded w-64"
                />

                {/* Email Input */}
                <input
                    type="email" // Use type="email" for email input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required // Added required
                    className="p-2 border border-gray-300 rounded w-64"
                />

                {/* Password Input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required // Added required
                    className="p-2 border border-gray-300 rounded w-64"
                />

                {/* Display Error/Message Feedback */}
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                {message && <p className="text-green-600 text-sm mt-2">{message}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading} // Disable button when loading
                    className="bg-[#31e28d] text-[#080808] p-2 rounded w-64 hover:bg-[#28c77a] disabled:opacity-50"
                >
                    {loading ? 'Signing Up...' : 'Sign Up'} {/* Change button text based on loading state */}
                </button>

                <p className="text-gray-500 text-sm mt-4">
                    Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default SignUp;
