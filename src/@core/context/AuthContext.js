// import { Children, createContext } from "react";

// export const AuthContext = createContext({})

// export function AuthProvider({Children}) {

//     const isAuthenticaded = false

//     return (
//         <AuthContext.Provider value={{ isAuthenticaded }}>
//             {Children}
//         </AuthContext.Provider>
//     )
// }

import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { authService } from '../../services/auth/authService';

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;

  const signIn = async (email, senha) => {
    await authService.login({
        email: email,
        senha: senha
    })
  };

  const signUp = async (email, name, password) => {
    throw new Error('Sign up is not implemented');
  };

  const isAuthenticaded = true

  return (
    <AuthContext.Provider
      value={{
        isAuthenticaded,
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