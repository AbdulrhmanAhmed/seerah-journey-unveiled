export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      companions: {
        Row: {
          bio: string | null
          bio_en: string | null
          birth_year: string | null
          category: string
          created_at: string
          death_year: string | null
          family_relation: string | null
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          name_en: string
          nickname: string | null
          nickname_en: string | null
          notable_roles: Json
          related_event_ids: Json
        }
        Insert: {
          bio?: string | null
          bio_en?: string | null
          birth_year?: string | null
          category?: string
          created_at?: string
          death_year?: string | null
          family_relation?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name: string
          name_en: string
          nickname?: string | null
          nickname_en?: string | null
          notable_roles?: Json
          related_event_ids?: Json
        }
        Update: {
          bio?: string | null
          bio_en?: string | null
          birth_year?: string | null
          category?: string
          created_at?: string
          death_year?: string | null
          family_relation?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          name_en?: string
          nickname?: string | null
          nickname_en?: string | null
          notable_roles?: Json
          related_event_ids?: Json
        }
        Relationships: []
      }
      family_members: {
        Row: {
          bio: string | null
          bio_en: string | null
          birth_year: string | null
          companion_id: string | null
          created_at: string
          death_year: string | null
          display_order: number
          gender: string
          id: string
          image_url: string | null
          name: string
          name_en: string
          parent_id: string | null
          relation_type: string
        }
        Insert: {
          bio?: string | null
          bio_en?: string | null
          birth_year?: string | null
          companion_id?: string | null
          created_at?: string
          death_year?: string | null
          display_order?: number
          gender?: string
          id?: string
          image_url?: string | null
          name: string
          name_en: string
          parent_id?: string | null
          relation_type?: string
        }
        Update: {
          bio?: string | null
          bio_en?: string | null
          birth_year?: string | null
          companion_id?: string | null
          created_at?: string
          death_year?: string | null
          display_order?: number
          gender?: string
          id?: string
          image_url?: string | null
          name?: string
          name_en?: string
          parent_id?: string | null
          relation_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_members_companion_id_fkey"
            columns: ["companion_id"]
            isOneToOne: false
            referencedRelation: "companions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_members_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          created_at: string
          email: string | null
          id: string
          message: string
          name: string | null
          page_url: string | null
          type: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          message: string
          name?: string | null
          page_url?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          message?: string
          name?: string | null
          page_url?: string | null
          type?: string
        }
        Relationships: []
      }
      location_events: {
        Row: {
          category: string
          created_at: string
          event_order: number
          id: string
          label: string
          label_en: string
          location_id: string
        }
        Insert: {
          category?: string
          created_at?: string
          event_order?: number
          id?: string
          label: string
          label_en: string
          location_id: string
        }
        Update: {
          category?: string
          created_at?: string
          event_order?: number
          id?: string
          label?: string
          label_en?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "location_events_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "map_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      map_locations: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          description_en: string | null
          gallery_urls: Json
          id: string
          image_url: string | null
          is_active: boolean
          name: string
          name_arabic: string | null
          name_en: string
          primary_category: string
          travel_data: Json | null
          x: number
          y: number
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          gallery_urls?: Json
          id: string
          image_url?: string | null
          is_active?: boolean
          name: string
          name_arabic?: string | null
          name_en: string
          primary_category?: string
          travel_data?: Json | null
          x?: number
          y?: number
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          description_en?: string | null
          gallery_urls?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          name?: string
          name_arabic?: string | null
          name_en?: string
          primary_category?: string
          travel_data?: Json | null
          x?: number
          y?: number
        }
        Relationships: []
      }
      path_steps: {
        Row: {
          audio_url: string | null
          coord_x: number
          coord_y: number
          created_at: string
          custom_note: string | null
          custom_note_en: string | null
          description: string | null
          description_en: string | null
          id: string
          image_url: string | null
          label: string
          label_en: string
          lat: number
          lng: number
          location_id: string | null
          path_id: string
          segment_type: string
          step_order: number
        }
        Insert: {
          audio_url?: string | null
          coord_x?: number
          coord_y?: number
          created_at?: string
          custom_note?: string | null
          custom_note_en?: string | null
          description?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          label: string
          label_en: string
          lat?: number
          lng?: number
          location_id?: string | null
          path_id: string
          segment_type?: string
          step_order?: number
        }
        Update: {
          audio_url?: string | null
          coord_x?: number
          coord_y?: number
          created_at?: string
          custom_note?: string | null
          custom_note_en?: string | null
          description?: string | null
          description_en?: string | null
          id?: string
          image_url?: string | null
          label?: string
          label_en?: string
          lat?: number
          lng?: number
          location_id?: string | null
          path_id?: string
          segment_type?: string
          step_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "path_steps_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      paths: {
        Row: {
          created_at: string
          description: string | null
          description_en: string | null
          id: string
          is_active: boolean
          line_color: string
          name: string
          name_en: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          line_color?: string
          name: string
          name_en: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_en?: string | null
          id?: string
          is_active?: boolean
          line_color?: string
          name?: string
          name_en?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          created_at: string
          difficulty: string
          display_order: number
          era: string
          explanation: string | null
          explanation_en: string | null
          id: string
          is_active: boolean
          options: Json
          question: string
          question_en: string
          related_event_id: string | null
        }
        Insert: {
          created_at?: string
          difficulty?: string
          display_order?: number
          era?: string
          explanation?: string | null
          explanation_en?: string | null
          id?: string
          is_active?: boolean
          options?: Json
          question: string
          question_en: string
          related_event_id?: string | null
        }
        Update: {
          created_at?: string
          difficulty?: string
          display_order?: number
          era?: string
          explanation?: string | null
          explanation_en?: string | null
          id?: string
          is_active?: boolean
          options?: Json
          question?: string
          question_en?: string
          related_event_id?: string | null
        }
        Relationships: []
      }
      quiz_scores: {
        Row: {
          completed_at: string
          era: string
          id: string
          score: number
          total_questions: number
          user_id: string
        }
        Insert: {
          completed_at?: string
          era: string
          id?: string
          score?: number
          total_questions?: number
          user_id: string
        }
        Update: {
          completed_at?: string
          era?: string
          id?: string
          score?: number
          total_questions?: number
          user_id?: string
        }
        Relationships: []
      }
      shamail_traits: {
        Row: {
          category: string
          created_at: string
          description: string | null
          description_en: string | null
          hadith_source: string | null
          hadith_source_en: string | null
          icon_name: string | null
          id: string
          image_url: string | null
          is_active: boolean
          map_location_id: string | null
          reflection: string | null
          reflection_en: string | null
          story_example: string | null
          story_example_en: string | null
          title: string
          title_en: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          hadith_source?: string | null
          hadith_source_en?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          map_location_id?: string | null
          reflection?: string | null
          reflection_en?: string | null
          story_example?: string | null
          story_example_en?: string | null
          title: string
          title_en: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          hadith_source?: string | null
          hadith_source_en?: string | null
          icon_name?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          map_location_id?: string | null
          reflection?: string | null
          reflection_en?: string | null
          story_example?: string | null
          story_example_en?: string | null
          title?: string
          title_en?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          audio_url: string | null
          category: string
          created_at: string
          description: string | null
          description_en: string | null
          display_order: number
          era: string
          full_story: string | null
          full_story_en: string | null
          hadith_references: Json
          id: string
          image_url: string | null
          is_active: boolean
          is_major: boolean
          lat: number
          lng: number
          location_id: string | null
          map_x: number
          map_y: number
          path_id: string | null
          quran_references: Json
          related_event_ids: Json
          slug: string | null
          timeline_visible: boolean
          title: string
          title_en: string
          year_ce: number
          year_hijri: string | null
        }
        Insert: {
          audio_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number
          era?: string
          full_story?: string | null
          full_story_en?: string | null
          hadith_references?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_major?: boolean
          lat?: number
          lng?: number
          location_id?: string | null
          map_x?: number
          map_y?: number
          path_id?: string | null
          quran_references?: Json
          related_event_ids?: Json
          slug?: string | null
          timeline_visible?: boolean
          title: string
          title_en: string
          year_ce: number
          year_hijri?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string
          created_at?: string
          description?: string | null
          description_en?: string | null
          display_order?: number
          era?: string
          full_story?: string | null
          full_story_en?: string | null
          hadith_references?: Json
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_major?: boolean
          lat?: number
          lng?: number
          location_id?: string | null
          map_x?: number
          map_y?: number
          path_id?: string | null
          quran_references?: Json
          related_event_ids?: Json
          slug?: string | null
          timeline_visible?: boolean
          title?: string
          title_en?: string
          year_ce?: number
          year_hijri?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_path_id_fkey"
            columns: ["path_id"]
            isOneToOne: false
            referencedRelation: "paths"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
