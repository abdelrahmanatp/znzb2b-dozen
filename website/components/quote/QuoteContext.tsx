// website/components/quote/QuoteContext.tsx
'use client'

import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from 'react'
import type { QuoteState, QuoteAction, RoomConfig } from '@/lib/quote/types'
import { generateSession, isValidSession } from '@/lib/quote/session'

const initialState: QuoteState = {
  session: null,
  cartItems: [],
  roomConfig: null,
  isDirty: false,
  isSaving: false,
  lastSaved: null,
}

function reducer(state: QuoteState, action: QuoteAction): QuoteState {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, session: action.session }
    case 'ADD_ITEM': {
      const existing = state.cartItems.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          cartItems: state.cartItems.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
          isDirty: true,
        }
      }
      return { ...state, cartItems: [...state.cartItems, action.item], isDirty: true }
    }
    case 'REMOVE_ITEM':
      return { ...state, cartItems: state.cartItems.filter(i => i.id !== action.id), isDirty: true }
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.id ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
        isDirty: true,
      }
    case 'UPDATE_NOTES':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.id ? { ...i, notes: action.notes } : i
        ),
        isDirty: true,
      }
    case 'UPDATE_CUSTOM_SIZE':
      return {
        ...state,
        cartItems: state.cartItems.map(i =>
          i.id === action.id ? { ...i, customSizeRequest: action.customSizeRequest } : i
        ),
        isDirty: true,
      }
    case 'SET_ROOM_CONFIG':
      return { ...state, roomConfig: action.config, isDirty: true }
    case 'LOAD_DRAFT':
      return {
        ...state,
        cartItems: action.draft.cartItems,
        roomConfig: action.draft.roomConfig,
        isDirty: false,
        lastSaved: action.draft.updatedAt,
      }
    case 'SAVE_START':
      return { ...state, isSaving: true }
    case 'SAVE_SUCCESS':
      return { ...state, isDirty: false, isSaving: false, lastSaved: new Date().toISOString() }
    case 'SAVE_ERROR':
      return { ...state, isSaving: false }
    case 'CLEAR':
      return { ...initialState, session: state.session }
    default:
      return state
  }
}

interface QuoteContextValue {
  state: QuoteState
  dispatch: React.Dispatch<QuoteAction>
  saveNow: () => Promise<void>
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({
  children,
  initialSession,
}: {
  children: ReactNode
  initialSession?: string
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    session: initialSession ?? null,
  })
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: init session + load draft
  useEffect(() => {
    async function init() {
      let session = initialSession

      // Validate or generate session
      if (!session || !isValidSession(session)) {
        session = generateSession()
        // Update URL without navigation
        const url = new URL(window.location.href)
        url.searchParams.set('s', session)
        window.history.replaceState({}, '', url.toString())
      }

      dispatch({ type: 'SET_SESSION', session })

      // Load existing draft
      try {
        const res = await fetch(`/api/quote/draft/${session}`)
        if (res.ok) {
          const { draft } = await res.json()
          if (draft && draft.status !== 'submitted') {
            dispatch({ type: 'LOAD_DRAFT', draft })
          }
        }
      } catch {
        // Non-blocking — start fresh if fetch fails
      }
    }
    init()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const saveNow = useCallback(async () => {
    if (!state.session || !state.isDirty) return
    dispatch({ type: 'SAVE_START' })
    try {
      const res = await fetch('/api/quote/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionUuid: state.session,
          cartItems: state.cartItems,
          roomConfig: state.roomConfig,
        }),
      })
      if (res.ok) {
        dispatch({ type: 'SAVE_SUCCESS' })
      } else {
        dispatch({ type: 'SAVE_ERROR' })
        console.warn('[QuoteContext] autosave failed:', res.status)
      }
    } catch {
      dispatch({ type: 'SAVE_ERROR' })
      console.warn('[QuoteContext] autosave network error')
    }
  }, [state.session, state.isDirty, state.cartItems, state.roomConfig])

  // Debounced auto-save: 2s after last change
  useEffect(() => {
    if (!state.isDirty) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(saveNow, 2000)
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [state.isDirty, state.cartItems, state.roomConfig, saveNow])

  return (
    <QuoteContext.Provider value={{ state, dispatch, saveNow }}>
      {children}
    </QuoteContext.Provider>
  )
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote must be used within QuoteProvider')
  return ctx
}
