export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      community_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          likes: number | null
          title: string
          topic: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          title: string
          topic: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          title?: string
          topic?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      crop_recommendations: {
        Row: {
          climate_zone: string
          created_at: string | null
          crop_name: string
          growing_duration: number | null
          id: string
          max_rainfall: number | null
          max_temperature: number | null
          min_rainfall: number | null
          min_temperature: number | null
          season: string
          soil_type: string
          special_instructions: string | null
          state: string
          water_requirement: string | null
          yield_potential: string | null
        }
        Insert: {
          climate_zone: string
          created_at?: string | null
          crop_name: string
          growing_duration?: number | null
          id?: string
          max_rainfall?: number | null
          max_temperature?: number | null
          min_rainfall?: number | null
          min_temperature?: number | null
          season: string
          soil_type: string
          special_instructions?: string | null
          state: string
          water_requirement?: string | null
          yield_potential?: string | null
        }
        Update: {
          climate_zone?: string
          created_at?: string | null
          crop_name?: string
          growing_duration?: number | null
          id?: string
          max_rainfall?: number | null
          max_temperature?: number | null
          min_rainfall?: number | null
          min_temperature?: number | null
          season?: string
          soil_type?: string
          special_instructions?: string | null
          state?: string
          water_requirement?: string | null
          yield_potential?: string | null
        }
        Relationships: []
      }
      disease_detections: {
        Row: {
          confidence_score: number | null
          created_at: string | null
          crop_name: string
          disease_name: string | null
          id: string
          image_url: string
          treatment_recommendations: string | null
          user_id: string | null
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string | null
          crop_name: string
          disease_name?: string | null
          id?: string
          image_url: string
          treatment_recommendations?: string | null
          user_id?: string | null
        }
        Update: {
          confidence_score?: number | null
          created_at?: string | null
          crop_name?: string
          disease_name?: string | null
          id?: string
          image_url?: string
          treatment_recommendations?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      fertilizer_recommendations: {
        Row: {
          application_timing: string
          chemical_fertilizers: string[]
          created_at: string | null
          crop_name: string
          dosage_per_acre: string
          id: string
          organic_fertilizers: string[]
          special_notes: string | null
        }
        Insert: {
          application_timing: string
          chemical_fertilizers?: string[]
          created_at?: string | null
          crop_name: string
          dosage_per_acre: string
          id?: string
          organic_fertilizers?: string[]
          special_notes?: string | null
        }
        Update: {
          application_timing?: string
          chemical_fertilizers?: string[]
          created_at?: string | null
          crop_name?: string
          dosage_per_acre?: string
          id?: string
          organic_fertilizers?: string[]
          special_notes?: string | null
        }
        Relationships: []
      }
      market_prices: {
        Row: {
          crop_name: string
          district: string
          id: string
          market_name: string
          max_price: number
          min_price: number
          modal_price: number
          price_unit: string
          state: string
          updated_at: string | null
        }
        Insert: {
          crop_name: string
          district: string
          id?: string
          market_name: string
          max_price: number
          min_price: number
          modal_price: number
          price_unit?: string
          state: string
          updated_at?: string | null
        }
        Update: {
          crop_name?: string
          district?: string
          id?: string
          market_name?: string
          max_price?: number
          min_price?: number
          modal_price?: number
          price_unit?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          district: string | null
          farm_size: string | null
          full_name: string | null
          id: string
          phone: string | null
          primary_crops: string[] | null
          state: string | null
          updated_at: string | null
          village: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          district?: string | null
          farm_size?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          primary_crops?: string[] | null
          state?: string | null
          updated_at?: string | null
          village?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          district?: string | null
          farm_size?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          primary_crops?: string[] | null
          state?: string | null
          updated_at?: string | null
          village?: string | null
        }
        Relationships: []
      }
      recipes: {
        Row: {
          cooking_time: string | null
          created_at: string | null
          description: string | null
          id: string
          ingredients: string[]
          title: string
        }
        Insert: {
          cooking_time?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ingredients: string[]
          title: string
        }
        Update: {
          cooking_time?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          ingredients?: string[]
          title?: string
        }
        Relationships: []
      }
      traditional_practices: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          id: string
          season: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          season?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          season?: string | null
          title?: string
        }
        Relationships: []
      }
      user_crop_recommendations: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          recommendation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recommendation_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recommendation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_crop_recommendations_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "crop_recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_data: {
        Row: {
          district: string
          forecast: string | null
          forecast_date: string
          humidity: number | null
          id: string
          rainfall: number | null
          state: string
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          district: string
          forecast?: string | null
          forecast_date: string
          humidity?: number | null
          id?: string
          rainfall?: number | null
          state: string
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          district?: string
          forecast?: string | null
          forecast_date?: string
          humidity?: number | null
          id?: string
          rainfall?: number | null
          state?: string
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      yield_predictions: {
        Row: {
          area_size: number | null
          area_unit: string | null
          created_at: string | null
          crop_name: string
          id: string
          predicted_yield: number | null
          season: string | null
          soil_type: string | null
          user_id: string | null
        }
        Insert: {
          area_size?: number | null
          area_unit?: string | null
          created_at?: string | null
          crop_name: string
          id?: string
          predicted_yield?: number | null
          season?: string | null
          soil_type?: string | null
          user_id?: string | null
        }
        Update: {
          area_size?: number | null
          area_unit?: string | null
          created_at?: string | null
          crop_name?: string
          id?: string
          predicted_yield?: number | null
          season?: string | null
          soil_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
