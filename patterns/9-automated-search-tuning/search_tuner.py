import math
from collections import Counter

events_by_sessions = [{
  "_id": "1",
  "events": [
    {
      "event_id": "search_query",
      "search_value": "romanian food"
    },
    {
      "event_id": "add_to_cart"
    },
    {
      "event_id": "checkout"
    },
    {
      "event_id": "payment_success"
    }
  ],
  "searchQuery": "romanian food"
},{
  "_id": "2",
  "events": [
    {
      "event_id": "search_query",
      "search_value": "hungarian food"
    },
    {
      "event_id": "add_to_cart"
    }
  ],
  "searchQuery": "hungarian food"
},
{
  "_id": "3",
  "events": [
    {
      "event_id": "search_query",
      "search_value": "asd food"
    },
    {
      "event_id": "add_to_cart"
    }
  ],
  "searchQuery": "sad food"
}]

# what percentage similarity between two sets of click/event streams
# we'd accept to be determined as similar enough to produce a synonym
# relationship
accepted_confidence_percent = 90
# boost the confidence score when the following values are present
# in the eventstream
event_boosts = {
    "payment_success":10
}


def compare_lists(events_by_sessions):
    # we want to start the iteration on the longest list
    longer_list = events_by_sessions[0]
    # iterate every array that is NOT the longest
    for user_session in events_by_sessions[1:]:
        # initiate counter, we want to count the number of
        # identical events in the array
        num_of_matches = 0
        # TODO: make this recursive
        for index, event in enumerate(user_session['events']):
            # compare each event in longest to the one in shortest

            print(user_session['searchQuery'])





if __name__ == '__main__':
    compare_lists(events_by_sessions)
