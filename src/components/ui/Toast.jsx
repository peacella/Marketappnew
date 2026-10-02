import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig = {
  success: { icon: CheckCircle, bg: 'bg-brand-green', text: 'text-white' },
  error: { icon: XCircle, bg: 'bg-red-500', text: 'text-white' },
  info: { icon: Info, bg: 'bg-brand-orange', text: 'text-white' },
};

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => {
            const config = toastConfig[toast.type] || toastConfig.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={toast.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 100, opacity: 0 }}
                className={`${config.bg} ${config.text} px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 min-w-[280px] max-w-[400px]`}
              >
                <Icon size={20} className="shrink-0" />
                <span className="text-sm font-medium flex-1">{toast.message}</span>
                <button
                  onClick={() => dismissToast(toast.id)}
                  className="shrink-0 hover:opacity-70 transition-opacity"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
