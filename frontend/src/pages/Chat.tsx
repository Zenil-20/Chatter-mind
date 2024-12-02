import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  Switch,
  FormControl,
  Select,
  MenuItem,
  FormControlLabel
} from "@mui/material";
import { red } from "@mui/material/colors";
import { UserAuth } from "../context/AuthContext";
import ChatItem from "../components/chat/ChatItem";
import { IoMdSend, IoMdMic } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = false;  // Stop after one sentence
recognition.interimResults = false;
recognition.lang = "en-US";

const Chat = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const auth = UserAuth();
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedbackEnabled, setVoiceFeedbackEnabled] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Fetch available voices for speech synthesis
  useEffect(() => {
    const getVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Filter for only English, Hindi, and Gujarati voices
      const filteredVoices = availableVoices.filter(voice =>
        voice.lang.startsWith("en") || voice.lang.startsWith("hi") || voice.lang.startsWith("gu")
      );
      setVoices(filteredVoices);
      if (filteredVoices.length > 0) {
        setSelectedVoice(filteredVoices[0]); // Set default voice
      }
    };

    getVoices();
    window.speechSynthesis.onvoiceschanged = getVoices; // Update voices when they are changed
  }, []);

  // Handle voice response with selected voice
  const handleVoiceResponse = (text: string) => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice; // Set the selected voice

    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async () => {
    const content = inputValue.trim();
    if (content === "") return;

    const newMessage = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);
    setInputValue(""); // Clear the input field
    setLoading(true);

    try {
      const chatData = await sendChatRequest(content);
      if (chatData.chats.length > 0) {
        const assistantMessage = chatData.chats[chatData.chats.length - 1];
        setChatMessages((prev) => [...prev, assistantMessage]);

        // Speak the assistant's response if voice feedback is enabled
        if (voiceFeedbackEnabled) {
          handleVoiceResponse(assistantMessage.content);
        }
      }
    } catch (error) {
      console.error("Error sending chat request:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.error("Error deleting chats:", error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  // Handle recognition results
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const transcript = event.results[0][0].transcript;
    setInputValue(transcript); // Set the recognized text to the input
    handleSubmit(); // Auto-submit the message
    setIsListening(false); // Stop listening after the input is received
  };

  // Handle recognition end
  recognition.onend = () => {
    setIsListening(false); // Stop the mic and reset icon when recognition ends
  };

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening); // Toggle listening state
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
  };

  useLayoutEffect(() => {
    if (auth?.isLoggedIn && auth.user) {
      toast.loading("Loading Chats", { id: "loadchats" });
      getUserChats()
        .then(data => {
          setChatMessages([...data.chats]);
          toast.success("Successfully loaded chats", { id: "loadchats" });
        })
        .catch(err => {
          console.error("Error loading chats:", err);
          toast.error("Loading Failed", { id: "loadchats" });
        });
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  return (
    <Box sx={{ display: 'flex', flex: 1, width: '100%', height: "100%", mt: 3, gap: 3 }}>
      <Box sx={{ display: { md: "flex", xs: "none", sm: "none" }, flex: 0.2, flexDirection: 'column' }}>
        <Box sx={{ display: "flex", width: "100%", height: "80vh", bgcolor: "rgb(17, 29, 39)", borderRadius: 3, flexDirection: "column", mx: 3 }}>
          <Avatar sx={{ mx: "auto", my: 2, bgcolor: 'white', color: 'black', fontWeight: 700 }}>
            {auth?.user?.name ? (
              <>
                {auth.user.name[0]}
                {auth.user.name.split(" ")[1] ? auth.user.name.split(" ")[1][0] : ''}
              </>
            ) : ''}
          </Avatar>
          <Typography sx={{ mx: 'auto', fontFamily: "Open Sans", fontWeight: 700 }}>
            Hello I'm ChatterMind.
          </Typography>
          <Typography sx={{ mx: 'auto', fontFamily: "Open Sans", fontWeight: 200, my: 2, p: 2 }}>
            How can I assist you today? I can answer many questions and even provide JavaScript code.
          </Typography>
          <Button
            onClick={handleDeleteChats}
            sx={{
              width: "200px",
              my: 'auto',
              color: 'white',
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400
              }
            }}
          >
            Clear Conversation
          </Button>

          <Button
            onClick={stopSpeaking}
            sx={{
              width: "200px",
              my: 1,
              color: 'white',
              fontWeight: "700",
              borderRadius: 3,
              mx: "auto",
              bgcolor: red[300],
              ":hover": {
                bgcolor: red.A400
              }
            }}
          >
            Stop Speaking
          </Button> 

        </Box>
      </Box>
      <Box sx={{ display: "flex", flex: { md: 0.8, xs: 1, sm: 1 }, flexDirection: "column", px: 3 }}>
        <Typography sx={{ fontSize: "40px", color: "white", mb: 2, mx: "auto", fontWeight: "600" }}>
          Chatter-Mind
        </Typography>
        <Box
          sx={{
            width: "100%",
            height: "60vh",
            borderRadius: 3,
            mx: "auto",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            scrollBehavior: "smooth",
          }}
        >
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </Box>
        <div
          style={{
            width: "100%",
            borderRadius: 8,
            backgroundColor: "rgb(17,27,39)",
            display: "flex",
            margin: "auto",
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              outline: "none",
              borderRadius: 5,
              backgroundColor: "rgb(244, 244, 244)",
              fontWeight: "700",
            }}
            placeholder="Type your message here..."
          />
          <IconButton
            onClick={toggleListening}
            color="inherit"
            sx={{
              "&:hover": {
                bgcolor: red[300],
              },
            }}
          >
            <IoMdMic size={25} color={isListening ? "red" : "white"} />
          </IconButton>
          <IconButton
            onClick={handleSubmit}
            color="inherit"
            sx={{
              "&:hover": {
                bgcolor: red[300],
              },
            }}
          >
            <IoMdSend size={25} color={isListening ? "red" : "white"} />
          </IconButton>
        </div>
        {voiceFeedbackEnabled && (
          <FormControl fullWidth sx={{ my: 2 }}>
            <Select
              value={selectedVoice ? selectedVoice.name : ""}
              onChange={(e) => {
                const selected = voices.find(voice => voice.name === e.target.value);
                setSelectedVoice(selected);
              }}
              displayEmpty
              sx={{
                backgroundColor: 'rgb(244, 244, 244)', // Updated background color
                borderRadius: 1,
                color: 'black', // Set text color to black
              }}
            >
              {voices.map((voice, index) => (
                <MenuItem key={index} value={voice.name} sx={{ color: 'black' }}> {/* Set MenuItem text color to black */}
                  {voice.name} ({voice.lang})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <FormControlLabel
          control={<Switch checked={voiceFeedbackEnabled} onChange={() => setVoiceFeedbackEnabled(!voiceFeedbackEnabled)} />}
          label="Enable Voice Feedback" 
        />
      </Box>
    </Box>
  );
};

export default Chat;







