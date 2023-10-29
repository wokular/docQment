import { useState, useEffect, useRef } from "react";
import { Paper, Box, Typography, Avatar, TextField, Button } from "@mui/material"

import chipPfp from "../assets/chip.svg";
import personPfp from "../assets/person.svg";
import sendSvg from "../assets/send.svg";
import trashSvg from "../assets/trash.svg";

import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

const MessageBubble = (props: any) => {
   return <>
      <Box className="messageLineContainer" sx={{ flexDirection: (props.human ? "row" : "row-reverse"), display: "flex", marginTop: "8px", marginBottom: "8px", alignItems: "center" }}>
         <Box className="spacer" sx={{ flex: 1, flexGrow: 1 }}></Box>
         <Box className={props.human ? "humanMessage" : ""} sx={{ borderRadius: "16px", backgroundColor: (props.human ? "#2a75ff" : "#f9f9f9"), maxWidth: "50%", padding: "8px", marginRight: "6px", marginLeft: "6px" }}>
            <Typography sx={{ lineHeight: "20px", textAlign: "left", color: (props.human ? "white" : "") }}>{props.text}</Typography>
         </Box>
         <Avatar alt="pfp" sx={{ width: "28px", height: "28px" }} src={props.human ? personPfp : chipPfp}></Avatar>
      </Box >
   </>
}

export default function ChatWindow() {


   const [chatText, setChatText] = useState("")
   const [user, setUser] = useState("Danny")

   const sendMessage = useAction(api.functions.sendMessage);
   const clearMessages = useMutation(api.functions.clearMessages);
   const chatMessages = useQuery(api.functions.getMessages, { chatName: "chats".concat(user) });

   const handleChatTextChange = (event: any) => {
      setChatText(event.target.value);
   }

   const handleSendMessage = () => {
      sendMessage({ text: chatText, user: user });
      setChatText("")
   }

   const handleClearMessages = () => {
      clearMessages({ user: user });
   }

   useEffect(() => {
      const el = document.getElementById('chatWrapper');
      // id of the chat container ---------- ^^^
      if (el) {
         el.scrollTop = el.scrollHeight;
      }
   }, [chatMessages])

   return <>
      <Paper className="chatWindowFrame" elevation={1} sx={{ minHeight: "200px", maxHeight: "250px", position: "relative", display: "flex", marginTop: "30px", backgroundColor: "#fafafd" }}>
         <Box className="messageboxContainer" id="chatWrapper" sx={{ padding: "20px", width: "100%", marginBottom: "48px", overflow: "scroll" }}>
            {

               chatMessages?.map(element => {
                  return <MessageBubble key={"Ignore this key"} human={element["human"]} text={element["text"]}>Test</MessageBubble>
               })
            }
            {/* <span ref={scroll}></span> */}
         </Box>
         <Box className="chatboxContainer" sx={{ bottom: 0, position: "absolute", backgroundColor: "#eaebff", width: "100%", height: "64px" }}>
            <Box className="chatboxRelative" sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Box className="sendMessageContainer" sx={{ display: "flex", width: "100%", paddingLeft: "10px" }}>
                  <TextField sx={{ flexGrow: 1, backgroundColor: "#ffffff" }} className="messageTextField" placeholder="Enter a question here" onChange={handleChatTextChange} value={chatText}></TextField>
                  <Button sx={{ borderRadius: "100px", userSelect: "none", outline: "none", ":focus": { outline: "none" } }} onClick={handleSendMessage}>
                     <Avatar sx={{
                        width: "24px", height: "24px", borderRadius: "0"
                     }} src={sendSvg}></Avatar>
                  </Button>
                  <Button sx={{ borderRadius: "100px", userSelect: "none", outline: "none", ":focus": { outline: "none" } }} onClick={handleClearMessages}>
                     <Avatar sx={{
                        width: "24px", height: "24px", borderRadius: "0"
                     }} src={trashSvg}></Avatar>
                  </Button>
               </Box>
            </Box>
         </Box>
      </Paper >
   </>
}