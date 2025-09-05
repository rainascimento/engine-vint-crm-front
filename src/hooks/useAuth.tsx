
import { api } from '@/lib/api';
import { useState, useEffect, createContext, useContext } from 'react';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  user_metadata?: any;
}

interface Session {
  user: User;
  access_token: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock auth session
    const mockUser: User = {
      id: '6',
      email: 'caetanopark@gmail.com',
      user_metadata: { full_name: 'Usuário Demo' }
    };

    const mockSession: Session = {
      user: mockUser,
      access_token: 'mock-token'
    };

    setUser(mockUser);
    setSession(mockSession);
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {

        const mockUser: User = {
        id: '6',
        email,
        user_metadata: { full_name: 'Usuário Demo' }
      };

      const mockSession: Session = {
        user: mockUser,
        access_token: 'mock-token'
      };
      

      setUser(mockUser);
      setSession(mockSession);
      toast.success('Login realizado com sucesso!');

      return { error: null };

    const user = await api.get(`/usuarios/search/?q=${email}`)
    console.log(user, "teste user")

    if (user.senha_acesso == password) {


    } else {

      toast.message('Credenciais incorretas')
      return { error: null };
    }







  };

  const signUp = async (email: string, password: string, fullName?: string) => {


    const userData = {
      nome_usuario: fullName,
      email: email,
      senha_acesso: password,
      perfil_id: 4,
      funcao_id: 9,
      status_id: 1,
      ultimo_acesso: null,
      foto_avatar: null
    };
    // Mock signup
    const response = await api.post('/usuarios', userData);

    toast.success('Conta criada! Verifique seu e-mail para confirmar.');

    return { error: null };
  };

  const signOut = async () => {
    // Mock logout
    await new Promise(resolve => setTimeout(resolve, 500));

    setUser(null);
    setSession(null);
    toast.success('Logout realizado com sucesso!');
  };

  const resetPassword = async (email: string) => {
    // Mock password reset
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('E-mail de recuperação enviado!');

    return { error: null };
  };

  const updatePassword = async (password: string) => {
    // Mock password update
    await new Promise(resolve => setTimeout(resolve, 1000));

    toast.success('Senha atualizada com sucesso!');

    return { error: null };
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
