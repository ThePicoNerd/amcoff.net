export interface Monitor {
  id: string;
  name: string;
  online: boolean;
  maintenance: boolean;
  lastCheck: string;
  lastStatusChange: string;
}
