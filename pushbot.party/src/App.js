import React, {Component} from 'react'
import {QueryRenderer, graphql} from 'react-relay'

import {environment, AUTH_URL} from './Transport'
import Banner from './Banner'
import Login from './Login'
import Authenticated from './Authenticated'

import './App.css'

export default class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.renderResult = this.renderResult.bind(this)
  }

  render () {
    const query = graphql`
      query AppQuery {
        me {
          name
          avatar {
            image48
          }
        }

        title: documents(set: "title") {
          mine {
            text
            found
          }
        }
      }
    `

    return (
      <QueryRenderer
        environment={environment}
        query={query}
        render={this.renderResult} />
    )
  }

  renderResult ({error, props}) {
    let body = null

    if (error) {
      if (error.status === 401) {
        const backTo = encodeURIComponent(document.location.pathname)
        body = <Login authUrl={`${AUTH_URL}?backTo=${backTo}`} />
      } else {
        body = <div>{error.message}</div>
      }
    } else if (props) {
      body = <Authenticated />
    } else {
      body = (
        <div className='pushbot-loading'>
          <i className='fa fa-circle-o-notch fa-spin' aria-hidden='true' />
          loading
        </div>
      )
    }

    const username = props && props.me.name
    const title = props && props.title &&
      props.title.mine.found && props.title.mine.text
    const avatar = props && props.me.avatar &&
      props.me.avatar.image48

    return (
      <div className='container-fluid'>
        <div className='row'>
          <Banner
            username={username}
            title={title}
            avatar={avatar}
          />
        </div>
        {body}
      </div>
    )
  }
}