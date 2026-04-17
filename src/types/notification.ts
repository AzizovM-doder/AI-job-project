export enum NotificationType {
  JobMatched = 'JobMatched',
  ApplicationStatusChanged = 'ApplicationStatusChanged',
  NewMessage = 'NewMessage',
  ConnectionRequest = 'ConnectionRequest',
  RecommendationReceived = 'RecommendationReceived'
}

export interface Notification {
  id: number;
  userId: number;
  type: NotificationType | string;
  title: string;
  message: string;
  relatedId?: number;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPagedResult {
  items: Notification[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface NotificationResponse<T> {
  statusCode: number;
  description: string[];
  data: T;
}
