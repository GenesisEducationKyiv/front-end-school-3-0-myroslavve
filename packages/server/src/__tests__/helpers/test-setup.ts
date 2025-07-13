// This file sets up the test environment before any tests run

// Ensure we're in test mode
process.env.NODE_ENV = 'test';

// Define test paths
process.env.DATA_DIR = './test-data';
process.env.TRACKS_DIR = './test-data/tracks';
process.env.UPLOADS_DIR = './test-data/uploads';
process.env.GENRES_FILE = './test-data/genres.json';

// Set test flag
process.env.TEST_MODE = 'true';