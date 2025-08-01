import { create } from 'zustand';
import supabase from "@/lib/supabase/client";

// Error type definitions for better type safety
interface AuthError extends Error {
  message: string;
  status?: number;
  code?: string;
}

interface SupabaseAuthError {
  message: string;
  status?: number;
  statusCode?: number;
  error?: string;
  error_description?: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: 'google' | 'github') => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  checkSession: () => Promise<void>;
  // Funções de redefinição de senha
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
  // Função para atualizar dados do usuário
  refreshUser: () => Promise<void>;
  // Função para atualizar dados do usuário no estado
  updateUser: (userData: Partial<User>) => void;
  // Função para reenviar confirmação de email
  resendEmailConfirmation: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      console.log('🔑 Iniciando processo de login para:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('📋 Resposta do login:', { data, error });

      if (error) {
        console.error('❌ Erro de autenticação:', error);
        throw new Error(error.message);
      }      if (data.user) {
        console.log('✅ Login bem-sucedido para usuário:', data.user.id);
        
        try {
          // Buscar dados completos do perfil via API após login
          console.log('📊 Buscando perfil completo via API após login...');
          const response = await fetch('/api/user/role', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            console.log('✅ Perfil obtido via API após login:', profileData.profile);

            const userProfile: User = {
              id: profileData.profile.id,
              email: profileData.profile.email,
              name: profileData.profile.name,
              role: profileData.profile.role,
              email_verified: profileData.profile.email_verified,
              created_at: profileData.profile.created_at,
              updated_at: profileData.profile.updated_at,
            };

            console.log('📋 Perfil completo do usuário criado:', userProfile);

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.error('❌ Erro ao buscar perfil via API:', response.status);
            
            // Fallback: usar dados básicos do Supabase
            const userName = data.user.user_metadata?.name || 
                            data.user.user_metadata?.full_name ||
                            data.user.user_metadata?.display_name ||
                            null;
            
            const userProfile: User = {
              id: data.user.id,
              email: data.user.email!,
              name: userName,
              role: 'USER',
              email_verified: !!data.user.email_confirmed_at,
              created_at: data.user.created_at,
              updated_at: data.user.updated_at || data.user.created_at,
            };

            console.log('⚠️ Usando perfil fallback após login:', userProfile);

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (apiError) {
          console.error('❌ Erro ao buscar perfil via API:', apiError);
          
          // Fallback em caso de erro
          const userName = data.user.user_metadata?.name || 
                          data.user.user_metadata?.full_name ||
                          data.user.user_metadata?.display_name ||
                          null;
          
          const userProfile: User = {
            id: data.user.id,
            email: data.user.email!,
            name: userName,
            role: 'USER',
            email_verified: !!data.user.email_confirmed_at,
            created_at: data.user.created_at,
            updated_at: data.user.updated_at || data.user.created_at,
          };

          console.log('⚠️ Usando perfil fallback devido a erro:', userProfile);

          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
          });
        }
        
        console.log('✅ Estado de autenticação atualizado');
      } else {
        throw new Error('Dados do usuário não retornados pelo servidor');
      }    } catch (error: unknown) {
      console.error('❌ Erro no processo de login:', error);
      set({ isLoading: false });
      // Melhorar mensagens de erro em português
      let mensagemErro = 'Erro ao fazer login. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message?.includes('Invalid login credentials')) {
          mensagemErro = 'Credenciais inválidas. Verifique seu e-mail e senha.';
        } else if (error.message?.includes('Email not confirmed')) {
          mensagemErro = 'E-mail não confirmado. Verifique sua caixa de entrada e clique no link de confirmação.';          // Armazenar o email para poder reenviar confirmação
          if (typeof window !== 'undefined') {
            localStorage.setItem('unconfirmed_email', email);
          }
        } else if (error.message?.includes('Too many requests')) {
          mensagemErro = 'Muitas tentativas de login. Aguarde alguns minutos.';
        } else if (error.message?.includes('User not found')) {
          mensagemErro = 'Usuário não encontrado. Verifique seu e-mail.';
        } else if (error.message) {
          mensagemErro = error.message;
        }
      }
      
      throw new Error(mensagemErro);
    }
  },

  loginWithProvider: async (provider: 'google' | 'github') => {
    set({ isLoading: true });
    try {
      console.log('🔗 Iniciando login OAuth com:', provider);
        const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error('❌ Erro OAuth:', error);
        throw new Error(`Erro ao conectar com ${provider}: ${error.message}`);
      }
      
      console.log('✅ Redirecionamento OAuth iniciado para:', provider);
      // A página será redirecionada, então não resetamos isLoading aqui
        } catch (error: unknown) {
      console.error('❌ Erro no login OAuth:', error);
      set({ isLoading: false });
      
      let mensagemErro = `Erro ao fazer login com ${provider}`;
      if (error instanceof Error) {
        if (error.message?.includes('Popup')) {
          mensagemErro = 'Popup bloqueado. Permita popups para este site.';
        } else if (error.message?.includes('cancelled')) {
          mensagemErro = 'Login cancelado pelo usuário.';
        } else if (error.message) {          mensagemErro = error.message;
        }
      }
      
      throw new Error(mensagemErro);
    }
  },

  logout: async () => {
    try {
      console.log('👋 Iniciando logout do usuário...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Erro no logout:', error);
        throw error;
      }

      console.log('✅ Logout realizado com sucesso');
      
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    } catch (error: unknown) {
      console.error('❌ Erro no processo de logout:', error);
      throw error;
    }
  },

  register: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      console.log('🚀 Iniciando cadastro do usuário:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,        options: {
          data: { 
            name: name,
            full_name: name
          },
          emailRedirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/confirm-email`
        },
      });

      console.log('📋 Resposta do cadastro:', { data, error });

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        throw new Error(error.message);
      }

      if (data.user) {
        console.log('✅ Usuário criado:', data.user.id);
        console.log('📧 Email confirmado?', !!data.user.email_confirmed_at);
        
        const userProfile: User = {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          role: 'USER',
          email_verified: !!data.user.email_confirmed_at,
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        };

        // Se há uma sessão ativa (email já confirmado), marcar como autenticado
        if (data.session && data.user.email_confirmed_at) {
          console.log('✅ Usuário automaticamente confirmado');
          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // Se não há sessão (precisa confirmar email), não autenticar ainda
          console.log('📧 Usuário precisa confirmar email');
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
        
        console.log('✅ Cadastro concluído!');
      } else {
        throw new Error('Erro interno: dados do usuário não retornados');
      }    } catch (error: unknown) {
      console.error('❌ Erro no registro:', error);
      set({ isLoading: false });
      
      let mensagemErro = 'Erro ao criar conta. Tente novamente.';
      
      if (error instanceof Error) {
        if (error.message?.includes('already registered')) {
          mensagemErro = 'Este e-mail já está registrado. Tente fazer login.';
        } else if (error.message?.includes('Invalid email')) {
          mensagemErro = 'E-mail inválido. Verifique se está correto.';        } else if (error.message?.includes('Password should be')) {
          mensagemErro = 'A senha deve ter pelo menos 6 caracteres.';
        } else if (error.message) {
          mensagemErro = error.message;
        }
      }
      
      throw new Error(mensagemErro);
    }
  },

  checkSession: async () => {
    try {
      console.log('🔍 Verificando sessão ativa...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;

      if (session?.user) {
        console.log('🔍 CheckSession - Sessão encontrada para usuário:', session.user.id);
        
        try {
          // Buscar dados completos do perfil via API
          console.log('� Buscando perfil completo via API...');
          const response = await fetch('/api/user/role', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            console.log('✅ Perfil obtido via API:', profileData.profile);

            const userProfile: User = {
              id: profileData.profile.id,
              email: profileData.profile.email,
              name: profileData.profile.name,
              role: profileData.profile.role,
              email_verified: profileData.profile.email_verified,
              created_at: profileData.profile.created_at,
              updated_at: profileData.profile.updated_at,
            };

            console.log('🔍 CheckSession - Perfil completo criado:', userProfile);

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            console.error('❌ Erro ao buscar perfil via API:', response.status);
            
            // Fallback: criar perfil básico dos metadados da sessão
            const userName = session.user.user_metadata?.name || 
                            session.user.user_metadata?.full_name ||
                            session.user.user_metadata?.display_name ||
                            session.user.user_metadata?.given_name ||
                            session.user.user_metadata?.first_name ||
                            null;

            const userProfile: User = {
              id: session.user.id,
              email: session.user.email!,
              name: userName,
              role: 'USER',
              email_verified: !!session.user.email_confirmed_at,
              created_at: session.user.created_at,
              updated_at: session.user.updated_at || session.user.created_at,
            };

            console.log('⚠️ Usando perfil fallback:', userProfile);

            set({
              user: userProfile,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (apiError) {
          console.error('❌ Erro ao buscar perfil via API:', apiError);
          
          // Fallback em caso de erro
          const userName = session.user.user_metadata?.name || 
                          session.user.user_metadata?.full_name ||
                          session.user.user_metadata?.display_name ||
                          null;

          const userProfile: User = {
            id: session.user.id,
            email: session.user.email!,
            name: userName,
            role: 'USER',
            email_verified: !!session.user.email_confirmed_at,
            created_at: session.user.created_at,
            updated_at: session.user.updated_at || session.user.created_at,
          };

          set({
            user: userProfile,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      } else {
        console.log('🔍 CheckSession - Nenhuma sessão ativa');
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('❌ Erro no checkSession:', error);
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  // Funções de redefinição de senha
  resetPassword: async (email: string) => {
    try {
      console.log('📧 Enviando e-mail de redefinição para:', email);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/reset-password`,
      });

      if (error) {
        console.error('❌ Erro ao enviar e-mail de redefinição:', error);
        throw new Error(error.message);
      }      console.log('✅ E-mail de redefinição enviado com sucesso');
    } catch (error: unknown) {
      console.error('❌ Erro no processo de redefinição:', error);
      throw error;
    }
  },

  updatePassword: async (newPassword: string) => {
    try {
      console.log('🔒 Atualizando senha do usuário...');
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('❌ Erro ao atualizar senha:', error);
        throw new Error(error.message);
      }      console.log('✅ Senha atualizada com sucesso');
    } catch (error: unknown) {
      console.error('❌ Erro na atualização da senha:', error);
      throw error;
    }
  },

  refreshUser: async () => {
    try {
      console.log('🔄 Atualizando dados do usuário...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.error('❌ Erro ao obter dados do usuário:', error);
        return;
      }

      if (user) {
        try {
          // Buscar dados completos do perfil via API
          console.log('📊 Buscando perfil atualizado via API...');
          const response = await fetch('/api/user/role', {
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const profileData = await response.json();
            console.log('✅ Perfil atualizado obtido via API:', profileData.profile);

            const userProfile: User = {
              id: profileData.profile.id,
              email: profileData.profile.email,
              name: profileData.profile.name,
              role: profileData.profile.role,
              email_verified: profileData.profile.email_verified,
              created_at: profileData.profile.created_at,
              updated_at: profileData.profile.updated_at,
            };

            set({ user: userProfile });
            console.log('✅ Dados do usuário atualizados com sucesso via API');
          } else {
            console.error('❌ Erro ao buscar perfil atualizado via API:', response.status);
            
            // Fallback: usar dados básicos do Supabase
            const userName = user.user_metadata?.name || 
                            user.user_metadata?.full_name ||
                            user.user_metadata?.display_name ||
                            null;
            
            const userProfile: User = {
              id: user.id,
              email: user.email!,
              name: userName,
              role: 'USER',
              email_verified: !!user.email_confirmed_at,
              created_at: user.created_at,
              updated_at: user.updated_at || user.created_at,
            };

            set({ user: userProfile });
            console.log('⚠️ Dados do usuário atualizados com fallback');
          }
        } catch (apiError) {
          console.error('❌ Erro ao buscar perfil atualizado via API:', apiError);
          
          // Fallback em caso de erro
          const userName = user.user_metadata?.name || 
                          user.user_metadata?.full_name ||
                          user.user_metadata?.display_name ||
                          null;
          
          const userProfile: User = {
            id: user.id,
            email: user.email!,
            name: userName,
            role: 'USER',
            email_verified: !!user.email_confirmed_at,
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
          };

          set({ user: userProfile });
          console.log('⚠️ Dados do usuário atualizados com fallback devido a erro');
        }
      }    } catch (error: unknown) {
      console.error('❌ Erro na atualização dos dados do usuário:', error);
    }
  },

  // Função para reenviar confirmação de email
  resendEmailConfirmation: async (email: string) => {
    try {
      console.log('📧 Reenviando confirmação de e-mail para:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('❌ Erro ao reenviar confirmação:', error);
        throw new Error(error.message);
      }

      console.log('✅ E-mail de confirmação reenviado com sucesso');    } catch (error: unknown) {
      console.error('❌ Erro no reenvio de confirmação:', error);
      
      let mensagemErro = 'Erro ao reenviar confirmação de e-mail.';
      
      if (error instanceof Error) {
        if (error.message?.includes('rate limit')) {
          mensagemErro = 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
        } else if (error.message?.includes('not found')) {
          mensagemErro = 'E-mail não encontrado. Verifique se está correto.';
        } else if (error.message) {
          mensagemErro = error.message;
        }
      }
      
      throw new Error(mensagemErro);
    }
  },
  // Função para atualizar dados do usuário no estado
  updateUser: (userData: Partial<User>) => {
    set((state: AuthState) => ({
      user: state.user ? { ...state.user, ...userData } : null
    }));
  },
}));
