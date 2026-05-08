// website/lib/quote/types.ts

export interface CartItem {
  id: string
  category: string
  productName: string
  quantity: number
  notes: string
  customSizeRequest: string  // empty string if not requested
  priceFrom: string          // indicative, display only
  image: string
}

export interface RoomConfig {
  roomCount: number
  categoriesPerRoom: string[]   // from PRODUCT_CATEGORIES keys
  laundryFrequency: string      // 'daily' | 'every-2-days' | 'every-3-days' | 'weekly' | custom string
  notes: string
}

export interface QuoteDraft {
  sessionUuid: string
  createdAt: string
  updatedAt: string
  cartItems: CartItem[]
  roomConfig: RoomConfig | null
  status: 'active' | 'submitted'
}

export interface QuoteSubmission {
  submissionId: string
  sessionUuid: string
  submittedAt: string
  customerName: string
  customerEmail: string
  propertyName: string
  submissionType: 'catalog' | 'rooms' | 'both'
  cartItems: CartItem[]
  roomConfig: RoomConfig | null
  status: 'new' | 'viewed' | 'quoted'
}

export type QuoteAction =
  | { type: 'SET_SESSION'; session: string }
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'UPDATE_NOTES'; id: string; notes: string }
  | { type: 'UPDATE_CUSTOM_SIZE'; id: string; customSizeRequest: string }
  | { type: 'SET_ROOM_CONFIG'; config: RoomConfig }
  | { type: 'LOAD_DRAFT'; draft: QuoteDraft }
  | { type: 'CLEAR' }
  | { type: 'SAVE_START' }
  | { type: 'SAVE_SUCCESS' }
  | { type: 'SAVE_ERROR' }

export interface QuoteState {
  session: string | null
  cartItems: CartItem[]
  roomConfig: RoomConfig | null
  isDirty: boolean      // true when local state differs from last server save
  isSaving: boolean
  lastSaved: string | null
}
