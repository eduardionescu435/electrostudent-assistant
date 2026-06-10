import { create } from "zustand";

export interface Component {
  id: number;
  name: string;
  category: string | null;
  manufacturer: string | null;
  identification_code: string | null;
  quantity: number;
  location: string | null;
  image_url: string | null;
  datasheet_url: string | null;
  notes: string | null;
  pinout_data: any | null;
  created_at: string;
  updated_at: string;
}

interface ComponentState {
  components: Component[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
  };
  fetchComponents: (search?: string, category?: string, page?: number) => Promise<void>;
  fetchComponentById: (id: number) => Promise<Component>;
  createComponent: (data: Partial<Component> & { image?: File }) => Promise<Component>;
  updateComponent: (id: number, data: Partial<Component> & { image?: File, datasheet?: File }) => Promise<Component>;
  deleteComponent: (id: number) => Promise<void>;
}

export const useComponentStore = create<ComponentState>()((set, get) => ({
  components: [],
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  },

  fetchComponents: async (search, category, page = 1) => {
    set({ isLoading: true, error: null });
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      params.append("page", page.toString());
      params.append("per_page", "10");
      
      const response = await fetch(`/api/components?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch components");
      
      const data = await response.json();
      set({ 
        components: data.components || [], 
        pagination: {
          total: data.total || 0,
          page: data.page || 1,
          per_page: data.per_page || 10,
          total_pages: data.total_pages || 1
        },
        isLoading: false 
      });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchComponentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/components/${id}`);
      if (!response.ok) throw new Error("Component not found");
      const data = await response.json();
      set({ isLoading: false });
      return data;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  createComponent: async (dataWithImage) => {
    set({ isLoading: true, error: null });
    try {
      const { image, ...data } = dataWithImage;
      const formData = new FormData();
      
      if (image) formData.append("image", image);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch("/api/components", {
        method: "POST",
        body: formData, // fetch sets content-type automatically for FormData
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create component");
      }
      
      const newComponent = await response.json();
      // Re-fetch to sync pagination and total count
      const state = get();
      await state.fetchComponents("", "", state.pagination.page);
      return newComponent;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateComponent: async (id, dataWithFiles) => {
    set({ isLoading: true, error: null });
    try {
      const { image, datasheet, ...data } = dataWithFiles;
      const formData = new FormData();
      
      if (image) formData.append("image", image);
      if (datasheet) formData.append("datasheet", datasheet);
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/components/${id}`, {
        method: "PATCH",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to update component");
      }
      
      const updatedComponent = await response.json();
      // Re-fetch to ensure any changes affecting search/filter/pagination are reflected
      const state = get();
      await state.fetchComponents("", "", state.pagination.page);
      return updatedComponent;
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  deleteComponent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/components/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to delete component");
      }
      
      // Re-fetch to update paginated list
      const state = get();
      await state.fetchComponents("", "", state.pagination.page);
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
