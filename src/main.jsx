import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import App from "./App.jsx";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "./components/ui/sonner";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>

      <App />
      </PersistGate>
    </Provider>
    <Toaster richColors position="top-right" />
  </StrictMode>
);
