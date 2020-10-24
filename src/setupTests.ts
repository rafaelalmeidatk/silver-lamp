// Load the env files
require('dotenv').config({ path: '.env' });

// We require next here to apply the built-in fetch polyfill to all the tests
import 'next';
import '@testing-library/jest-dom/extend-expect';
