"use client";

import { useAuth } from "../lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "student" | "admin";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("🔐 ProtectedRoute useEffect:", {
      loading,
      user: !!user,
      profile: !!profile,
      requiredRole,
    });

    if (!loading) {
      if (!user) {
        console.log("❌ No user, redirecting to login");
        router.push("/");
        return;
      }

      if (requiredRole && profile?.role !== requiredRole) {
        console.log("❌ Wrong role:", {
          required: requiredRole,
          actual: profile?.role,
        });
        // Yanlış role - doğru sayfaya yönlendir
        if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
        return;
      }

      console.log("✅ Access granted");
    }
  }, [user, profile, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <i className="ri-trophy-line text-white text-2xl"></i>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">LGS Liga</h2>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user || (requiredRole && profile?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
