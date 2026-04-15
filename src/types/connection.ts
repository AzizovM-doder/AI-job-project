export enum ConnectionStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Rejected = 'Rejected',
  Blocked = 'Blocked'
}

export interface Connection {
  id: number;
  addresseeId: number;
  addresseeName: string;
  addresseeAvatar?: string;
  requesterId: number;
  requesterName: string;
  requesterAvatar?: string;
  status: ConnectionStatus;
  createdAt: string;
}

export interface ConnectionListResponse {
  statusCode: number;
  description: string[];
  data: Connection[];
}
