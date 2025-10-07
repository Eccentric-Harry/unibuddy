import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import type { Message, GlobalMessage } from '../types';

class WebSocketService {
  private client: Client | null = null;
  private connected = false;
  private messageCallbacks: ((message: Message) => void)[] = [];
  private globalMessageCallbacks: ((message: GlobalMessage) => void)[] = [];

  connect(token?: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }

      // Create SockJS connection
      const socket = new SockJS(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/ws`);
      
      this.client = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token || localStorage.getItem('accessToken') || ''}`,
        },
        debug: (str) => {
          console.log('STOMP: ' + str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });

      this.client.onConnect = () => {
        this.connected = true;
        console.log('WebSocket connected');
        resolve();
      };

      this.client.onStompError = (frame) => {
        console.error('STOMP error:', frame);
        this.connected = false;
        reject(new Error(frame.headers['message'] || 'WebSocket connection failed'));
      };

      this.client.onWebSocketError = (error) => {
        console.error('WebSocket error:', error);
        this.connected = false;
        reject(error);
      };

      this.client.onDisconnect = () => {
        this.connected = false;
        console.log('WebSocket disconnected');
      };

      this.client.activate();
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.connected = false;
      this.messageCallbacks = [];
      this.globalMessageCallbacks = [];
    }
  }

  subscribeToConversation(conversationId: string, callback: (message: Message) => void): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.subscribe(`/topic/conversations/${conversationId}`, (message) => {
      try {
        const parsedMessage: Message = JSON.parse(message.body);
        callback(parsedMessage);
        
        // Also call global message callbacks
        this.messageCallbacks.forEach(cb => cb(parsedMessage));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  }

  subscribeToGlobalChat(globalChatId: string, callback: (message: GlobalMessage) => void): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.subscribe(`/topic/global-chat/${globalChatId}`, (message) => {
      try {
        const parsedMessage: GlobalMessage = JSON.parse(message.body);
        callback(parsedMessage);
        
        // Also call global message callbacks
        this.globalMessageCallbacks.forEach(cb => cb(parsedMessage));
      } catch (error) {
        console.error('Error parsing global message:', error);
      }
    });
  }

  subscribeToUserMessages(userId: string, callback: (message: Message) => void): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    this.client.subscribe(`/user/${userId}/messages`, (message) => {
      try {
        const parsedMessage: Message = JSON.parse(message.body);
        callback(parsedMessage);
        
        // Also call global message callbacks
        this.messageCallbacks.forEach(cb => cb(parsedMessage));
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });
  }

  sendMessage(conversationId: string, content: string, imageUrl?: string): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      conversationId,
      content,
      imageUrl,
    };

    this.client.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify(message),
    });
  }

  sendGlobalMessage(globalChatId: string, content: string, imageUrl?: string): void {
    if (!this.client || !this.connected) {
      console.error('WebSocket not connected');
      return;
    }

    const message = {
      messageText: content,
      imageUrl,
    };

    this.client.publish({
      destination: `/app/global-chat/${globalChatId}`,
      body: JSON.stringify(message),
    });
  }

  onMessage(callback: (message: Message) => void): void {
    this.messageCallbacks.push(callback);
  }

  onGlobalMessage(callback: (message: GlobalMessage) => void): void {
    this.globalMessageCallbacks.push(callback);
  }

  removeMessageCallback(callback: (message: Message) => void): void {
    const index = this.messageCallbacks.indexOf(callback);
    if (index > -1) {
      this.messageCallbacks.splice(index, 1);
    }
  }

  removeGlobalMessageCallback(callback: (message: GlobalMessage) => void): void {
    const index = this.globalMessageCallbacks.indexOf(callback);
    if (index > -1) {
      this.globalMessageCallbacks.splice(index, 1);
    }
  }

  isConnected(): boolean {
    return this.connected;
  }
}

export const websocketService = new WebSocketService();
