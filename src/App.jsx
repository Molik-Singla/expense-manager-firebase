import React, { useState } from "react";

// 👉 -------------------------------- Components ----------------------------------- //
import { AuthPage, HomePage } from "./pages";
import { ProtectedRoute } from "./routes";
import { Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <section>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/auth" element={<AuthPage />} />

                <Route
                    path="*"
                    element={<div className="flex items-center justify-center w-full h-screen text-4xl">404 Not Found</div>}
                />
            </Routes>
        </section>
    );
};

export default App;
