export interface Event {
  messageId: string;
  type: string;
  timestamp: Date;
  body: Record<string, any>;
}
