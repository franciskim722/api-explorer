import React from 'react';
import ReactDOM from 'react-dom';
import ExplorerComponent from './ExplorerComponent';

const apiConfig = {
  title: 'Add new user',
  url: 'https://jsonplaceholder.typicode.com/users',
  method: 'POST',
  body: [
    {
      name: 'email',
      type: 'email',
      max: 24,
      min: 3,
    },
    {
      name: 'full-name',
      type: 'text',
      placeholder: 'John Doe',
      required: true,
    },
    {
      name: 'phone',
      type: 'tel',
      pattern: '[0-9]{3}-[0-9]{3}-[0-9]{4}',
    },
  ]
}

ReactDOM.render(
  <React.StrictMode>
    <ExplorerComponent {...apiConfig} />
  </React.StrictMode>,
  document.getElementById('root')
);