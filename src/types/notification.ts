export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPagedResult {
  items: Notification[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface NotificationListResponse {
  statusCode: number;
  description: string[];
  data: NotificationPagedResult;
}
