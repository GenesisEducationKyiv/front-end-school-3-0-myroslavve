import { Button } from "./button";
import type { Meta, StoryObj } from "@storybook/react";
import { Play, Plus, Trash2 } from "lucide-react";
import * as React from "react";

const meta = {
    component: Button,
    title: "Button",
    parameters: {
        layout: 'centered',
    },    
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'ghost-hover', 'link'],
            description: 'The visual style variant of the button',
        },
        size: {
            control: { type: 'select' },
            options: ['default', 'sm', 'lg', 'icon', 'iconSm'],
            description: 'The size of the button',
        },
        disabled: {
            control: { type: 'boolean' },
            description: 'Whether the button is disabled',
        },
        asChild: {
            control: { type: 'boolean' },
            description: 'Whether to render as a different element using Radix Slot',
        },
        children: {
            control: { type: 'text' },
            description: 'The content inside the button',
        },
    },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: "Button",
        variant: "default",
    },
};

export const Destructive: Story = {
    args: {
        children: "Delete",
        variant: "destructive",
    },
};

export const Outline: Story = {
    args: {
        children: "Button",
        variant: "outline",
    },
};

export const Secondary: Story = {
    args: {
        children: "Button",
        variant: "secondary",
    },
};

export const Ghost: Story = {
    args: {
        children: "Button",
        variant: "ghost",
    },
};

export const GhostHover: Story = {
    args: {
        children: "Hover me",
        variant: "ghost-hover",
    },
    parameters: {
        docs: {
            description: {
                story: 'This variant starts with opacity 0 and becomes visible on hover. Best used over images or other content.',
            },
        },
    },
};

export const Link: Story = {
    args: {
        children: "Link Button",
        variant: "link",
    },
};

export const Small: Story = {
    args: {
        children: "Small Button",
        size: "sm",
    },
};

export const Large: Story = {
    args: {
        children: "Large Button",
        size: "lg",
    },
};

export const IconButton: Story = {
    args: {
        children: <Play />,
        size: "icon",
        "aria-label": "Play",
    },
};

export const SmallIconButton: Story = {
    args: {
        children: <Play />,
        size: "iconSm",
        "aria-label": "Play",
    },
};

export const Disabled: Story = {
    args: {
        children: "Disabled Button",
        disabled: true,
    },
};

export const DisabledDestructive: Story = {
    args: {
        children: "Disabled Destructive",
        variant: "destructive",
        disabled: true,
    },
};

export const WithIcon: Story = {
    args: {
        children: (
            <>
                <Play />
                Play Track
            </>
        ),
        variant: "default",
    },
    parameters: {
        docs: {
            description: {
                story: 'Buttons can contain icons alongside text. Icons are automatically sized and positioned.',
            },
        },
    },
};

export const Loading: Story = {
    args: {
        children: (
            <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                Loading...
            </>
        ),
        disabled: true,
    },
};

export const AllVariants: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4 items-center">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="ghost-hover">Ghost Hover</Button>
            <Button variant="link">Link</Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All available button variants displayed together.',
            },
        },
    },
};

export const AllSizes: Story = {
    render: () => (
        <div className="flex flex-wrap gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Icon">
                <Play />
            </Button>
            <Button size="iconSm" aria-label="Small Icon">
                <Play />
            </Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'All available button sizes displayed together.',
            },
        },
    },
};

export const Interactive: Story = {
    render: () => {
        const [count, setCount] = React.useState(0);
        const [isLoading, setIsLoading] = React.useState(false);

        const handleClick = async () => {
            setIsLoading(true);
            // Simulate async operation
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCount(prev => prev + 1);
            setIsLoading(false);
        };

        return (
            <div className="flex flex-col gap-4 items-center">
                <div className="text-lg font-medium">Count: {count}</div>
                <Button 
                    onClick={handleClick} 
                    disabled={isLoading}
                    variant="default"
                >
                    {isLoading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                            Loading...
                        </>
                    ) : (
                        <>
                            <Play />
                            Click me!
                        </>
                    )}
                </Button>
                <Button 
                    onClick={() => setCount(0)} 
                    variant="outline"
                    disabled={isLoading}
                >
                    Reset
                </Button>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'An interactive example showing button states, loading, and event handling.',
            },
        },
    },
};

export const AsChild: Story = {
    render: () => (
        <div className="flex flex-col gap-4">
            <Button asChild>
                <a href="#example">Link Button</a>
            </Button>
            <Button asChild variant="outline">
                <button type="submit">Submit Button</button>
            </Button>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Using the `asChild` prop to render the button as different HTML elements while maintaining styling.',
            },
        },
    },
};