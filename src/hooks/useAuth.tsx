
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

const USER_STORAGE_KEY = '@Auth:User';
const SESSION_STORAGE_KEY = '@Auth:Session';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);

    if (storedUser && storedSession) {
      try {
        const loadedUser: User = JSON.parse(storedUser);
        const loadedSession: Session = JSON.parse(storedSession);
        
        // Verifica se o token ainda pode ser válido (opcional: verificar validade do token aqui)
        
        setUser(loadedUser);
        setSession(loadedSession);
        toast.success('Sessão restaurada.');
      } catch (e) {
        console.error('Erro ao parsear dados da sessão:', e);
        // Se houver erro, limpa o armazenamento para evitar loops
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    const useri = {
      email: email,
      senha_acesso: password
    };  

    try {
        const response = await fetch('http://localhost:3000/login/entrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
            },
            body: JSON.stringify(useri)
        });

        if (response.ok) {
            const data = await response.json();

            const mockUser: User = {
                id: data.usuario[0].id,
                email: data.usuario[0].email,
            };

            const mockSession: Session = {
                user: mockUser,
                access_token: data.token,
            };

            // PERSISTE NO LOCAL STORAGE
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockUser));
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(mockSession));
            
            setUser(mockUser);
            setSession(mockSession);
            toast.success('Login realizado com sucesso!');
            return { error: null };
            
        } else {
            // Se a API retornar um erro (e.g., status 401, 403)
            const errorData = await response.json();
            const errorMessage = errorData?.message || 'Erro de autenticação.';
            toast.error(errorMessage);
            return { error: { message: errorMessage } };
        }
    } catch (error: any) {
        console.error('Erro de rede/servidor:', error);
        toast.error('Não foi possível conectar ao servidor.');
        return { error: { message: error.message } };
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
    const response = await fetch('http://localhost:3000/login/cadastro', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',

    },
    body: JSON.stringify(userData)
  }).then(result => {
    if (result.ok) {


       toast.success('Conta criada! Verifique seu e-mail para confirmar.');
      return result.json()

      
    } else{
      toast.error('Erro ao criar conta. Tente novamente.');
    }
  })
    


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
