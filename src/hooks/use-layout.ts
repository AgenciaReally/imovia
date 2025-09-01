"use client"

import { create } from 'zustand'

interface LayoutState {
  isFullWidth: boolean
  setFullWidth: (fullWidth: boolean) => void
  toggleFullWidth: () => void
}

export const useLayout = create<LayoutState>((set) => ({
  isFullWidth: false,
  setFullWidth: (fullWidth: boolean) => set({ isFullWidth: fullWidth }),
  toggleFullWidth: () => set((state) => ({ isFullWidth: !state.isFullWidth })),
}))
