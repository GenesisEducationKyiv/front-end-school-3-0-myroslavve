import { Input } from "./input";
import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "../button/button";
import { Search, Mail, Lock, Eye, EyeOff, User } from "lucide-react";
import * as React from "react";

const meta = {
    component: Input,
    title: "Input",
    parameters: {
        layout: 'centered',
    },    
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: { type: 'select' },
            options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'file'],
            description: 'The type of input',
        },
        placeholder: {
            control: { type: 'text' },
            description: 'Placeholder text',
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Whether the input is disabled',
        },
        required: {
            control: { type: 'boolean' },
            description: 'Whether the input is required',
        },
        value: {
            control: { type: 'text' },
            description: 'The value of the input',
        },
    },
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: "Enter text...",
    },
};

export const Email: Story = {
    args: {
        type: "email",
        placeholder: "Enter your email",
    },
};

export const Password: Story = {
    args: {
        type: "password",
        placeholder: "Enter your password",
    },
};

export const Number: Story = {
    args: {
        type: "number",
        placeholder: "Enter a number",
    },
};

export const SearchInput: Story = {
    args: { 
        type: "search",
        placeholder: "Search...",
    },
};

export const File: Story = {
    args: {
        type: "file",
        accept: ".mp3,.wav,.m4a",
    },
};

export const Disabled: Story = {
    args: {
        placeholder: "Disabled input",
        disabled: true,
    },
};

export const Required: Story = {
    args: {
        placeholder: "Required field",
        required: true,
    },
};

export const Error: Story = {
    args: {
        placeholder: "Enter text...",
        "aria-invalid": "true",
    },
    parameters: {
        docs: {
            description: {
                story: 'Input with error state and validation message.',
            },
        },
    },
};

export const WithValue: Story = {
    args: {
        value: "Pre-filled value",
        placeholder: "Enter text...",
    },
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark bg-gray-900 p-8 rounded-lg space-y-4">
            <Input placeholder="Dark mode input" />
            <Input type="email" placeholder="Email in dark mode" />
            <Input type="password" placeholder="Password in dark mode" />
            <Input type="file" />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Inputs displayed in dark mode context.',
            },
        },
    },
}; 