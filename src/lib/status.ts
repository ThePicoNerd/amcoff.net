export interface Monitor {
  id: string;
  name: string;
  category: string | null;
  online: boolean;
  maintenance: boolean;
  lastCheck: string;
  lastStatusChange: string;
}
