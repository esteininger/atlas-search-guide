
import React, { useState } from 'react'
import { Accordion, Card, Form, Col, Container, Row } from 'react-bootstrap';
import Layout from '../components/Layout';

const axios = require('axios');

type Props = {
  indexField: string
}

const Autocomplete = ({ indexField }: Props) => {

  const [query, setQuery] = useState('')
  const [matches, setMatches] = useState(null)
  const [results, setResults] = useState(null)
  const [isFuzzyMatch, setFuzzyMatch] = useState(false)
  const [searchLimit, setSearchLimit] = useState(10)

  /**
   * renderMatches
   * @returns 
   */
  const renderMatches = () => {
    let matchList = null
    if (matches) {
      matchList = matches.map((match, index) => {
        return match && match.score ? <a href="#" key={`match-${index}`} className="list-group-item list-group-item-action" onClick={() => { onSelect(match) }}>{match[indexField]} <i>(Score: {match.score.toFixed(3)})</i></a> : null
      })
    }
    return <div className="list-group position-fixed z-index-1000">
      {matchList}
    </div>
  }

  /**
   * renderResults
   * @returns 
   */
  const renderResults = () => {
    let resultsEl = null
    if (results) {
      resultsEl = results.map((result, index) => {
        return (
          <Card key={`card-${index}`} >
            <Accordion.Toggle eventKey={`${index}`} as={Card.Header}>
              Id: {result._id}
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={`${index}`}>
              <Card.Body>
                {
                  Object.keys(result).map((key, index) => {
                    return <Row key={`card-body-${index}`} ><code className={key === indexField ? 'highlight' : ''}><b>{key}</b>: {result[key]} </code></Row>
                  })
                }
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        )
      })
    }
    return (
      <Accordion className="mt-5" defaultActiveKey="0">
        {results ? <p>Found {results.length} results</p> : null}
        {resultsEl}
      </Accordion>)
  }

  /**
   * onSelect
   * @param match 
   */
  const onSelect = (match: any) => {
    setQuery(match[indexField]);
    setMatches(null);
    axios.get(`/api/document/${match._id}`).then(response => {
      console.log(`data`, response);
      setResults([response.data]);
    }).catch(error => {
      console.log(error.response)
    })
  }

  /**
   * onKeyDown
   * @param event 
   */
  const onKeyDown = async (event: any) => {
    setMatches(null)
    if (event.key === 'Enter') {
      axios.get(`/api/search?query=${event.target.value}&path=${indexField}&limit=${searchLimit}&fuzzy=${isFuzzyMatch}`).then(response => {
        console.log(`data`, response);
        setResults(response.data);
      }).catch(error => {
        console.log(error.response)
      })
      event.preventDefault();
    }
  }

  /**
   * onQueryChange
   * @param event 
   */
  const onQueryChange = async (event: any) => {
    setQuery(event.target.value);
    setResults(null);
    if (event.target.value) {
      axios.get(`/api/autocomplete?query=${event.target.value}&path=${indexField}&limit=${searchLimit}&fuzzy=${isFuzzyMatch}`).then(response => {
        console.log(`data`, response);
        setMatches(response.data);
      }).catch(error => {
        console.log(error.response)
      })
    }
    else {
      setMatches(null)
    }
  }

  /**
   * render
   */
  return (
    <Layout title="Auto-Complete">
      <Container fluid className="pt-5 mx-auto" >
        <Col className="justify-items-center">
          <Row>
            <h1 className="title">Atlas Search <span className="subtitle">Autocomplete</span> </h1>
          </Row>
          <Form className="mt-4">
            <Form.Row className="align-items-center">
              <Col sm={6} className="my-1">
                <Form.Text className="mb-1" muted>
                  Enter 2 characters or more to autocomplete values in {indexField}
                </Form.Text>
                <Form.Control placeholder={`Try entering "born" or "along"`} onChange={onQueryChange} onKeyDown={onKeyDown} value={query} />
                {renderMatches()}
              </Col>
              <Col xs="auto" className="my-1">
                <Form.Check
                  className="mt-4"
                  type="switch"
                  id="custom-switch"
                  label="Fuzzy Match"
                  onClick={() => {
                    setMatches(null);
                    setFuzzyMatch(!isFuzzyMatch)
                  }}
                />
              </Col>
            </Form.Row>
          </Form>

          <Row >
            <Col sm={6} className="">
              {renderResults()}
            </Col>
          </Row>

        </Col>
      </Container>
    </Layout>
  )
}

export default Autocomplete
