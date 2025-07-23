export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      DrugDealer_table: {
        Row: {
          alteracion_genetica_dirigida: string | null
          area_terapeutica: string | null
          ensayos_clinicos_relevantes: string | null
          estado_en_espana: string | null
          fecha_de_aprobacion_espana: string | null
          fuente_url: string | null
          ID_NUM: number
          linea_de_tratamiento: string | null
          mecanismo_de_accion: string | null
          nombre_de_la_molecula: string
          nombre_del_farmaco: string
          nombre_lab: string
          sub_area_de_tratamiento: string | null
        }
        Insert: {
          alteracion_genetica_dirigida?: string | null
          area_terapeutica?: string | null
          ensayos_clinicos_relevantes?: string | null
          estado_en_espana?: string | null
          fecha_de_aprobacion_espana?: string | null
          fuente_url?: string | null
          ID_NUM?: number
          linea_de_tratamiento?: string | null
          mecanismo_de_accion?: string | null
          nombre_de_la_molecula: string
          nombre_del_farmaco: string
          nombre_lab: string
          sub_area_de_tratamiento?: string | null
        }
        Update: {
          alteracion_genetica_dirigida?: string | null
          area_terapeutica?: string | null
          ensayos_clinicos_relevantes?: string | null
          estado_en_espana?: string | null
          fecha_de_aprobacion_espana?: string | null
          fuente_url?: string | null
          ID_NUM?: number
          linea_de_tratamiento?: string | null
          mecanismo_de_accion?: string | null
          nombre_de_la_molecula?: string
          nombre_del_farmaco?: string
          nombre_lab?: string
          sub_area_de_tratamiento?: string | null
        }
        Relationships: []
      }
      Facturas_table: {
        Row: {
          Cantidad: number
          Cuatrimestre: string
          fecha_analizado: string | null
          fecha_emision: string
          ficheroURL: string
          id: number
          nombre_archivo: string
          nombre_proveedor: string
        }
        Insert: {
          Cantidad: number
          Cuatrimestre: string
          fecha_analizado?: string | null
          fecha_emision: string
          ficheroURL: string
          id?: number
          nombre_archivo: string
          nombre_proveedor: string
        }
        Update: {
          Cantidad?: number
          Cuatrimestre?: string
          fecha_analizado?: string | null
          fecha_emision?: string
          ficheroURL?: string
          id?: number
          nombre_archivo?: string
          nombre_proveedor?: string
        }
        Relationships: []
      }
      mejoras_comercial_table: {
        Row: {
          id: number
          mejora_solicitada: string | null
          persona_Solicitante: string | null
          sector: string | null
        }
        Insert: {
          id?: number
          mejora_solicitada?: string | null
          persona_Solicitante?: string | null
          sector?: string | null
        }
        Update: {
          id?: number
          mejora_solicitada?: string | null
          persona_Solicitante?: string | null
          sector?: string | null
        }
        Relationships: []
      }
      PharmaTactics_table: {
        Row: {
          area_terapeutica: string | null
          farmaco: string | null
          formato: string | null
          id: number
          id_unmetNeed: number
          laboratorio: string | null
          molecula: string | null
          text_docs: string | null
          unmet_need: string | null
          URL_docs: string | null
          URL_ppt: string | null
        }
        Insert: {
          area_terapeutica?: string | null
          farmaco?: string | null
          formato?: string | null
          id?: number
          id_unmetNeed: number
          laboratorio?: string | null
          molecula?: string | null
          text_docs?: string | null
          unmet_need?: string | null
          URL_docs?: string | null
          URL_ppt?: string | null
        }
        Update: {
          area_terapeutica?: string | null
          farmaco?: string | null
          formato?: string | null
          id?: number
          id_unmetNeed?: number
          laboratorio?: string | null
          molecula?: string | null
          text_docs?: string | null
          unmet_need?: string | null
          URL_docs?: string | null
          URL_ppt?: string | null
        }
        Relationships: []
      }
      UnmetNeeds_table: {
        Row: {
          area_terapeutica: string | null
          conclusion: string | null
          farmaco: string
          horizonte_temporal: string | null
          id_NUM_DD: number
          id_UN_NUM: string
          id_UN_table: number
          impacto: string | null
          lab: string
          molecula: string
          oportunidad_estrategica: string | null
          preguntas: string | null
          racional: string | null
          unmet_need: string
        }
        Insert: {
          area_terapeutica?: string | null
          conclusion?: string | null
          farmaco: string
          horizonte_temporal?: string | null
          id_NUM_DD: number
          id_UN_NUM: string
          id_UN_table?: number
          impacto?: string | null
          lab: string
          molecula: string
          oportunidad_estrategica?: string | null
          preguntas?: string | null
          racional?: string | null
          unmet_need: string
        }
        Update: {
          area_terapeutica?: string | null
          conclusion?: string | null
          farmaco?: string
          horizonte_temporal?: string | null
          id_NUM_DD?: number
          id_UN_NUM?: string
          id_UN_table?: number
          impacto?: string | null
          lab?: string
          molecula?: string
          oportunidad_estrategica?: string | null
          preguntas?: string | null
          racional?: string | null
          unmet_need?: string
        }
        Relationships: []
      }
      Users_logIn: {
        Row: {
          email: string
          ID: number
          pwd: string
        }
        Insert: {
          email: string
          ID?: number
          pwd: string
        }
        Update: {
          email?: string
          ID?: number
          pwd?: string
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
    Enums: {},
  },
} as const
