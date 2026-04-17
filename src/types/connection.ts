export enum ConnectionStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined'
}

export interface Connection {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: ConnectionStatus;
  createdAt: string;
  requesterName?: string;
  addresseeName?: string;
}

export interface SendConnectionByEmailDto {
  email: string | null;
}

export interface UpdateConnectionDto {
  status: ConnectionStatus;
}

export interface ConnectionListResponse {
  statusCode: number;
  description: string[] | null;
  data: Connection[];
}
