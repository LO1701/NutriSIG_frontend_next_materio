import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../../services/auth/authService';
import { parseCookies } from 'nookies';
import { tokenService } from '../../services/auth/tokenService';

const initialSettings = {
  id: null,
  nome: '',
  email: '',
  role: ''
}

export const AuthContext = createContext({
  user: initialSettings, 
 });

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(initialSettings)

  const isAuthenticated = !!user;

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

  useEffect(async (ctx) => {

    const token = tokenService.get(ctx)

    if (token) {
      const session = await authService.getSession(ctx)
      setUser(session.body)  
    }
  }, [])

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