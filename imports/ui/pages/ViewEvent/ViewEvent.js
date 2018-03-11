import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import Swipeable from 'react-swipeable';
import Events from '../../../api/Events/Events';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (eventId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('event.remove', eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Event deleted!', 'success');
        history.push('/events');
      }
    });
  }
};

const swiping = (e, deltaX, deltaY, absX, absY, velocity) => {
  console.log("You're Swiping...", e, deltaX, deltaY, absX, absY, velocity)
}

const swipingLeft = (e, absX) => {
  console.log("You're Swiping to the Left...", e, absX)
}

const swiped = (e, deltaX, deltaY, isFlick, velocity) => {
  console.log("You Swiped...", e, deltaX, deltaY, isFlick, velocity)
}

const swipedUp = (e, deltaY, isFlick) => {
  console.log("You Swiped Up...", e, deltaY, isFlick)
}

const renderEvent = (event, match, history) => (event ? (
  <Swipeable
    onSwiping={swiping}
    onSwipingLeft={swipingLeft}
    onSwiped={swiped}
    onSwipedUp={swipedUp}
  >
    <div className="ViewEvent">
      <div className="page-header clearfix">
        <h4 className="pull-left">{ event && event.title }</h4>
        <ButtonToolbar className="pull-right">
          <ButtonGroup bsSize="small">
            <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
            <Button onClick={() => handleRemove(event._id, history)} className="text-danger">
              Delete
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </div>
      { event && event.title }
    </div>
  </Swipeable>
) : <NotFound />);

const ViewEvent = ({
  loading, event, match, history,
}) => (
  !loading ? renderEvent(event, match, history) : <Loading />
);

ViewEvent.defaultProps = {
  event: null,
};

ViewEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
  event: PropTypes.object,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('event.view', eventId);

  return {
    loading: !subscription.ready(),
    event: Events.findOne(eventId),
  };
})(ViewEvent);
