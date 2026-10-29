import { Platform } from 'react-native';

/**
 * Nutriverse Mobile API Client
 * 
 * Configured to connect to the FastAPI backend (backend/app/main.py).
 * Default hosts:
 *  - iOS Simulator: http://localhost:8000/api
 *  - Android Emulator: http://10.0.2.2:8000/api
 *  - Physical Device (Expo Go): Replace with your development machine's LAN IP (e.g., http://192.168.1.X:8000/api)
 */

export const DEFAULT_API_HOST =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000'
    : 'http://localhost:8000';

let customApiHost: string | null = null;
let authToken: string | null = null;

export const setApiHost = (host: string) => {
  customApiHost = host;
};

export const getApiHost = () => customApiHost || DEFAULT_API_HOST;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const getAuthToken = () => authToken;

// Generic fetch wrapper with timeout and fallback
async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  fallbackData?: T
): Promise<{ data: T; isFallback: boolean; error?: string }> {
  const url = `${getApiHost()}/api${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    const data = await res.json();
    return { data, isFallback: false };
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.warn(`[Nutriverse API] Request to ${url} failed: ${err.message}. Using fallback.`);
    if (fallbackData !== undefined) {
      return { data: fallbackData, isFallback: true, error: err.message };
    }
    throw err;
  }
}

// ── Health Check ──
export const checkBackendHealth = async (): Promise<{
  connected: boolean;
  version?: string;
  host: string;
}> => {
  try {
    const res = await request<{ message: string; version: string; data_mode: string }>('', {
      method: 'GET',
    });
    return {
      connected: !res.isFallback,
      version: res.data?.version,
      host: getApiHost(),
    };
  } catch {
    return {
      connected: false,
      host: getApiHost(),
    };
  }
};

// ── Auth Service ──
export interface AuthUser {
  id?: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  access_token?: string;
  user: AuthUser;
}

export const AuthService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await request<AuthResponse>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      },
      {
        token: 'mock-jwt-token-riya',
        access_token: 'mock-jwt-token-riya',
        user: {
          id: 'user-riya-01',
          name: 'Riya Sharma',
          email: credentials.email,
        },
      }
    );
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  register: async (userData: { name: string; email: string; password: string }) => {
    const res = await request<AuthResponse>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(userData),
      },
      {
        token: 'mock-jwt-token-registered',
        access_token: 'mock-jwt-token-registered',
        user: {
          id: 'user-new-' + Date.now(),
          name: userData.name,
          email: userData.email,
        },
      }
    );
    if (res.data?.token) {
      setAuthToken(res.data.token);
    }
    return res;
  },

  logout: () => {
    setAuthToken(null);
  },
};

// ── Meal Plans ──
export interface BackendMealPlanItem {
  recipe_id: string;
  name: string;
  calories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meal_type: string;
  day?: string;
}

export const MealPlanService = {
  // Get active meal plan
  getMealPlan: async () => {
    return request(
      '/meal-plan',
      { method: 'GET' },
      {
        user_id: 'guest-riya',
        items: [
          {
            recipe_id: 'moong-dal-chilla',
            name: 'Moong Dal Chilla',
            calories: 350,
            macros: { protein: 18, carbs: 45, fat: 12 },
            meal_type: 'Breakfast',
          },
          {
            recipe_id: 'greek-yogurt-bowl',
            name: 'Greek Yogurt Bowl',
            calories: 200,
            macros: { protein: 12, carbs: 18, fat: 8 },
            meal_type: 'Mid-morning',
          },
          {
            recipe_id: 'quinoa-buddha-bowl',
            name: 'Quinoa Buddha Bowl',
            calories: 420,
            macros: { protein: 18, carbs: 52, fat: 14 },
            meal_type: 'Lunch',
          },
          {
            recipe_id: 'masala-buttermilk',
            name: 'Masala Buttermilk',
            calories: 120,
            macros: { protein: 6, carbs: 14, fat: 4 },
            meal_type: 'Evening Snack',
          },
          {
            recipe_id: 'paneer-stir-fry',
            name: 'Paneer & Vegetable Stir Fry',
            calories: 400,
            macros: { protein: 22, carbs: 48, fat: 16 },
            meal_type: 'Dinner',
          },
        ],
      }
    );
  },

  // Save or update meal plan
  saveMealPlan: async (items: BackendMealPlanItem[]) => {
    return request(
      '/meal-plan',
      {
        method: 'POST',
        body: JSON.stringify({ items }),
      },
      { success: true, updated_items: items.length }
    );
  },

  // Swap a meal for an alternative candidate
  swapMeal: async (currentRecipeId: string, mealType?: string) => {
    return request(
      '/meal-plan/swap',
      {
        method: 'POST',
        body: JSON.stringify({ current_recipe_id: currentRecipeId, meal_type: mealType }),
      },
      {
        candidates: [
          {
            id: 'tofu-scramble',
            title: 'Tofu & Vegetable Scramble',
            calories: 340,
            macros: { protein: 20, carbs: 22, fat: 14 },
          },
          {
            id: 'besan-chilla',
            title: 'Besan & Spinach Chilla',
            calories: 330,
            macros: { protein: 16, carbs: 40, fat: 10 },
          },
        ],
      }
    );
  },
};

// ── Goal Setting & User Profile ──
export const ProfileService = {
  getProfile: async () => {
    return request(
      '/users/profile',
      { method: 'GET' },
      {
        name: 'Riya Sharma',
        age: 26,
        height_cm: 165,
        weight_kg: 65,
        activity_level: 'moderately_active',
        health_goal: 'Hormonal balance',
        conditions: ['PCOS'],
      }
    );
  },

  updateProfile: async (profileData: any) => {
    return request(
      '/users/profile',
      {
        method: 'PUT',
        body: JSON.stringify(profileData),
      },
      { success: true, profile: profileData }
    );
  },
};

// ── Tracking Service ──
export const TrackingService = {
  logMeal: async (mealData: { recipe_id: string; meal_type: string; calories: number }) => {
    return request(
      '/tracking/meal',
      {
        method: 'POST',
        body: JSON.stringify(mealData),
      },
      { success: true, logged_at: new Date().toISOString() }
    );
  },

  getDailySummary: async (dateStr?: string) => {
    return request(
      `/tracking/daily-summary${dateStr ? `?date=${dateStr}` : ''}`,
      { method: 'GET' },
      {
        total_calories: 1490,
        target_calories: 2000,
        macros: {
          protein: 76,
          carbs: 177,
          fat: 52,
        },
      }
    );
  },
};

