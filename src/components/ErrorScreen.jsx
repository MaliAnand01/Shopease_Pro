import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ErrorScreen = ({ message = "Something went wrong", error }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const copyError = () => {
    if (error) {
      navigator.clipboard.writeText(error.stack || error.message);
      // Assuming 'toast' is imported or globally available, e.g., from react-toastify
      // import { toast } from 'react-toastify';
      // toast.success("Error details copied to clipboard!");
      alert("Error details copied to clipboard!"); // Fallback if toast is not available
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-black dark:text-white px-8 transition-colors duration-500">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl"
      >
        <div className="mb-12 inline-block">
          <motion.div
            initial={{ rotate: -15, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="p-8 border-2 border-black dark:border-white rounded-[2rem]"
          >
            <AlertTriangle size={48} className="text-black dark:text-white" />
          </motion.div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40 mb-6">System Alert</p>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.8] mb-8">
          Critical <br />
          <span className="italic font-light opacity-50">Interruption</span>
        </h1>
        
        <p className="text-xl font-medium opacity-60 mb-12 max-w-md mx-auto leading-relaxed">
          {message}
        </p>

        {error && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            className="mb-12 p-6 border border-black/10 dark:border-white/10 rounded-2xl bg-black/5 dark:bg-white/5 text-left overflow-hidden hidden md:block"
          >
            <p className="text-[10px] font-mono whitespace-pre-wrap truncate max-h-24">
              {error.stack || error.message}
            </p>
          </motion.div>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="btn-premium px-12 !py-6 !bg-black !text-white dark:!bg-white dark:!text-black"
          >
            Refresh Interface
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/")}
            className="btn-premium px-12 !py-6 bg-transparent border-2 border-black dark:border-white text-black dark:text-white"
          >
            Return Home
          </motion.button>
        </div>

        {error && (
          <button 
            onClick={copyError}
            className="mt-12 text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
          >
            Report Technical Issue
          </button>
        )}
      </motion.div>
    </div>
  );
};

export default ErrorScreen;
