import { io, Socket } from "socket.io-client";
import { Content } from "../types/content";

class WebSocketService {
  private socket: Socket | null = null;
  private static instance: WebSocketService;

  private constructor() {}

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  connect() {
    if (!this.socket) {
      this.socket = io(import.meta.env.VITE_CONTENT_API, {
        transports: ["websocket"],
        autoConnect: true,
      });

      this.socket.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });

      this.socket.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinContentRoom(contentId: string) {
    if (this.socket) {
      this.socket.emit("joinContentRoom", contentId);
    }
  }

  leaveContentRoom(contentId: string) {
    if (this.socket) {
      this.socket.emit("leaveContentRoom", contentId);
    }
  }

  onContentUpdate(callback: (content: Content) => void) {
    if (this.socket) {
      this.socket.on("contentUpdated", callback);
    }
  }

  onContentDeleted(callback: (contentId: string) => void) {
    if (this.socket) {
      this.socket.on("contentDeleted", callback);
    }
  }

  onContentListUpdate(callback: (data: Content | { deleted: string }) => void) {
    if (this.socket) {
      this.socket.on("contentListUpdated", callback);
    }
  }

  removeContentUpdateListener(callback: (content: Content) => void) {
    if (this.socket) {
      this.socket.off("contentUpdated", callback);
    }
  }

  removeContentDeletedListener(callback: (contentId: string) => void) {
    if (this.socket) {
      this.socket.off("contentDeleted", callback);
    }
  }

  removeContentListUpdateListener(
    callback: (data: Content | { deleted: string }) => void
  ) {
    if (this.socket) {
      this.socket.off("contentListUpdated", callback);
    }
  }
}

export const websocketService = WebSocketService.getInstance();
