import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatSessionProvider } from "./contexts/ChatSessionContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ChatSessionProvider>
          <App />
        </ChatSessionProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
