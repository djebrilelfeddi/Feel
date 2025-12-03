import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { SubmitButton } from "@buttons";
import CharacterCounter from "./CharacterCounter";
import { LoadingSpinner } from "@display";

interface InputProps {
    placeholder: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void | Promise<void>;
}

const UserInputArea = ({placeholder = "Ecris quelque chose...", onChange, onSubmit}: InputProps) => {
    const [text, setText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setText(value);
        onChange?.(value);
    };
    
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!text.trim() || !onSubmit) return;
        
        setIsAnalyzing(true);
        try {
            await Promise.resolve(onSubmit(text));
        } finally {
            setIsAnalyzing(false);
            setText("");
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="relative w-full max-w-2xl">
        <div className={`layout-input-container ${isAnalyzing ? "layout-analyzing" : "layout-normal"}`}>
			<input
				ref={inputRef}
				type="text"
				className={`input-primary ${
					isAnalyzing
					? "input-analyzing"
					: "input-normal"
				} ${isFocused ? "input-focused" : "scale-hover"} hover-lift`}
				placeholder={placeholder}
				value={text}
				onChange={handleChange}
				onFocus={() => setIsFocused(true)}
				onBlur={() => setIsFocused(false)}
				disabled={isAnalyzing}
			/>
			<LoadingSpinner isVisible={isAnalyzing} size="w-5 h-5" />
			<SubmitButton isVisible={!isAnalyzing} isDisabled={!text.trim()} />
        </div>
        
        {text.length > 0 && !isAnalyzing && (
            <CharacterCounter count={text.length} isVisible={text.length > 0 && !isAnalyzing} />
        )}
        </form>
    );
};

export default UserInputArea;