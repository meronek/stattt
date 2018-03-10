import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <img
      src="/statt400logo.png"
      alt="Clever Beagle"
    />
    <h1>Statt</h1>
    <p>
      Just for fun and the love of numbers and patterns. Stattt is a quick and simple way to survey and log things about an event.
    </p>
    <footer>
      This project is helping me learn Meteor, React, and Mongo DB.
      <div>
        <Button href="https://github.com/meronek/stattt"><i className="fa fa-star" /> Star on GitHub</Button>
      </div>
    </footer>
  </div>
);

export default Index;
