import React, { PureComponent } from 'react';
import fetch from 'isomorphic-fetch';
// import $ from 'jquery';

export default class Content extends PureComponent {
    state = {
        data: ''
    }

    componentDidMount() {
        fetch('http://localhost:8888/introduce')
        .then(function(response) {
            if (response.status >= 400) {
                throw new Error("Bad response from server");
            }
            return response.json();
        })
        .then(function(stories) {
            console.log(stories);
        });
        // $.get('http://localhost:8888/introduce',function(res) {
        //     console.log(res)
        // })
    }

    render() {
        return(
            <div>111</div>
        )
    }
}