import React, { Component } from 'react';
import QRCode from 'qrcode.react';

interface Props {
  url: string|Blob;
}

class QRCodeComponent extends Component<Props> {
  render() {
    const { url } = this.props;
    
    let value = '';

    if (url instanceof Blob) {
      url.text().then((text) => {
        value = text;
      });
    } else {
      value = url;
    }

    return (
      <div>
        {url && <QRCode value={value} />}
      </div>
    );
  }
}

export default QRCodeComponent;
