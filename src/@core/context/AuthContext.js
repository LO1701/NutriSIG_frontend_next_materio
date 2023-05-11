import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../../services/auth/authService';
import { parseCookies } from 'nookies';

export const AuthContext = createContext({ undefined });

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState({
    id: null,
    nome: '',
    email: '',
    role: ''
  })

  const isAuthenticated = !!user;

  useEffect(async (ctx) => {
    const { 'ACCESS_TOKEN': token } = parseCookies()

    if (token) {
      const session = await authService.getSession(ctx)

      setUser(session.body)
    }    
  }, [])

  const signIn = async (email, senha) => {
    await authService.login({
        email: email,
        senha: senha
    })

    const session = await authService.getSession()

    setUser(session.body)
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        signUp
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);