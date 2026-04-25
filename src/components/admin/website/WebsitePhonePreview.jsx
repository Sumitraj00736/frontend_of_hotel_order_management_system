import React from 'react';

const WebsitePhonePreview = ({ TemplateComponent, restaurantName, settings, colorPalette }) => (
  <div className="web-phone-device">
    <div className="web-phone-bezel">
      <span className="web-phone-button web-phone-button-power" aria-hidden="true" />
      <span className="web-phone-button web-phone-button-volume-up" aria-hidden="true" />
      <span className="web-phone-button web-phone-button-volume-down" aria-hidden="true" />
      <div className="web-phone-frame">
        <div className="web-phone-camera-island" aria-hidden="true">
          <div className="web-phone-camera-lens" />
          <div className="web-phone-speaker" />
          <div className="web-phone-sensor" />
        </div>
        <div className="web-phone-screen">
          <div className="web-phone-screen-glare" aria-hidden="true" />
          <TemplateComponent 
            mode="mobile" 
            restaurantName={restaurantName} 
            settings={settings}
            colorPalette={colorPalette}
          />
        </div>
      </div>
    </div>
  </div>
);

export default WebsitePhonePreview;
