export interface Database {
  public: {
    Tables: {
      system_configs: {
        Row: {
          id: string
          key: string
          value: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_group_members: {
        Row: {
          id: string
          group_id: string
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          group_id: string
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          email?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_group_members_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "email_groups"
            referencedColumns: ["id"]
          }
        ]
      }
      sidebar_section_access: {
        Row: {
          id: string
          section_id: string
          group_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          section_id: string
          group_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          group_id?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sidebar_section_access_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "email_groups"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}
