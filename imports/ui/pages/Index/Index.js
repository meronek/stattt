import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <img
      src="/statt400logo.png"
      alt="Stattt"
    />
    <p className="well-sm">
      Just for fun and the love of numbers and patterns. Stattt is a quick and simple way to survey and log things about an event.
    </p>
    <p>
      <a href="/signup" className="btn btn-primary btn-lg">Start Logging</a>
    </p>
  </div>
);

export default Index;
