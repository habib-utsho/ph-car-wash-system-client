"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
} from "@/components/ui/input-group";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

const PasswordInput = ({ disabled, ...props }: PasswordInputProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <InputGroup className="h-10">
            <InputGroupAddon>
                <Lock />
            </InputGroupAddon>
            <InputGroupInput
                type={isVisible ? "text" : "password"}
                placeholder="••••••••"
                disabled={disabled}
                {...props}
            />
            <InputGroupAddon align="inline-end">
                <InputGroupButton
                    size="icon-xs"
                    onClick={() => setIsVisible((v) => !v)}
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    aria-pressed={isVisible}
                    disabled={disabled}
                >
                    {isVisible ? <EyeOff /> : <Eye />}
                </InputGroupButton>
            </InputGroupAddon>
        </InputGroup>
    );
};

export default PasswordInput;
