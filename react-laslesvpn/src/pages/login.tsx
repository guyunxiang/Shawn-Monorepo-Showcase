import { useState } from "react"
import { Link } from "react-router-dom"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // handle login logic here
    console.log({ email, password })
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden">
        {/* left illustration or branding */}
        <div className="relative hidden md:flex md:w-1/2 bg-gradient-to-br from-red-100 to-red-50 items-center justify-center p-8">
          <h2 className="text-3xl font-bold text-[#F53838] text-center leading-snug">
            Welcome back to <br />
            <span className="text-gray-800">LaslesVPN</span>
          </h2>
          <Link
            to="/"
            className="absolute top-6 right-6 text-sm text-[#F53838] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* right login form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Login</h2>
          <p className="text-sm text-gray-500 mb-6">
            Enter your credentials to access your account
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F53838] focus:border-[#F53838] outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#F53838] focus:border-[#F53838] outline-none"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#F53838] text-white py-2 rounded-md hover:bg-red-600 transition"
            >
              Sign in
            </button>
          </form>
          <p className="mt-6 text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#F53838] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
