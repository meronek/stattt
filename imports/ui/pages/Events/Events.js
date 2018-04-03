import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Well, Alert, Button, Row, Col } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Pager from 'react-pager';
import EventsCollection from '../../../api/Events/Events';
import { monthDayYear } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

// import './Documents.scss';
const pageSize = 5;
const currentPage = new ReactiveVar(1);


class Events extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      visiblePage: 6,
    };

    this.handleRemove = this.handleRemove.bind(this);
    this.handlePageChanged = this.handlePageChanged.bind(this);
  }

  handlePageChanged(newPage) {
    this.setState({ current: newPage });
    currentPage.set(newPage + 1);
    // console.log('now currentpage is', currentPage);
  }

  handleRemove(eventId) {
    if (confirm('Are you sure? This is permanent!')) {
      Meteor.call('event.remove', eventId, (error) => {
        if (error) {
          Bert.alert(error.reason, 'danger');
        } else {
          Bert.alert('Event deleted!', 'success');
        }
      });
    }
  }


  render() {
    const {
      loading, events, match, history, totalEvents,
    } = this.props;
    return (
      <div>
        {
          !loading ? (
            <div className="Events">
              <div className="page-header clearfix">
                <h4 className="pull-left">Events</h4>
                <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add Event</Link>
              </div>
              {events.length ?
                    events.map(({
                      _id, title, ispublic, createdAt, occurrenceOptions,
                    }) => (
                      <Well key={_id}>
                        <Row>
                          <Col sm={12}>
                            <h4>{title}</h4>
                            {occurrenceOptions.filter(occurrenceOptions => occurrenceOptions.active === true).length} {occurrenceOptions.filter(occurrenceOptions => occurrenceOptions.active === true).length === 1 ? 'Option' : 'Options'}, {monthDayYear(createdAt)}, {ispublic ? 'Public' : 'Private'}

                          </Col>
                        </Row>
                        <Row className="well-sm">
                          <Col xs={4}>
                            <Button
                              bsStyle="primary"
                              onClick={() => history.push(`${match.url}/log/${_id}`)}
                              block
                            >
                            Log
                            </Button>
                          </Col>
                          <Col xs={4}>
                            <Button
                              bsStyle="primary"
                              onClick={() => history.push(`${match.url}/${_id}`)}
                              block
                            >
                            Options
                            </Button>
                          </Col>
                          <Col xs={4}>
                            <Button
                              bsStyle="danger"
                              onClick={() => this.handleRemove(_id)}
                              block
                            >
                            Delete
                            </Button>
                          </Col>
                        </Row>
                      </Well>
                    ))
                   : <Alert bsStyle="warning">Create some events and get logging!</Alert>}

              <Pager
                total={Math.floor(totalEvents / 5) + 1}
                current={this.state.current}
                visiblePages={this.state.visiblePage}
                titles={{ first: 'First', last: 'Last' }}
                className="pagination-sm"
                onPageChanged={this.handlePageChanged}
              />

            </div>

          ) : <Loading />
        }
      </div>
    );
  }
}


Events.propTypes = {
  loading: PropTypes.bool.isRequired,
  events: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withTracker(() => {
  // using this for pagination: https://atmospherejs.com/percolate/paginated-subscription
  // also, watch this video: https://www.youtube.com/watch?v=FyUP4qvoroU
  // console.log('here, currentpage is ', currentPage.get(), 'and page size is ', pageSize);
  const subscription = Meteor.subscribeWithPagination('events.paged', (currentPage.get() - 1) * pageSize, pageSize);

  const subscriptioncount = Meteor.subscribe('events.count');
  // console.log('subscriptioncount is ', subscriptioncount, 'counts get is ', Counts.get('events.count'));
  return {
    loading: !subscription.ready(),
    events: EventsCollection.find({}, { sort: { createdAt: -1 } }).fetch(),
    totalEvents: Counts.get('events.count'),
    currentPagetest: currentPage,
  };
})(Events);
