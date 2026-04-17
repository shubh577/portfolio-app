import { create } from 'zustand';
import * as THREE from 'three';

export type Station = 'core' | 'projects' | 'skills' | 'timeline';

interface AppState {
  currentStation: Station;
  setStation: (station: Station) => void;
  isHoveringNode: boolean;
  setHoveringNode: (hover: boolean) => void;
  
  // Tour states
  isTouring: boolean;
  currentTourTarget: number | null;
  startTour: (startIndex?: number) => void;
  advanceTour: (direction: 1 | -1) => void;
  endTour: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentStation: 'core',
  setStation: (station) => set({ currentStation: station }),
  isHoveringNode: false,
  setHoveringNode: (hover) => set({ isHoveringNode: hover }),
  
  isTouring: false,
  currentTourTarget: null,
  
  startTour: (startIndex = 0) => {
    set({
      isTouring: true,
      currentTourTarget: Math.max(0, Math.min(startIndex, 9)),
    });
  },
  
  advanceTour: (direction: 1 | -1) => set((state) => {
    if (!state.isTouring || state.currentTourTarget === null) return state;
    
    const nextTarget = state.currentTourTarget + direction;
    
    if (nextTarget < 0 || nextTarget > 9) {
      return { isTouring: false, currentTourTarget: null };
    }
    
    return { currentTourTarget: nextTarget };
  }),
  
  endTour: () => set({
    isTouring: false,
    currentTourTarget: null,
  }),
}));
