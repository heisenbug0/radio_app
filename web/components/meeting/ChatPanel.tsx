"use client";

import { useState, useRef, useEffect } from "react";
import {
  Box,
  ScrollArea,
  TextInput,
  ActionIcon,
  Text,
  Group,
  Stack,
  Avatar,
  Paper,
  CloseButton,
  Notification
} from "@mantine/core";
import { IoSend } from "react-icons/io5";
import { useCall } from "@stream-io/video-react-sdk";
import { useUser } from "@clerk/nextjs";
import { ChatMessage } from "../../hooks/useChatPersistence";
import { useChatInput } from "../../hooks/useChatInput";
import { formatMessageTime } from "../../utils/chatUtils";

interface ChatPanelProps {
  onClose: () => void;
  onMarkAsRead?: () => void;
  messages: ChatMessage[];
  isOpen: boolean;
}

const ChatPanel = ({ onClose, onMarkAsRead, messages, isOpen }: ChatPanelProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const call = useCall();
  const viewport = useRef<HTMLDivElement>(null);
  const { inputValue, inputRef, clearInput, updateInput, focusInput } = useChatInput(isOpen);

  useEffect(() => {
    if (viewport.current) {
      viewport.current.scrollTo({
        top: viewport.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  useEffect(() => {
    if (onMarkAsRead) onMarkAsRead();
  }, [onMarkAsRead]);

  const sendMessage = async () => {
    if (!inputValue.trim() || !call || !user || isLoading) return;
    setIsLoading(true);
    setError(null);
    try {
      const messageId = crypto.randomUUID();
      const messageText = inputValue.trim();
      console.log('[Chat Debug] Sending message', { callId: call.id, userId: user.id, messageId, messageText });
      await call.sendCustomEvent({
        type: "chat_message",
        message: messageText,
        messageId,
      });
      clearInput();
      // Focus input after sending message
      setTimeout(() => {
        focusInput();
      }, 50);
    } catch (error) {
      setError("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Box
        bg="dark_colors.0"
        w={{ base: '98vw', md: 320 }}
        h={{ base: '50vh', sm: '60vh', md: '70vh' }}
        mih={{ base: 120, sm: 180, md: 250 }}
        pos={{ base: 'fixed', md: 'static' }}
        bottom={{ base: 0, md: undefined }}
        left={{ base: 0, md: undefined }}
        right={{ base: 0, md: undefined }}
        className="border-l border-solid flex flex-col"
        style={{
          borderColor: 'var(--dark_3)',
          ...(typeof window !== 'undefined' && window.innerWidth < 900
            ? { borderRadius: '16px 16px 0 0', zIndex: 1000 }
            : {}),
        }}
      >
        <Group
          justify="space-between"
          p="md"
          bg="dark_colors.2"
          className="border-b border-solid"
          style={{ borderColor: 'var(--dark_3)' }}
        >
          <Text
            fz={18}
            fw={600}
            c="light_colors.0"
            ff="Nunito_sans_semibold"
          >
            Chat
          </Text>
          <CloseButton
            onClick={onClose}
            size="md"
            c="light_colors.1"
            variant="transparent"
          />
        </Group>
        {error && (
          <Notification
            color="red"
            title="Error"
            onClose={() => setError(null)}
            className="mx-4 mt-4"
          >
            {error}
          </Notification>
        )}

        <ScrollArea
          flex={1}
          p="md"
          viewportRef={viewport}
          bg="dark_colors.1"
          className="min-h-0"
        >
          <Stack gap="sm">
            {messages.length === 0 ? (
              <Text
                c="light_colors.2"
                ta="center"
                mt="xl"
                ff="Nunito_sans_regular"
              >
                No messages yet. Start the conversation!
              </Text>
            ) : (
              messages.map((message, idx) => (
                <Paper
                  key={message.id}
                  p="sm"
                  bg={message.userId === user?.id ? "other_colors.2" : "dark_colors.3"}
                  className={`${
                    message.userId === user?.id
                      ? "ml-auto rounded-xl rounded-br-sm"
                      : "mr-auto rounded-xl rounded-bl-sm"
                  } max-w-[85%]`}
                >
                  <Group gap="xs" align="flex-start">
                    {message.userId !== user?.id && (
                      <Avatar
                        src={message.userImage}
                        size="sm"
                        color="dark_colors.3"
                      >
                        {message.userName.charAt(0).toUpperCase()}
                      </Avatar>
                    )}
                    <Box flex={1} className="min-w-0">
                      {message.userId !== user?.id && (
                        <Text
                          fz={12}
                          c="light_colors.1"
                          ff="Nunito_sans_medium"
                          fw={500}
                          mb={2}
                          className="truncate"
                        >
                          {message.userName}
                        </Text>
                      )}
                      <Text
                        fz={14}
                        c="light_colors.0"
                        ff="Nunito_sans_regular"
                        className="break-words"
                      >
                        {message.message}
                      </Text>
                      <Text
                        fz={11}
                        c="light_colors.2"
                        ff="Nunito_sans_regular"
                        mt={2}
                      >
                        {formatMessageTime(message.timestamp)}
                      </Text>
                    </Box>
                  </Group>
                </Paper>
              ))
            )}
          </Stack>
        </ScrollArea>

        <Box 
          p="md" 
          bg="dark_colors.0"
          className="border-t border-solid"
          style={{ borderColor: 'var(--dark_3)' }}
        >
          <Group gap="xs">
            <TextInput
              ref={inputRef}
              flex={1}
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => updateInput(e.target.value)}
              onKeyPress={handleKeyPress}
              size="md"
              disabled={isLoading}
              styles={{
                input: {
                  backgroundColor: 'var(--dark_3)',
                  border: '1px solid var(--dark_3)',
                  borderRadius: '8px',
                  color: 'var(--light_0)',
                  fontFamily: 'Nunito_sans_regular',
                  '&:focus': {
                    borderColor: 'var(--other_2)',
                  },
                  '&:disabled': {
                    opacity: 0.6,
                  },
                },
              }}
              maxLength={500}
            />
            <ActionIcon
              onClick={sendMessage}
              disabled={!inputValue.trim() || isLoading}
              size="lg"
              variant="filled"
              bg="other_colors.2"
              color="light_colors.0"
              className="rounded-lg"
              loading={isLoading}
              styles={{
                root: {
                  '&:disabled': {
                    backgroundColor: 'var(--dark_3)',
                    color: 'var(--light_2)',
                  },
                },
              }}
            >
              <IoSend size={18} />
            </ActionIcon>
          </Group>
        </Box>
      </Box>
    </>
  );
};

export default ChatPanel;