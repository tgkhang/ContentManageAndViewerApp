// This context is used to manage authentication state using JWT (JSON Web Tokens).

import { createContext, useEffect, useReducer, type ReactNode } from "react";
import { isValidToken, setSession } from "../utils/jwt";
import { validateAPI } from "../utils/api";
import type { User } from "../types/user";

interface AuthState {
  isAuthenticated: boolean; // login status
  isInitialized: boolean; // delay rendering until the check is complete
  user: User | null; // user data or null if not login
}

// initial state when app first loads
const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

// Action Types reducer handle
type AuthAction =
  // fisrt load
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: User | null };
    }
  // after login
  | {
      type: "LOGIN";
      payload: { user: User };
    }
  | {
      type: "LOGOUT";
    };

/*
INITIALIZE - On app startup

Checks if token exists in localStorage
Validates token with backend
Sets initial auth state


LOGIN - After successful login

Saves token
Stores user data
Updates state to authenticated


LOGOUT - When user logs out

Removes token
Clears user data
Updates state to not authenticated
*/

//map of action types to functions
const handlers: Record<
  AuthAction["type"],
  (state: AuthState, action: AuthAction) => AuthState //function take state and action and return new state
> = {
  INITIALIZE: (state, action) => {
    if (action.type !== "INITIALIZE") return state;
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    if (action.type !== "LOGIN") return state;
    const { user } = action.payload;
    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
};

const reducer = (state: AuthState, action: AuthAction): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// ----------------------------------------------------------------------

interface AuthContextType extends AuthState {
  method: "jwt";
  login: (accessToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  method: "jwt",
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await validateAPI();

          // Create user object from /auth/me response
          const user: User = {
            id: response.data.userId,
            name: response.data.name || response.data.username,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
            createdAt: response.data.createdAt || "",
            updatedAt: response.data.updatedAt || "",
          };

          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: "INITIALIZE",
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: "INITIALIZE",
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  const login = async (accessToken: string, user: User): Promise<void> => {
    setSession(accessToken);
    dispatch({
      type: "LOGIN",
      payload: { user },
    });
  };

  const logout = async (): Promise<void> => {
    setSession(null);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
