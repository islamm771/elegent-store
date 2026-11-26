/** Types of the bag + wishlist store. */

export interface CartItem {
  key: string; id: string; name: string; price: number; qty: number;
  color?: string; size?: string; image?: string; tone?: string;
}
export type NewItem = Omit<CartItem, "key" | "qty">;

/** Where the data currently lives: this browser (guest) or the user's account (database). null = not loaded yet. */
export type StoreSource = "local" | "server" | null;

export interface Store {
  ready: boolean;
  /** true when the bag / wishlist live in the user's account (database); false = guest, kept in this browser only */
  signedIn: boolean;
  items: CartItem[]; count: number; subtotal: number;
  add: (item: NewItem, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  wishlist: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => boolean; // returns the new saved state
  clearWishlist: () => void;
}
