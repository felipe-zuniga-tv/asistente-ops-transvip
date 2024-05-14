import { useState } from 'react'
import { Icon } from './icons'

export default function PasswordInput({ onChange, placeholder, showEyeIcon = true }) {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');

    return (
        <div className="flex justify-center items-center w-full">
            <div className="relative text-black focus-within:text-slate-700 block w-full">
                <input
                    type={showPassword ? "text" : "password"}
                    className="auth-input-field"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                        onChange && onChange(e.target.value);
                    }}
                    placeholder={placeholder || "Password"}
                />
                {showEyeIcon && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                        <Icon
                            icon={showPassword ? "Eye" : "EyeSlash"}
                            className="text-black absolute top-1/2 transform -translate-y-1/2 right-3 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}