import { useState, useEffect, useRef } from "react";
import { Paper, Box, Typography, Avatar, TextField, Button } from "@mui/material"

import chipPfp from "../assets/chip.svg";
import personPfp from "../assets/person.svg";
import sendSvg from "../assets/send.svg";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

const SendMessage = ({ scroll }) => {

   const sendMessage = async (event) => {
      scroll.current.scrollIntoView({ behavior: "smooth" });
   };
};

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

   const [documentUploaded, setDocumentUploaded] = useState<Boolean>(false);

   // const messages = useQuery(api.messages.get);
   const [messages, setMessages] = useState([
      [{
         "human": true,
         "text": "So what do we have to do now?",
         "timestamp_ms": 1698482878410,
      }],
      [{
         "human": false,
         "text": "What do you mean?",
         "timestamp_ms": 1698482888410,
      }],
      [{
         "human": true,
         "text": "In terms of accessing the legal documents required to start a new fund in Florida for my house and property.",
         "timestamp_ms": 1698482898410,
      }],
      [{
         "human": true,
         "text": "If that makes sense",
         "timestamp_ms": 1698482908410,
      }],
      [{
         "human": false,
         "text": "I understand, one moment while I check for you.",
         "timestamp_ms": 1698482918410,
      }],
   ])

   const [messagess, setMessagess] = useState([
      "one", "two"
   ])

   useEffect(() => {
      messages.sort((a, b) => a[0]["timestamp_ms"] - b[0]["timestamp_ms"])
   }, messages)

   useEffect(() => {
      console.log(messages.length)
   }, [])

   return <>
      <Paper className="chatWindowFrame" elevation={1} sx={{ minHeight: "200px", maxHeight: "250px", position: "relative", display: "flex" }}>
         <Box className="messageboxContainer" sx={{ padding: "20px", width: "100%", marginBottom: "48px", overflow: "scroll" }}>
            {/*
            // @ts-ignore */}
            {

               messages?.map(element => {
                  return <MessageBubble human={element[0]["human"]} text={element[0]["text"]}>Test</MessageBubble>
               })
            }
            <span ref={scroll}></span>
         </Box>
         <Box className="chatboxContainer" sx={{ bottom: 0, position: "absolute", backgroundColor: "#eaebff", width: "100%", height: "64px" }}>
            <Box className="chatboxRelative" sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Box className="sendMessageContainer" sx={{ display: "flex", width: "100%", paddingLeft: "10px" }}>
                  <TextField sx={{ flexGrow: 1, backgroundColor: "#ffffff" }} className="messageTextField" placeholder="Enter a question here"></TextField>
                  <Button sx={{ borderRadius: "100px", userSelect: "none", outline: "none", '.MuiOutlinedInput-notchedOutline': { border: 0 } }}><Avatar sx={{
                     width: "24px", height: "24px", borderRadius: "0"
                  }} src={sendSvg}></Avatar></Button>
               </Box>
            </Box>
         </Box>
      </Paper>
   </>
}