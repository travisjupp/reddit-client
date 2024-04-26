/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import App2 from './App2.jsx';
import React from 'react';

test('renders learn react link', () => {
  render(<App2 />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
