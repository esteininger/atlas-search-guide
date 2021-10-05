const processSessions = require('./index');

const eventsBySession = [
  {
    "session_id": "1",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "romanian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      },
      {
        "event_id": "payment_success"
      }
    ],
    "searchQuery": "romanian food"
  }, {
    "session_id": "2",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "hungarian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      }
    ],
    "searchQuery": "hungarian food"
  },
  {
    "session_id": "3",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "italian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "western european cuisine"
        }
      }
    ],
    "searchQuery": "sad food"
  }
];

test('1 - no matches', () => {
  const updatedElement = {
    "session_id": "1",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "romanian food"
      },
      {
        "event_id": "add_to_cart",
      },
      {
        "event_id": "checkout"
      },
      {
        "event_id": "payment_success"
      }
    ],
    "searchQuery": "romanian food"
  }
  const testSessions = [updatedElement, ...eventsBySession.slice(1)];
  const results = processSessions(testSessions);
  expect(results).toMatchObject([]);
});

test('2 - romanian food and hungarian food match, sad food has no match', () => {
  const results = processSessions(eventsBySession);
  expect(results).toContainEqual({ mappingType: 'equivalent', synonyms: [ 'romanian', 'hungarian' ] });
});

test('3 - all foods match', () => {
  const updatedElement = {
    "session_id": "3",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "italian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      }
    ],
    "searchQuery": "yummy food"
  }
  const testSessions = [...eventsBySession.slice(0,2), updatedElement];
  const results = processSessions(testSessions);
  expect(results).toContainEqual({ mappingType: 'equivalent', synonyms: [ 'romanian', 'yummy', 'hungarian' ] });
});

test('4 - duplicate successful session', () => {
  const updatedElement = {
    "session_id": "6",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "romanian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      },
      {
        "event_id": "payment_success"
      }
    ],
    "searchQuery": "romanian food"
  }
  const testSessions = [...eventsBySession, updatedElement];
  const results = processSessions(testSessions);
  expect(results).toContainEqual({ mappingType: 'equivalent', synonyms: [ 'romanian', 'hungarian' ] });
});

test('5 - duplicate incomplete session w/successful session match', () => {
  const updatedElement = {
    "session_id": "6",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "hungarian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      }
    ],
    "searchQuery": "hungarian food"
  }
  const testSessions = [...eventsBySession, updatedElement];
  const results = processSessions(testSessions);
  expect(results).toContainEqual({ mappingType: 'equivalent', synonyms: [ 'romanian', 'hungarian' ] });
});

test('6 - multiple successful sessions w/incomplete sessions match', () => {
  const updatedElement = {
    "session_id": "6",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "my homecooked food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "western european cuisine"
        }
      },
      {
        "event_id": "checkout"
      },
      {
        "event_id": "payment_success"
      }
    ],
    "searchQuery": "my homecooked food"
  }
  const testSessions = [...eventsBySession, updatedElement];
  const results = processSessions(testSessions);
  expect(results).toEqual([{ mappingType: 'equivalent', synonyms: [ 'romanian', 'hungarian' ] }, { mappingType: 'equivalent', synonyms: [ 'my homecooked', 'sad' ] }]);
});

test('7 - multiple successful sessions w/successful session match and incomplete session match', () => {
  const updatedElement = {
    "session_id": "6",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "eastern european food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      },
      {
        "event_id": "payment_success"
      }
    ],
    "searchQuery": "eastern european food"
  }
  const testSessions = [...eventsBySession, updatedElement];
  const results = processSessions(testSessions);
  expect(results).toContainEqual({ mappingType: 'equivalent', synonyms: [ 'eastern european', 'hungarian', 'romanian'] });
});
