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
      test: {
        Row: {
          alteracion_genetica_dirigida: string
          area_terapeutica: string
          ensayos_clinicos_relevantes: string
          estado_en_espana: string
          fecha_de_aprobacion_espana: string
          fuente_url: string
          ID_NUM: number
          linea_de_tratamiento: string
          mecanismo_de_accion: string
          nombre_de_la_molecula: string
          nombre_del_farmaco: string
          nombre_lab: string
          sub_area_de_tratamiento: string
        }
        Insert: {
          alteracion_genetica_dirigida: string
          area_terapeutica: string
          ensayos_clinicos_relevantes: string
          estado_en_espana: string
          fecha_de_aprobacion_espana: string
          fuente_url: string
          ID_NUM?: number
          linea_de_tratamiento: string
          mecanismo_de_accion: string
          nombre_de_la_molecula: string
          nombre_del_farmaco: string
          nombre_lab: string
          sub_area_de_tratamiento: string
        }
        Update: {
          alteracion_genetica_dirigida?: string
          area_terapeutica?: string
          ensayos_clinicos_relevantes?: string
          estado_en_espana?: string
          fecha_de_aprobacion_espana?: string
          fuente_url?: string
          ID_NUM?: number
          linea_de_tratamiento?: string
          mecanismo_de_accion?: string
          nombre_de_la_molecula?: string
          nombre_del_farmaco?: string
          nombre_lab?: string
          sub_area_de_tratamiento?: string
        }
        Relationships: []
      }
      UnmetNeeds_docu: {
        Row: {
          contenido_UN: string
          ID_NUM_DD: number
          id_UN_docu: number
        }
        Insert: {
          contenido_UN: string
          ID_NUM_DD: number
          id_UN_docu?: number
        }
        Update: {
          contenido_UN?: string
          ID_NUM_DD?: number
          id_UN_docu?: number
        }
        Relationships: []
      }
      UnmetNeeds_table: {
        Row: {
          area_terapeutica: string
          conclusion: string
          farmaco: string
          horizonte_temporal: string
          id_NUM_DD: number
          id_UN_NUM: string
          id_UN_table: number
          impacto: string
          lab: string
          molecula: string
          oportunidad_estrategica: string | null
          racional: string
          unmet_need: string
        }
        Insert: {
          area_terapeutica: string
          conclusion: string
          farmaco: string
          horizonte_temporal: string
          id_NUM_DD: number
          id_UN_NUM: string
          id_UN_table?: number
          impacto: string
          lab: string
          molecula: string
          oportunidad_estrategica?: string | null
          racional: string
          unmet_need: string
        }
        Update: {
          area_terapeutica?: string
          conclusion?: string
          farmaco?: string
          horizonte_temporal?: string
          id_NUM_DD?: number
          id_UN_NUM?: string
          id_UN_table?: number
          impacto?: string
          lab?: string
          molecula?: string
          oportunidad_estrategica?: string | null
          racional?: string
          unmet_need?: string
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
