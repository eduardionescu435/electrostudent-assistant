export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
}
