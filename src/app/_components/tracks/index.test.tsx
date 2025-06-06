import { getGenres } from '@/lib/api/genres';
import { getTracks } from '@/lib/api/tracks';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Tracks } from './index';
import { ok } from 'neverthrow';

// Mock the API modules
jest.mock('@/lib/api/tracks');
jest.mock('@/lib/api/genres');
jest.mock('react-h5-audio-player', () => {
    return function MockAudioPlayer() {
        return <div data-testid="audio-player">Audio Player</div>;
    };
});

// Mock components
jest.mock('@/components/data-table', () => {
    return function MockDataTable({ data }: { data: { title?: string; artist?: string; id?: string }[] }) {
        return (
            <div data-testid="data-table">
                {data.map((item, i) => item.title && (
                    <div key={i}>{item.title}</div>
                ))}
                {data.map((item, i) => item.artist && (
                    <div key={`artist-${i}`}>{item.artist}</div>
                ))}
            </div>
        );
    };
});

jest.mock('@/components/player', () => {
    return function MockPlayer() {
        return <div data-testid="player">Player</div>;
    };
});

jest.mock('@/components/create-edit-modal', () => {
    return function MockCreateEditModal() {
        return <button data-testid="create-edit-modal">Create/Edit</button>;
    };
});

describe('Tracks Component', () => {
    const mockTracks = [
        {
            id: '1',
            title: 'Test Track 1',
            artist: 'Test Artist 1',
            album: 'Test Album 1',
            genre: 'Rock',
            coverImage: 'cover1.jpg',
            audioFile: 'audio1.mp3',
            isPlaying: false,
            createdAt: '2023-01-01'
        },
        {
            id: '2',
            title: 'Test Track 2',
            artist: 'Test Artist 2',
            album: 'Test Album 2',
            genre: 'Pop',
            coverImage: 'cover2.jpg',
            audioFile: 'audio2.mp3',
            isPlaying: false,
            createdAt: '2023-01-02'
        }
    ];

    const mockTracksResponse = ok({
        data: mockTracks,
        meta: {
            total: 2,
            page: 1,
            limit: 10,
            totalPages: 1
        }
    });

    const mockGenres = ok(['Rock', 'Pop', 'Jazz']);

    beforeEach(() => {
        jest.clearAllMocks();
        (getTracks as jest.Mock).mockResolvedValue(mockTracksResponse);
        (getGenres as jest.Mock).mockResolvedValue(mockGenres);
    });

    test('renders tracks component with header', async () => {
        render(<Tracks />);

        expect(screen.getByTestId('tracks-header')).toHaveTextContent('Tracks');
        await waitFor(() => {
            expect(getTracks).toHaveBeenCalledTimes(1);
        });
    });

    test('displays tracks data after loading', async () => {
        render(<Tracks />);

        await waitFor(() => {
            expect(screen.getByText('Test Track 1')).toBeInTheDocument();
            expect(screen.getByText('Test Artist 2')).toBeInTheDocument();
        });
    });

    test('handles search input', async () => {
        render(<Tracks />);

        const searchInput = await screen.findByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: 'search term' } });

        // Need to wait for debounce to complete
        await waitFor(() => {
            expect(getTracks).toHaveBeenCalledTimes(2);
        }, { timeout: 400 });
    });

    test('handles pagination', async () => {
        (getTracks as jest.Mock).mockResolvedValue(ok({
            data: mockTracks,
            meta: {
                total: 20,
                page: 1,
                limit: 10,
                totalPages: 2
            }
        }));

        render(<Tracks />);

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        const nextButton = await screen.findByTestId('pagination-next');
        fireEvent.click(nextButton);

        await waitFor(() => {
            expect(getTracks).toHaveBeenCalledWith(expect.objectContaining({
                page: 2
            }));
        });
    });
}); 