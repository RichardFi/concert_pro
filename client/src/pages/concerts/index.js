import React, { useState} from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { message, Input, Button, Form, List, Row, Col } from 'antd';

export default function Concerts() {
  // store locations of the search result
  const [location, setLocation] = useState([]);
  // store concerts of the user selection
  const [concert, setConcert] = useState([]);

  // search and set locations information
  const onFinish = values => {
    fetch("/search/location/" + values.location)
      .then(res => res.json())
      .then(data =>
        data.map(location => {
          return {
            city: location.city.displayName,
            lat: location.city.lat,
            lng: location.city.lng,
            country: location.city.country.displayName,
            id: location.metroArea.id
          };
        })
      )
      .then(location => setLocation(location))
  }

  // set the markers of concerts on map
  const onClickCity = values => {
    fetch("/search/concert/" + values.id)
      .then(res => res.json())
      .then(res => res.resultsPage.results.event)
      .then(data =>
        !(data==null)?
        data.map(concert => {
          return {
            name: concert.displayName,
            city: concert.venue.displayName,
            lat: concert.venue.lat,
            lng: concert.venue.lng,
            type:concert.type,
            date: concert.start.date,
            uri: concert.uri,
            performance: concert.performance.map(artist=>{return artist.displayName})
          };
        }):  message.warning('There is no concert in this location!')
      )
      .then(concert => !(concert===true)?setConcert(concert):"");

  }
  const position = [-27.5, 153.017]

  return (
    <div>
      <Row>
        <Col span={6} >
          <Form
            layout="inline"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            style={{ margin: "20px" }}
          >
            <Form.Item
              name="location"
              label="Location Name"
            >
              <Input placeholder="Location Name" style={{ height: "30px", width: "120px" }} allowClear />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ height: "30px", width: "100px" }}>Search</Button>
            </Form.Item>
          </Form>
          <List
            pagination={{ pageSize: 5 }}
            itemLayout="vertical"
            dataSource={location}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  title={<Button onClick={() => { onClickCity(item) }}>{item.city}</Button>}
                  description={"Country: " + item.country

                  }
                />
              </List.Item>
            )}
          />
        </Col>
        <Col span={18}>
          <Map style={{ width: "100%", height: "760px" }} center={position} zoom={13}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />

            {concert && (
              concert.map(con =>
                !(con.lat==null | con.lat==null) ? 
                <Marker position={[con.lat, con.lng]} key={con.uri}>
                  <Popup>
                    <div>
                      <a href={con.uri}>
                        <h3>
                          {con.name}
                        </h3>
                      </a>          
                      <p>
                        {"Venue: "+ con.city}
                      </p>
                      <p>
                        {"Type: "+ con.type}
                      </p>
                      <p>
                        {"Date: "+ con.date}
                      </p>
                      <p>
                        {"Artists: "+ con.performance}
                      </p>
                      <Button href={con.uri} target="_blank">
                        View on Songkick
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              : ''

              )
            )}
          </Map>
        </Col>
      </Row>
    </div>
  );
}