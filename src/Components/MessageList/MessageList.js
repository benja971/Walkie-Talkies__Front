import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import io from "socket.io-client";

import { addMessage } from "../../reducers/messagesReducer";
import { uniqueId } from "../../mess";

import Message from "./Message/Message";

import "./MessageList.scss";

const url = process.env.NODE_ENV === "production" ? "https://walkie-talkies.benjamin-niddam.dev/" : "http://localhost:8003";

const socket = io.connect(url);

export default function MessageList() {
	const { messages, discussionId } = useSelector(state => state.messages);

	const dispatch = useDispatch();

	useEffect(() => {
		socket.on("newMessage", data => {
			const { messageObj } = data;

			if (discussionId !== data.discussionId) return;

			console.log("Message received:", messageObj);

			dispatch(addMessage(messageObj));
		});
	}, [dispatch, discussionId]);

	return (
		<div className='message-list'>
			{messages.map(message => (
				<Message key={uniqueId()} message={message} />
			))}
		</div>
	);
}
