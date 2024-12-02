import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import { UserAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: string) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks.filter((block) => block.trim() !== ""); // Filter out empty blocks
  }
  return [message]; // Return an array containing the original message if no code block
}

function isCodeBlock(str: string) {
  return (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  );
}

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = UserAuth();

  return (
    <Box
      sx={{
        display: "flex",
        p: 2,
        bgcolor: role === "assistant" ? "#004d5612" : "#51538f",
        gap: 2,
        borderRadius: 2,
        my: 1,
        maxWidth: "600px", // Set a maximum width for the message box
        wordBreak: "break-word", // Break long words to avoid overflow
      }}
    >
      <Avatar
        sx={{
          ml: "0",
          bgcolor: role === "assistant" ? "transparent" : "black",
          color: role === "assistant" ? "inherit" : "white",
        }}
      >
        {role === "assistant" ? (
          <img
            src="johnnychat.png"
            alt="johnnychat"
            width={"40px"}
            style={{ borderRadius: "50%" }}
          />
        ) : (
          auth?.user?.name[0]
        )}
      </Avatar>
      <Box sx={{ flex: 1 }}> {/* Ensure the text area takes the available space */}
        {messageBlocks.map((block, index) =>
          isCodeBlock(block) ? (
            <Box
              key={index}
              sx={{
                maxHeight: "300px", // Limit the height of code blocks
                overflowY: "auto", // Enable vertical scrolling for long code
                bgcolor: "#1e1e1e", // Set a background color for the code block
                borderRadius: 1,
                p: 1,
                mb: 1,
              }}
            >
              <SyntaxHighlighter style={coldarkDark} language="javascript">
                {block}
              </SyntaxHighlighter>
            </Box>
          ) : (
            <Typography key={index} sx={{ fontSize: "20px", wordBreak: "break-word" }}>
              {block}
            </Typography>
          )
        )}
      </Box>
    </Box>
  );
};

export default ChatItem;
