import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ID, Models } from "appwrite";
import { APPWRITE_CLIENT } from "@/lib/appwrite";

const { account } = APPWRITE_CLIENT;

const ERROR_TIMEOUT = 8000;

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    department: string,
    employment_status: string,
    role?: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,
      session: null,

      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });

          await account.createEmailPasswordSession(email, password);

          const session = await account.getSession("current");
          const user = await account.get();

          set({ user, isLoading: false, session });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });

          setTimeout(() => {
            set({ error: null });
          }, ERROR_TIMEOUT);
        }
      },

      register: async (
        email,
        password,
        name,
        department,
        employment_status,
        role = "developer"
      ) => {
        try {
          set({ isLoading: true, error: null });
          await account.create(ID.unique(), email, password, name);
          await account.createEmailPasswordSession(email, password);
          const session = await account.getSession("current");
          await account.updatePrefs({
            roles: role,
            department: department,
            employment_status: employment_status,
          });

          const user = await account.get();

          set({ user, isLoading: false, session });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });

          setTimeout(() => {
            set({ error: null });
          }, ERROR_TIMEOUT);
        }
      },

      logout: async () => {
        try {
          set({ isLoading: true, error: null });

          await account.deleteSession("current");
          set({ user: null, isLoading: false, session: null });
        } catch (error) {
          set({ error: (error as Error).message, isLoading: false });

          setTimeout(() => {
            set({ error: null });
          }, ERROR_TIMEOUT);
        }
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });

          const user = await account.get();
          const session = await account.getSession("current");

          set({ user, session });
        } catch (error) {
          console.error("Couldn't get user", (error as Error).message);
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: "project-manager",
      partialize: (state) => ({
        session: state.session,
      }),
    }
  )
);
