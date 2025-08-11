import { useState, useEffect, useCallback } from 'react';
import { useCall } from '@stream-io/video-react-sdk';
import { useUser } from '@clerk/nextjs';
import type { ChatCustomEvent } from '../custom-type';

export const useChatNotifications = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const call = useCall();
  const { user } = useUser();

  useEffect(() => {
    if (!call) return;

    const audio = new Audio('/notification.mp3');
    let audioPlayPromise: Promise<void> | null = null;
    
    const handleCustomEvent = (event: ChatCustomEvent) => {      
      const payload = event.custom;

      if (payload.type === "chat_message") {
        if (payload.userId !== user?.id) {
          setUnreadCount(prev => prev + 1);
          setHasUnreadMessages(true);
          
          try {
            // Try to play notification sound
            audioPlayPromise = audio.play();
          } catch (error) {
            console.error('Error playing notification sound:', error);
          }
        }
      }
    };

    const unsubscribe = call.on("custom", handleCustomEvent);
    
    return () => {
      unsubscribe();
      // Clean up audio resources
      if (audioPlayPromise) {
        audioPlayPromise.catch(() => {});
      }
      audio.pause();
      audio.remove();
    };
  }, [call, user?.id]);

  const markAsRead = useCallback(() => {
    setUnreadCount(0);
    setHasUnreadMessages(false);
  }, []);

  const getUnreadCount = useCallback(() => unreadCount, [unreadCount]);

  return {
    unreadCount,
    hasUnreadMessages,
    markAsRead,
    getUnreadCount
  };
};