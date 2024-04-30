
import { render, screen } from '@testing-library/react';
import App2 from './App2.jsx';
import React from 'react';




it('renders learn react link', () => {
  render(<App2 date='today' />);
  // const linkElement = screen.getByText(/learn react/i);
  const linkElement = screen.getByText(/today/i);
  expect(linkElement).toBeInTheDocument();
});


it('renders without crashing', () => {
    const div = document.createElement('div');
    render(<App2 />, div);
});
