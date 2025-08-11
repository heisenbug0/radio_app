// Utility functions for chat management

export const clearChatMessages = (callId?: string) => {
  if (typeof window === 'undefined' || !callId) return;
  
  try {
    const storageKey = `meeting_chat_messages_${callId}`;
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error('Error clearing chat messages:', error);
  }
};

export const getChatMessages = (callId?: string) => {
  if (typeof window === 'undefined' || !callId) return [];
  
  try {
    const storageKey = `meeting_chat_messages_${callId}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.messages || [];
    }
  } catch (error) {
    console.error('Error getting chat messages:', error);
  }
  
  return [];
};

export const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};