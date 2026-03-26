import { create } from "zustand";

export interface Motorcycle {
  id: string;
  name: string;
  brand: string;
  model_year: number;
  category: string;
  description: string;
  specifications: Record<string, string>;
  base_price: number;
}

export interface Part {
  id: string;
  motorcycle_id: string;
  name: string;
  category: string;
  description: string;
  detailed_info: string;
  specifications: Record<string, string>;
  price: number;
  weight: number;
  material: string;
  is_stock: boolean;
  sort_order: number;
}

export type MaterialType =
  | "matte"
  | "glossy"
  | "metallic"
  | "carbon"
  | "brushed";

export interface PartColorState {
  color: string;
  material: MaterialType;
}

export const GROUP_TO_CATEGORY: Record<string, string> = {
  engine: "engine",
  exhaust: "exhaust",
  "front-wheel": "wheels",
  "rear-wheel": "wheels",
  suspension: "suspension",
  body: "body",
  "fuel-tank": "body",
  seat: "seat",
  lights: "lights",
  handlebars: "handlebars",
  brakes: "brakes",
  frame: "engine",
  accessories: "accessories",
};

interface ConfiguratorState {
  motorcycles: Motorcycle[];
  parts: Part[];
  selectedMotorcycleId: string | null;
  selectedPartGroup: string | null;
  hoveredPartGroup: string | null;
  selectedPartData: Part | null;
  globalColor: string;
  globalMaterial: MaterialType;
  partColors: Record<string, PartColorState>;
  configName: string;
  isLeftPanelOpen: boolean;
  isRightPanelOpen: boolean;
  isShareModalOpen: boolean;
  equippedParts: string[];
  totalPrice: number;
  isLoading: boolean;
  currentConfigId: string | null;
  isDirty: boolean;

  setMotorcycles: (motos: Motorcycle[]) => void;
  setParts: (parts: Part[]) => void;
  selectMotorcycle: (id: string) => void;
  selectPartGroup: (group: string | null) => void;
  hoverPartGroup: (group: string | null) => void;
  setSelectedPartData: (part: Part | null) => void;
  setGlobalColor: (color: string) => void;
  setGlobalMaterial: (mat: MaterialType) => void;
  setPartColor: (group: string, color: string) => void;
  setPartMaterial: (group: string, mat: MaterialType) => void;
  setConfigName: (name: string) => void;
  toggleLeftPanel: () => void;
  toggleRightPanel: () => void;
  toggleShareModal: () => void;
  equipPart: (partId: string) => void;
  unequipPart: (partId: string) => void;
  calculatePrice: () => void;
  resetConfig: () => void;
  setLoading: (loading: boolean) => void;
  setCurrentConfigId: (id: string | null) => void;
  setDirty: (dirty: boolean) => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  motorcycles: [],
  parts: [],
  selectedMotorcycleId: null,
  selectedPartGroup: null,
  hoveredPartGroup: null,
  selectedPartData: null,
  globalColor: "#0066FF",
  globalMaterial: "metallic",
  partColors: {},
  configName: "",
  isLeftPanelOpen: true,
  isRightPanelOpen: true,
  isShareModalOpen: false,
  equippedParts: [],
  totalPrice: 0,
  isLoading: false,
  currentConfigId: null,
  isDirty: false,

  setMotorcycles: (motos) => set({ motorcycles: motos }),

  setParts: (parts) => set({ parts }),

  selectMotorcycle: (id) => {
    set({ selectedMotorcycleId: id });
    get().calculatePrice();
  },

  selectPartGroup: (group) => {
    if (group === null) {
      set({ selectedPartGroup: null, selectedPartData: null });
      return;
    }
    const { parts } = get();
    const category = GROUP_TO_CATEGORY[group];
    const selectedPartData =
      category !== undefined
        ? parts.find((p) => p.category === category) ?? null
        : null;
    set({ selectedPartGroup: group, selectedPartData });
  },

  hoverPartGroup: (group) => set({ hoveredPartGroup: group }),

  setSelectedPartData: (part) => set({ selectedPartData: part }),

  setGlobalColor: (color) => set({ globalColor: color, isDirty: true }),

  setGlobalMaterial: (mat) => set({ globalMaterial: mat, isDirty: true }),

  setPartColor: (group, color) =>
    set((state) => ({
      partColors: {
        ...state.partColors,
        [group]: {
          color,
          material: state.partColors[group]?.material ?? state.globalMaterial,
        },
      },
      isDirty: true,
    })),

  setPartMaterial: (group, mat) =>
    set((state) => ({
      partColors: {
        ...state.partColors,
        [group]: {
          color: state.partColors[group]?.color ?? state.globalColor,
          material: mat,
        },
      },
      isDirty: true,
    })),

  setConfigName: (name) => set({ configName: name, isDirty: true }),

  toggleLeftPanel: () =>
    set((s) => ({ isLeftPanelOpen: !s.isLeftPanelOpen })),

  toggleRightPanel: () =>
    set((s) => ({ isRightPanelOpen: !s.isRightPanelOpen })),

  toggleShareModal: () =>
    set((s) => ({ isShareModalOpen: !s.isShareModalOpen })),

  equipPart: (partId) => {
    const { parts, equippedParts } = get();
    const incoming = parts.find((p) => p.id === partId);
    if (!incoming) return;

    const withoutSameCategory = equippedParts.filter((id) => {
      const p = parts.find((x) => x.id === id);
      return p && p.category !== incoming.category;
    });

    set({ equippedParts: [...withoutSameCategory, partId], isDirty: true });
    get().calculatePrice();
  },

  unequipPart: (partId) => {
    set((state) => ({
      equippedParts: state.equippedParts.filter((id) => id !== partId),
      isDirty: true,
    }));
    get().calculatePrice();
  },

  calculatePrice: () => {
    const { motorcycles, selectedMotorcycleId, parts, equippedParts } = get();
    const moto = motorcycles.find((m) => m.id === selectedMotorcycleId);
    let total = moto?.base_price ?? 0;
    for (const id of equippedParts) {
      const p = parts.find((x) => x.id === id);
      if (p) total += p.price;
    }
    set({ totalPrice: total });
  },

  resetConfig: () => {
    set({
      selectedPartGroup: null,
      hoveredPartGroup: null,
      selectedPartData: null,
      partColors: {},
      globalColor: "#0066FF",
      globalMaterial: "metallic",
      equippedParts: [],
      configName: "",
    });
    get().calculatePrice();
  },

  setLoading: (loading) => set({ isLoading: loading }),

  setCurrentConfigId: (id) => set({ currentConfigId: id }),

  setDirty: (dirty) => set({ isDirty: dirty }),
}));
