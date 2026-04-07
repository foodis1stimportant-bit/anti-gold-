export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { /* your profile fields */ };
        Insert: { /* insertable fields */ };
        Update: { /* updatable fields */ };
      };
      // add other tables...
    };
  };
}
