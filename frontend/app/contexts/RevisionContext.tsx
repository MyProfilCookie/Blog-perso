import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RevisionError {
  _id: string;
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
  date: string;
}

interface RevisionContextType {
  errors: RevisionError[];
  addError: (error: RevisionError) => void;
  removeError: (id: string) => void;
  clearErrors: () => void;
}

const RevisionContext = createContext<RevisionContextType | undefined>(undefined);

export const useRevision = () => {
  const context = useContext(RevisionContext);
  if (context === undefined) {
    throw new Error('useRevision must be used within a RevisionProvider');
  }
  return context;
};

interface RevisionProviderProps {
  children: ReactNode;
}

export const RevisionProvider: React.FC<RevisionProviderProps> = ({ children }) => {
  const [errors, setErrors] = useState<RevisionError[]>([]);

  const addError = (error: RevisionError) => {
    setErrors(prev => [...prev, error]);
  };

  const removeError = (id: string) => {
    setErrors(prev => prev.filter(error => error._id !== id));
  };

  const clearErrors = () => {
    setErrors([]);
  };

  return (
    <RevisionContext.Provider value={{ errors, addError, removeError, clearErrors }}>
      {children}
    </RevisionContext.Provider>
  );
}; 