"use client";
import UseAxiosSecure from "@/app/hooks/useAxiosSecure";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { IoIosSend } from "react-icons/io";

import { io } from "socket.io-client";
import { MdOutlineArrowBackIosNew } from "react-icons/md";

export default function ChatPage() {
  const params = useParams();
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email;
  const id = params?.id;
  const [user, setUser] = useState();
  const [receiver, setReceiver] = useState();
  const [messages, setMessages] = useState();
  const [message, setMessage] = useState("");
  const [fetch, refetch] = useState(false);
  // const [socket,setSocket]=useState(null)
  const messagesEndRef = useRef(null);

  const [socket, Setsocket] = useState(null);
  const axiosSecure = UseAxiosSecure();
  // user info fetch
  useEffect(() => {
    const UserFecth = async () => {
      try {
        const response = await axiosSecure.post("/auth/find/Profile/", {
          email: userEmail,
        });
        if (response?.data) {
          setUser(response?.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    UserFecth();
  }, [userEmail]);
  // receiver info fetch
  useEffect(() => {
    const fetchReceiver = async () => {
      if (!id) return;

      try {
        const response = await axiosSecure.post("/auth/find/receiver/", {
          _id: id,
        });
        if (response?.data) {
          setReceiver(response.data);
        }
      } catch (error) {
        console.error("Error fetching receiver:", error);
      }
    };

    fetchReceiver();
  }, [id, axiosSecure]);

  // set socket
  useEffect(() => {
    const newSocket = io("https://chatify-server-1-1a8e.onrender.com/");
    Setsocket(newSocket);

    newSocket.on("receiveMessage", (newMessage) => {
      setMessages((preMessage) => [...preMessage, newMessage]);
    });
    if (userEmail) {
      newSocket.emit("join", user?._id);
    }
    return () => newSocket.close();
  }, [user?._id]);
  // fetch receiver info

  //fetch all messages between sender & receiver

  useEffect(() => {
    if (user?._id && receiver?._id) {
      const fetchMessage = async () => {
        try {
          const response = await axiosSecure.post("/api/get/messages", {
            senderId: user._id,
            receiverId: receiver._id,
          });
          if (response?.data) {
            setMessages(response.data);
          } else {
            console.log("No messages found");
          }
        } catch (error) {
          console.log("Messages fetching error:", error.message);
        }
      };
      fetchMessage();
      refetch(false);
    }
  }, [user?._id, receiver?._id, fetch]);

  //local date converter
  const ConvertLocalDate = (time) => {
    const date = new Date(time);
    const localDate = date.toLocaleString("en-Us", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    return localDate;
  };
  // handleSendMessage

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const form = e.target;
    const message = form.msg.value;

    if (socket && message) {
      const messageData = {
        text: message,
        senderId: user?._id,
        receiverId: receiver?._id,
      };
      socket.emit("send_message", messageData);
      setMessages((pre) => [
        ...pre,
        { ...messageData, timestamp: new Date().toISOString() },
      ]);
      setMessage("");
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const router = useRouter();
  const handleBack = () => {
    router.push("/dashboard/chat");
  };
  // document.title = "Chat";
  return (
    <div className="relative p-5  min-h-screen rounded-sm ">
      <div className="border-b-2 p-2  w-full  text-gray-400 mx-auto">
        <h2
          onClick={handleBack}
          title="Back"
          className="hidden cursor-pointer text-[#7F6EEA]   max-md:flex my-4  items-center text-xl"
        >
          <MdOutlineArrowBackIosNew></MdOutlineArrowBackIosNew>
          <span>Back</span>
        </h2>
        <div className="flex flex-row gap-2 items-center">
          <div className="w-12 h-12 relative rounded-full bg-gray-500 ">
            <img
              src={
                receiver?.profilePhotoVisibility === "everyone"
                  ? receiver?.profilePicture
                  : "https://res.cloudinary.com/dtkvrvpjq/image/upload/v1744179391/user_profiles/zjjes3amtrq0jmqol5ku.jpg"
              }
              alt={receiver?.name || "User"}
              className="rounded-full w-full h-full object-cover"
            />
            <div
              className={`w-3 h-3 ${
                receiver?.isOnline && receiver?.OnlineStatus === "true"
                  ? "bg-green-400"
                  : "bg-red-400"
              }  rounded-full absolute bottom-0 right-0 ring-2 ring-white`}
            />
          </div>
          <h2>{receiver ? receiver?.name : "Loading..."}</h2>
        </div>
      </div>
      <div
        className="h-[60vh] overflow-y-auto py-5"
        style={{ scrollbarWidth: "none" }}
      >
        {messages?.map((message, index) => {
          return (
            <div
              key={index}
              className={`chat ${
                message?.senderId === user?._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-image avatar">
                <div className="w-10 rounded-full">
                  <img
                    alt="Profile Image"
                    src={
                      message?.senderId === user?._id
                        ? user?.profilePicture
                        : receiver?.profilePhotoVisibility === "everyone"
                        ? receiver?.profilePicture
                        : "https://res.cloudinary.com/dtkvrvpjq/image/upload/v1744179391/user_profiles/zjjes3amtrq0jmqol5ku.jpg"
                    }
                  />
                </div>
              </div>
              <div className="chat-header">
                <span className="max-sm:hidden">
                {receiver?.profilePhotoVisibility !== "everyone" ? (
  user?._id === message?.senderId ? user?.name : receiver?.name
) : null}

                </span>{" "}
                <time className="text-xs opacity-50">
                  {ConvertLocalDate(message?.timestamp)}
                </time>
              </div>
              <div className="chat-bubble">{message?.text}</div>
            </div>
          );
        })}

        <div ref={messagesEndRef}></div>
      </div>

      <div className="w-[80%] max-md:w-[100%] my-5 bg-[#b1aae2]  rounded-sm p-5 bottom-30 border-gray-400 mx-auto">
        <form onSubmit={handleSendMessage}>
          <div className="flex  justify-between gap-5 items-center">
            <input
              type="text"
              placeholder="Write Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-white outline-none px-5 w-full h-16"
              name="msg"
            />
            <div>
              <button type="submit">
                <IoIosSend
                  className="text-3xl text-[#7169EF]"
                  title="send message"
                />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
