import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ContentDocument } from '../schemas/content.schema';
import { Logger } from '@nestjs/common';

// @WebSocketGateway()
// export class ContentsGateway {
//   @SubscribeMessage('message')
//   handleMessage(client: any, payload: any): string {
//     return 'Hello world!';
//   }
// }

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'content',
})
export class ContentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ContentsGateway.name);
  private connectedClients: Map<string, Socket> = new Map();

  handleConnection(client: Socket) {
    this.connectedClients.set(client.id, client);
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinContentRoom')
  handleJoinRoom(client: Socket, contentId: string): void {
    void client.join(`content-${contentId}`);
    this.logger.log(`Client ${client.id} joined room: content-${contentId}`);
  }

  @SubscribeMessage('leaveContentRoom')
  handleLeaveRoom(client: Socket, contentId: string): void {
    void client.leave(`content-${contentId}`);
    this.logger.log(`Client ${client.id} left room: content-${contentId}`);
  }

  sendContentUpdate(content: ContentDocument): void {
    // Broadcast to all clients in the specific content room
    this.server
      .to(`content-${String(content._id)}`)
      .emit('contentUpdated', content);
    // Also broadcast to all connected clients for general updates
    this.server.emit('contentListUpdated', content);
  }

  sendContentDeleted(contentId: string) {
    this.server.to(`content-${contentId}`).emit('contentDeleted', contentId);
    this.server.emit('contentListUpdated', { deleted: contentId });
  }
}
