import { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";

import { addMessage } from "../../../reducers/messagesReducer";

import "./MessageForm.scss";

const url = process.env.NODE_ENV === "production" ? "https://walkie-talkies.benjamin-niddam.dev/" : "http://localhost:8003";

const socket = io.connect(url);

export default function MessageForm() {
	const [message, setMessage] = useState("");

	const { user } = useSelector(state => state.user);
	const { discussionId } = useSelector(state => state.messages);

	const dispatch = useDispatch();

	const getMessage = useCallback(e => {
		setMessage(e.target.value);
	}, []);

	const handleSubmit = useCallback(
		e => {
			e.preventDefault();

			if (message.trim().length === 0) return;

			const messageObj = {
				text: message,
				sender: user,
				date: new Date().toLocaleString(),
			};

			socket.emit("newMessage", { discussionId, messageObj });

			dispatch(addMessage(messageObj));
			setMessage("");
		},
		[dispatch, message, user, discussionId],
	);

	return (
		<form className='messages-form' onSubmit={handleSubmit}>
			<input className='messages-form__input' type='text' placeholder='Type a message...' value={message} onChange={getMessage} />
			<button className='messages-form__button'>
				<span className='material-icons-outlined'>send</span>
			</button>
		</form>
	);
}
