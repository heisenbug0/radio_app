import { useState, useEffect, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userImage?: string;
  message: string;
  timestamp: Date;
}

interface ChatStorage {
  messages: ChatMessage[];
  lastReadTimestamp: number;
  unreadCount: number;
}

const STORAGE_KEY = 'meeting_chat_messages';
const UNREAD_KEY = 'meeting_chat_unread';

export const useChatPersistence = (callId?: string) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastReadTimestamp, setLastReadTimestamp] = useState(0);

  const getStorageKey = useCallback((key: string) => {
    return callId ? `${key}_${callId}` : key;
  }, [callId]);

  const loadMessages = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storageKey = getStorageKey(STORAGE_KEY);
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed: ChatStorage = JSON.parse(stored);
        const messagesWithDates = parsed.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
        setLastReadTimestamp(parsed.lastReadTimestamp || 0);
        setUnreadCount(parsed.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading chat messages:', error);
    }
  }, [getStorageKey]);

  const saveMessages = useCallback((
    newMessages: ChatMessage[], 
    newUnreadCount: number, 
    newLastReadTimestamp: number
  ) => {
    if (typeof window === 'undefined') return;
    
    try {
      const storageKey = getStorageKey(STORAGE_KEY);
      const storage: ChatStorage = {
        messages: newMessages,
        lastReadTimestamp: newLastReadTimestamp,
        unreadCount: newUnreadCount
      };
      localStorage.setItem(storageKey, JSON.stringify(storage));
    } catch (error) {
      console.error('Error saving chat messages:', error);
    }
  }, [getStorageKey]);

  const addMessage = useCallback((message: ChatMessage) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      saveMessages(newMessages, unreadCount + 1, lastReadTimestamp);
      return newMessages;
    });
    setUnreadCount(prev => prev + 1);
  }, [unreadCount, lastReadTimestamp, saveMessages]);

  const markAsRead = useCallback(() => {
    const now = Date.now();
    setLastReadTimestamp(now);
    setUnreadCount(0);
    saveMessages(messages, 0, now);
  }, [messages, saveMessages]);

  const clearMessages = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const storageKey = getStorageKey(STORAGE_KEY);
      localStorage.removeItem(storageKey);
      setMessages([]);
      setUnreadCount(0);
      setLastReadTimestamp(0);
    } catch (error) {
      console.error('Error clearing chat messages:', error);
    }
  }, [getStorageKey]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  return {
    messages,
    unreadCount,
    lastReadTimestamp,
    addMessage,
    markAsRead,
    clearMessages,
    setMessages
  };
};