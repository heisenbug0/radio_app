import { ActionIcon, Box, Menu, Badge, Button, Center, Text, Group } from "@mantine/core";
import { Transition } from "@mantine/core";
import {
  PaginatedGridLayout,
  SpeakerLayout,
  CallParticipantsList,
  CallControls,
  CallStatsButton,
  useCallStateHooks,
  CallingState,
  useCall,
  ParticipantsAudio,
  StreamTheme,
} from "@stream-io/video-react-sdk";
import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import classes from "../app/(root)/meeting/meeting.module.css";
import { LuLayoutList } from "react-icons/lu";
import { PiUsersThree } from "react-icons/pi";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { PiPictureInPictureBold, PiPictureInPictureFill } from "react-icons/pi";
import { useRouter, useSearchParams } from "next/navigation";
import EndCallButton from "./meeting/EndCallButton";
import ChatPanel from "./meeting/ChatPanel";
import InitialLoader from "./Loader";
import { useChatNotifications } from "../hooks/useChatNotifications";
import { clearChatMessages } from "../utils/chatUtils";
import { useChatPersistence } from "../hooks/useChatPersistence";
import type { ChatCustomEvent } from "../custom-type";
import { usePiPContext } from "@/context/PiPContext";

type CallLayoutType = "grid" | "speaker-right" | "speaker-left";

const MeetingRoom = () => {
  const [layout, setLayout] = useState<CallLayoutType>("speaker-left");
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const searchParams = useSearchParams();
  const isPersonalRoom = !!searchParams.get("personal");
  const { useCallCallingState, useLocalParticipant, useParticipants } =
    useCallStateHooks();
  const callingState = useCallCallingState();
  const allParticipants = useParticipants();
  const localParticipant = useLocalParticipant();
  const remoteParticipants = allParticipants.filter(
    (p) => p.sessionId !== localParticipant?.sessionId
  );
  const router = useRouter();
  const { unreadCount, hasUnreadMessages, markAsRead } =
    useChatNotifications();
  const call = useCall();
  const { messages, addMessage, markAsRead: markAsReadFromPersistence } =
    useChatPersistence(call?.id);
  const { isSupported, pipWindow, requestPipWindow, closePipWindow } =
    usePiPContext();

  const addMessageRef = useRef(addMessage);
  const markAsReadRef = useRef(markAsRead);
  const markAsReadFromPersistenceRef = useRef(markAsReadFromPersistence);

  useEffect(() => {
    addMessageRef.current = addMessage;
    markAsReadRef.current = markAsRead;
    markAsReadFromPersistenceRef.current = markAsReadFromPersistence;
  });

  const togglePip = useCallback(() => {
    if (pipWindow && !pipWindow.closed) closePipWindow();
    else requestPipWindow(500, 500);
  }, [pipWindow, requestPipWindow, closePipWindow]);

  useEffect(() => {
    navigator.mediaSession.setActionHandler(
      "enterpictureinpicture" as any,
      togglePip
    );
    return () =>
      navigator.mediaSession.setActionHandler(
        "enterpictureinpicture" as any,
        null
      );
  }, [togglePip]);

  useEffect(() => {
    const onBeforeUnload = () => {
      if (pipWindow && !pipWindow.closed) closePipWindow();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [pipWindow, closePipWindow]);

  useEffect(() => {
    if (!call) return;
    
    const handleCustomEvent = (event: ChatCustomEvent) => {
      const payload = event.custom;
      if (payload.type === "chat_message") {
        const chatMessage = {
          id: payload.messageId || crypto.randomUUID(),
          message: payload.message || "Unknown Message",
          userId: payload.userId || event.user?.id || "unknown",
          userName: payload.userName || event.user?.name || "Unknown User",
          userImage: payload.userImage || event.user?.image || "",
          timestamp: new Date(payload.timestamp || Date.now()),
        };
        
        if (!messages.some((m) => m.id === chatMessage.id)) {
          addMessageRef.current(chatMessage);
          if (showChat) {
            markAsReadRef.current();
            markAsReadFromPersistenceRef.current?.();
          }
        }
      }
    };
    
    const unsubscribe = call.on("custom", handleCustomEvent);
    return () => unsubscribe();
  }, [call, showChat]);

  useEffect(() => {
    if (showChat && messages.length > 0) {
      markAsRead();
      markAsReadFromPersistence?.();
    }
  }, [showChat, messages, markAsRead, markAsReadFromPersistence]);

  useEffect(() => {
    if (callingState === CallingState.LEFT && call?.id) {
      clearChatMessages(call.id);
    }
  }, [callingState, call?.id]);

  if (callingState !== CallingState.JOINED) return <InitialLoader />;

  const CallLayout = () => {
    switch (layout) {
      case "grid":
        return <PaginatedGridLayout excludeLocalParticipant />;
      case "speaker-left":
        return <SpeakerLayout participantsBarPosition="right" excludeLocalParticipant />;
      default:
        return <SpeakerLayout participantsBarPosition="left" excludeLocalParticipant />;
    }
  };

  return (
    <Box className="relative h-screen w-full overflow-hidden pt-4 text-white">
      {(!pipWindow || pipWindow.closed) && (
        <Box
          style={{ position: "fixed", top: "1rem", right: "1rem", zIndex: 1000 }}
          className={`${classes.action_bg} flex justify-center items-center`}
        >
          <ActionIcon
            onClick={togglePip}
            title="Enter Picture-in-Picture"
            size="lg"
            variant="transparent"
            className="text-blue-400 hover:text-blue-300"
          >
            <PiPictureInPictureBold size={24} />
          </ActionIcon>
        </Box>
      )}

      {pipWindow ? (
        <>
          {createPortal(
            <StreamTheme>
              <div className="h-screen w-full bg-gray-900">
                <Box className="h-[calc(100%-60px)]">
                  <SpeakerLayout excludeLocalParticipant />
                </Box>
                <Box className="absolute bottom-0 w-full bg-black/80 py-2 px-4">
                  <CallControls />
                </Box>
              </div>
            </StreamTheme>,
            pipWindow.document.body,
          )}
          
          {/* PiP Exit Overlay */}
          <Box className="fixed inset-0 bg-black/70 z-[9998] flex items-center justify-center">
            <Box className="bg-gray-800/90 p-8 rounded-xl w-full max-w-md text-center space-y-4">
              <PiPictureInPictureFill className="text-blue-400 mx-auto" size={48} />
              <Text size="xl" fw={700}>
                Meeting in Picture-in-Picture
              </Text>
              <Text size="sm" className="text-gray-300">
                Your meeting is running in a separate window. 
                You can continue working while staying in the call.
              </Text>
              <Button
                onClick={closePipWindow}
                leftSection={<PiPictureInPictureFill size={18} />}
                variant="filled"
                color="blue"
                size="md"
                className="font-medium"
                fullWidth
              >
                Return to Meeting
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <Box className="relative flex size-full items-center justify-center">
          <Box className={`flex size-full items-center justify-center ${showChat ? 'chat-open' : ''}`}>
            <ParticipantsAudio participants={remoteParticipants} />
            <CallLayout />
          </Box>
          {showParticipants && (
            <Box className="h-screen ml-5 hidden md:block">
              <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </Box>
          )}
          {showChat && (
            <ChatPanel 
              onClose={() => setShowChat(false)} 
              onMarkAsRead={markAsReadFromPersistence} 
              messages={messages} 
              isOpen={showChat} 
            />
          )}
        </Box>
      )}

      <Box className="fixed bottom-0 flex flex-wrap w-full items-center justify-center gap-3 pb-4 z-50">
        <CallControls onLeave={() => router.replace("/")} />
        <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
          <Menu.Target>
            <ActionIcon
              title="Layout"
              variant="transparent"
              classNames={{ root: classes.action_bg }}
            >
              <LuLayoutList size={20} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown classNames={{ dropdown: classes.menu_dropdown }}>
            {["Grid", "Speaker-Left", "Speaker-Right"].map((type, idx) => (
              <Menu.Item key={idx} onClick={() => setLayout(type.toLowerCase() as CallLayoutType)}>
                {type}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
        <ActionIcon
          title="Participants"
          variant="transparent"
          classNames={{ root: classes.action_bg }}
          onClick={() => setShowParticipants((p) => !p)}
        >
          <PiUsersThree size={20} />
        </ActionIcon>
        <Box pos="relative">
          <ActionIcon
            title="Chat"
            variant="transparent"
            classNames={{ root: classes.action_bg }}
            onClick={() => {
              setShowChat((prev) => {
                const willOpen = !prev;
                if (willOpen) markAsRead();
                return willOpen;
              });
            }}
          >
            <IoChatbubbleEllipsesOutline size={20} />
          </ActionIcon>
          <Transition
            mounted={hasUnreadMessages && unreadCount > 0}
            transition="pop"
            duration={200}
            timingFunction="ease"
          >
            {(styles) => (
              <Badge
                size="xs"
                variant="filled"
                color="red"
                pos="absolute"
                top={-8}
                right={-8}
                style={{
                  minWidth: "18px",
                  height: "18px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  ...styles,
                }}
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </Transition>
        </Box>
        <CallStatsButton />
        {!isPersonalRoom && <EndCallButton />}
      </Box>
    </Box>
  );
};

export default MeetingRoom;