"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    setErrorMsg("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Registration failed");
      }

      // Save token to localStorage and cookie
      localStorage.setItem("token", json.token);
      document.cookie = `token=${json.token}; path=/; max-age=86400`; // 1 day

      router.push("/");
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Create an account</h1>
      {errorMsg && <p className="text-red-500 mb-4 text-center">{errorMsg}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: "Password is required" })}
            className="w-full border p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
      </p>
    </div>
  );
}
