"use client";

import { useCallback, useState } from "react";

import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";

import Input from "../Input";
import Modal from "../Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

const RegisterModal = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const loginModal = useLoginModal();
	const registerModal = useRegisterModal();

	const onToggle = useCallback(() => {
		if (isLoading) return;

		registerModal.onClose();
		loginModal.onOpen();
	}, [loginModal, registerModal, isLoading]);

	const onSubmit = useCallback(async () => {
		try {
			setIsLoading(true);

			await axios.post("/api/register", {
				email,
				password,
				username,
				name,
			});

			toast.success("Account created.");

			signIn("credentials", {
				email,
				password,
			});

			registerModal.onClose();
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	}, [registerModal, email, password, username, name]);

	const bodyContent = (
		<div className="flex flex-col gap-4">
			{isError && (
				<div className="px-4 py-3 mb-4 text-sm text-white rounded-md bg-amber-600">
					<p className="text-2xl font-semibold text-center">{errorMessage}</p>
				</div>
			)}

			<Input
				disabled={isLoading}
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			<Input
				disabled={isLoading}
				placeholder="Username"
				value={username}
				onChange={(e) => setUsername(e.target.value)}
			/>
			<Input
				disabled={isLoading}
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				type="email"
			/>
			<Input
				disabled={isLoading}
				placeholder="Password"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
			/>
		</div>
	);

	const footerContent = (
		<div className="mt-4 text-center text-neutral-400">
			<p>
				Already have an account?{" "}
				<span
					onClick={onToggle}
					className="cursor-pointer text-sky-600 hover:underline">
					Log in
				</span>
			</p>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={registerModal.isOpen}
			title="Create an account"
			actionLabel="Register"
			onClose={registerModal.onClose}
			onSubmit={onSubmit}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default RegisterModal;