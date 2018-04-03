import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Button, Col, Row, Alert } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { withTracker } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import { Counts } from 'meteor/tmeasday:publish-counts';
import Pager from 'react-pager';
import EventOccurrences from '../../../api/EventOccurrences/EventOccurrences';
import { timeago } from '../../../modules/dates';
import Loading from '../../components/Loading/Loading';

const pageSize = 5;
const currentPage = new ReactiveVar(1);

class EventOccurrenceViewer extends React.Component {
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

  handleRemove(_id) {
    if (confirm('Are you sure? This is permanent!')) {
      const recordID = { _id };
      Meteor.call('eventOccurrence.remove', recordID, (error) => {
        if (error) {
          Bert.alert(`shit${error.reason}`, 'danger');
        } else {
          Bert.alert('Event occurrence deleted!', 'success');
        }
      });
    }
  }

  render() {
    const {
      loading, eventOccurrences, eventId, totalOccurrences,
    } = this.props;
    return (
      <div>
        {
        !loading ? (
          <div className="EventsOccurrences">
            <div className="page-header clearfix">
              <h4 className="pull-left">Event Occurrences Log</h4>
              <Link className="btn btn-success pull-right" to={`/events/log/${eventId}`}>Log New</Link>
            </div>
            {eventOccurrences.length > 0 ?
                  eventOccurrences.map(({
                    _id, createdAt,
                  }, index) => (
                    <Row key={_id} className="well-sm">
                      <Col xs={9}>
                        {eventOccurrences[index].occurrenceItems.length} {eventOccurrences[index].occurrenceItems.length > 1 ? 'things' : 'thing'} logged {timeago(createdAt)}
                        <ul>
                          {eventOccurrences[index].occurrenceItems.map(thing => <li key={thing.title}>{thing.title}</li>)}
                        </ul>
                      </Col>
                      <Col xs={3}>
                        <Button
                          bsStyle="danger"
                          className="btn-sm"
                          onClick={() => this.handleRemove(_id)}
                          block
                        >
                          Delete
                        </Button>
                      </Col>
                    </Row>

                  ))
                : <Alert bsStyle="warning">Get logging!</Alert>}

            <Pager
              total={Math.floor(totalOccurrences / 5) + 1}
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


EventOccurrenceViewer.propTypes = {
  loading: PropTypes.bool.isRequired,
  eventOccurrences: PropTypes.arrayOf(PropTypes.object).isRequired,
  eventId: PropTypes.string.isRequired,
};

export default withTracker((_id) => {
  // console.log('id is', _id.match.params._id);
  const eventId = _id.match.params._id;
  const subscription = Meteor.subscribeWithPagination('eventoccurrences.paged', eventId, (currentPage.get() - 1) * pageSize, pageSize);
  const subscriptioncount = Meteor.subscribe('eventoccurrences.count', eventId);
  console.log('here, currentpage is ', currentPage.get(), 'and page size is ', pageSize);
  console.log('subscriptioncount is ', subscriptioncount, 'counts get is ', Counts.get('eventoccurrences.count'));
  return {
    loading: !subscription.ready(),
    eventOccurrences: EventOccurrences.find({ eventId }, { sort: { createdAt: -1 } }).fetch(),
    eventId,
    totalOccurrences: Counts.get('eventoccurrences.count'),
    currentPagetest: currentPage,
  };
})(EventOccurrenceViewer);
