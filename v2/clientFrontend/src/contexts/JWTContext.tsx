import { createContext, useEffect, useReducer, type ReactNode } from "react";
import { isValidToken, setSession } from "../utils/jwt";
import { validateAPI, getCurrentUserProfileAPI } from "../utils/api";
import type { User } from "../types/user";

interface AuthState {
  isAuthenticated: boolean; //login status
  isInitialized: boolean; //delay rendering until the check is complete
  user: User | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

// Action Types reducer handle
type AuthAction =
  //fisrt load
  | {
      type: "INITIALIZE";
      payload: { isAuthenticated: boolean; user: User | null };
    }
  //    after login
  | {
      type: "LOGIN";
      payload: { user: User };
    }
  | {
      type: "LOGOUT";
    }
  | {
      type: "UPDATE_USER";
      payload: { user: User };
    };

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
  UPDATE_USER: (state, action) => {
    if (action.type !== "UPDATE_USER") return state;
    const { user } = action.payload;
    return {
      ...state,
      user,
    };
  },
};

const reducer = (state: AuthState, action: AuthAction): AuthState =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

// ----------------------------------------------------------------------

interface AuthContextType extends AuthState {
  method: "jwt";
  login: (accessToken: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  method: "jwt",
  login: async () => {},
  logout: async () => {},
  setUser: () => {},
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

          // Validate token first
          const response = await validateAPI();

          // Try to fetch fresh user data from database
          let user: User;
          try {
            const profileResponse = await getCurrentUserProfileAPI();
            const userData = profileResponse.data;

            // Create user object from database data
            user = {
              id: userData._id || userData.id,
              name: userData.name,
              username: userData.username,
              email: userData.email,
              role: userData.role,
              createdAt: userData.createdAt || "",
              updatedAt: userData.updatedAt || "",
            };
          } catch (profileError) {
            // Fallback to JWT payload if database fetch fails
            console.warn("Failed to fetch profile from database, using JWT payload:", profileError);
            user = {
              id: response.data.userId,
              name: response.data.name || response.data.username,
              username: response.data.username,
              email: response.data.email,
              role: response.data.role,
              createdAt: response.data.createdAt || "",
              updatedAt: response.data.updatedAt || "",
            };
          }

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

  const setUser = (user: User): void => {
    dispatch({
      type: "UPDATE_USER",
      payload: { user },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: "jwt",
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
