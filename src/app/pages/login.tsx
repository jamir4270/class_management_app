import Link from "next/link";

const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[--background]">
        <h1 className="text-4xl font-bold mb-6">Welcome Back!</h1>
        <form className="flex flex-col items-center space-y-4 mt-10 w-[500px] bg-white p-6 rounded-xl shadow-md">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <p className="text-gray-600 mb-4">Please enter your credentials</p>
            <input
                type="email"
                placeholder="Email"
                className="p-2 border border-gray-300 rounded w-64"
            />
            <input
                type="password"
                placeholder="Password"
                className="p-2 border border-gray-300 rounded w-64"
            />
            <button
                type="submit"
                className="bg-[#31e28d] text-[#080808] p-2 rounded w-64 hover:bg-[#28c77a]"
            >
                Login
            </button>
            <p className="text-gray-500 text-sm mt-4">
                Don't have an account? <Link href="/signup" className="text-blue-500 hover:underline">Sign Up</Link>
            </p>
        </form>
    </div>
  );
}

export default Login;
