import {
  createContext,
  useEffect,
  useReducer,
  ReactNode,
  Dispatch,
} from "react";
import { isValidToken, setSession } from "../utils/jwt";
import axiosInstance from "../utils/axios";

// ----------------------------------------------------------------------

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

// Action Types
type AuthAction =
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: User | null };
    }
  | {
      type: "LOGIN";
      payload: { user: User };
    }
  | {
      type: "LOGOUT";
    };

const handlers: Record<
  AuthAction["type"],
  (state: AuthState, action: AuthAction) => AuthState
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
          const response = await axiosInstance.get<User>(
            `/auth/get-account-by-token?accessToken=${accessToken}`
          );
          const user = response.data;

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
