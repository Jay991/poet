import * as React from 'react';
import { Link } from 'react-router';
import * as moment from 'moment';

import '../extensions/String';
import './LatestBlocks.scss';

import Config from '../config';

import FetchComponent, { FetchComponentProps } from '../hocs/FetchComponent'

function renderBlock(props: any) {
  return (
    <tr key={props.bitcoinHash}>
      <td><span className="text-truncate">{props.bitcoinHeight}</span></td>
      <td><span className="text-truncate">{props.bitcoinHash.firstAndLastCharacters(4)}</span></td>
      <td>{moment(props.timestamp).fromNow()}</td>
    </tr>
  )
}

function render(props: FetchComponentProps) {
  return (
    <table className="table table-hover latest-blocks">
      <thead>
        <tr>
          <th colSpan={2}>Poet Blockchain</th>
          <th className="more-link"><Link to="/block">view all »</Link></th>
        </tr>
      </thead>
      <tbody>
      { props.elements.map(renderBlock) }
      </tbody>
    </table>
  )
}

export interface LatestBlocksProps extends FetchComponentProps {
}

function propsToUrl(props: LatestBlocksProps) {
  return {
    url: `${Config.api.explorer}/blocks`
  }
}

export default FetchComponent(propsToUrl, render);