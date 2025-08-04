import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Time block interfaces
interface TimeBlock {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  valueTier: number; // 10000, 1000, 100, 10
  category: string; // REV, REC, REL, ADM, DEL, MTG
  createdAt: Date;
  updatedAt: Date;
}

interface Goal {
  id: string;
  userId: string;
  type: string; // "strategic", "revenue", "recovery", "admin"
  targetHours: number;
  currentHours: number;
  createdAt: Date;
  updatedAt: Date;
}

interface WorksState {
  // Time blocks
  timeBlocks: TimeBlock[];
  currentWeekBlocks: TimeBlock[];
  isLoadingBlocks: boolean;
  
  // Goals
  goals: Goal[];
  isLoadingGoals: boolean;
  
  // Analytics data
  weeklyStats: {
    totalHours: number;
    valueDistribution: Record<string, number>;
    categoryDistribution: Record<string, number>;
  } | null;
  
  // Actions
  setTimeBlocks: (blocks: TimeBlock[]) => void;
  addTimeBlock: (block: TimeBlock) => void;
  updateTimeBlock: (id: string, updates: Partial<TimeBlock>) => void;
  deleteTimeBlock: (id: string) => void;
  setLoadingBlocks: (loading: boolean) => void;
  
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  setLoadingGoals: (loading: boolean) => void;
  
  setWeeklyStats: (stats: WorksState['weeklyStats']) => void;
  clearWorkData: () => void;
}

export const useWorksStore = create<WorksState>()(
  persist(
    (set, get) => ({
      // Initial state
      timeBlocks: [],
      currentWeekBlocks: [],
      isLoadingBlocks: false,
      goals: [],
      isLoadingGoals: false,
      weeklyStats: null,
      
      // Time block actions
      setTimeBlocks: (blocks) => set({ timeBlocks: blocks }),
      
      addTimeBlock: (block) => set((state) => ({
        timeBlocks: [...state.timeBlocks, block]
      })),
      
      updateTimeBlock: (id, updates) => set((state) => ({
        timeBlocks: state.timeBlocks.map(block =>
          block.id === id ? { ...block, ...updates } : block
        )
      })),
      
      deleteTimeBlock: (id) => set((state) => ({
        timeBlocks: state.timeBlocks.filter(block => block.id !== id)
      })),
      
      setLoadingBlocks: (loading) => set({ isLoadingBlocks: loading }),
      
      // Goals actions
      setGoals: (goals) => set({ goals }),
      
      addGoal: (goal) => set((state) => ({
        goals: [...state.goals, goal]
      })),
      
      updateGoal: (id, updates) => set((state) => ({
        goals: state.goals.map(goal =>
          goal.id === id ? { ...goal, ...updates } : goal
        )
      })),
      
      deleteGoal: (id) => set((state) => ({
        goals: state.goals.filter(goal => goal.id !== id)
      })),
      
      setLoadingGoals: (loading) => set({ isLoadingGoals: loading }),
      
      // Analytics actions
      setWeeklyStats: (stats) => set({ weeklyStats: stats }),
      
      // Clear all work data
      clearWorkData: () => set({
        timeBlocks: [],
        currentWeekBlocks: [],
        goals: [],
        weeklyStats: null,
        isLoadingBlocks: false,
        isLoadingGoals: false,
      }),
    }),
    {
      name: 'works-storage',
      partialize: (state) => ({
        timeBlocks: state.timeBlocks,
        goals: state.goals,
        weeklyStats: state.weeklyStats,
      }),
    }
  )
);

// Selector hooks for common use cases
export const useTimeBlocks = () => useWorksStore((state) => state.timeBlocks);
export const useGoals = () => useWorksStore((state) => state.goals);
export const useWeeklyStats = () => useWorksStore((state) => state.weeklyStats);
export const useWorkLoadingStates = () => useWorksStore((state) => ({
  isLoadingBlocks: state.isLoadingBlocks,
  isLoadingGoals: state.isLoadingGoals,
}));