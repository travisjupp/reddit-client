
import Comment from './Comment.jsx';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import store from '../../store/store.js';

it('renders without crashing', () => {
    const div = document.createElement('div');
    render(<Provider store={store}><Comment /></Provider>, div);
});

// test('renders learn react link', () => {
//   render(<Comment />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
