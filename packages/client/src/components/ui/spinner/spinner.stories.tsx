import Spinner from "./spinner";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta = {
    component: Spinner,
    title: "Spinner",
    parameters: {
        layout: 'centered',
    },    
    tags: ['autodocs'],
    argTypes: {
        // The spinner component doesn't have props currently, but we document this for future reference
    },
} satisfies Meta<typeof Spinner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {},
};

export const DarkMode: Story = {
    render: () => (
        <div className="dark bg-gray-900 p-8 rounded-lg">
            <div className="text-center">
                <Spinner />
                <p className="text-gray-300 mt-4">Loading in dark mode...</p>
            </div>
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Spinner displayed in dark mode context.',
            },
        },
    },
}; 