import React, { useState } from 'react';
import { message, Typography, Input, Button, Form, List } from 'antd';

const { Text } = Typography;

export default function Artists() {
    // store related artists and their concerts
    const [artists, setArtists] = useState([]);

    // set the related artists and their concert information
    const onFinish = values => {
        fetch("/search/artist/" + values.artist)
            .then(res => res.json())
            .then(res => res.artists_concerts)
            .then(data =>
                !(data==null)?
                data.map(artist => {
                    // only return artist name if the artist do not have a recent concert
                    if (artist[1] == null) {
                        return { 
                            name: artist[0],
                            displayName: null,
                            uri: null,
                            startDate: null,
                            venue: null,
                            status: null
                        }
                    } else {
                        return {
                            name: artist[0],
                            displayName: artist[1].displayName,
                            uri: artist[1].uri,
                            startDate: artist[1].start.date,
                            venue: artist[1].venue,
                            status: artist[1].status
                        };
                    }
                }): message.warning('Cannot find information about the input artist!')
            )
            .then(data => !(data===true)?setArtists(data):"")
    }


    return (
        <div>
            <Text style={{ margin: '30px 0' }}> You may search an artist to find his/her related artists and their most recent concert information.</Text>
            <Form
                layout="inline"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                style={{ margin: "20px" }}
            >
                <Form.Item
                    name="artist"
                    label="Artist Name"
                >
                    <Input placeholder="Artist Name" style={{ height: "30px", width: "150px" }} allowClear />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" style={{ height: "30px", width: "150px" }}>Search</Button>
                </Form.Item>


            </Form>
            <List
                pagination={{ pageSize: 5 }}
                itemLayout="vertical"
                dataSource={artists}
                renderItem={item => (
                    <List.Item
                        actions={[

                        ]}>
                        <List.Item.Meta
                            title={<a href={item.uri}>{item.name}</a>}
                            description={
                                !(item.displayName===null | item.status==='cancelled') ? "The most recent concert "+ item.displayName +" is on " + item.startDate + " at " + item.venue.displayName
                                : 'The artist do not have any recent concert.'
                            }
                        />
                    </List.Item>
                )}
            />
        </div>
    )

}