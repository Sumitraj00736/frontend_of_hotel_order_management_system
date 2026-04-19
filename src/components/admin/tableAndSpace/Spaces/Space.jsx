import React from 'react';
import SpacesPage from './spaceFeature/SpacesPage.jsx';

export default function Space({ spaces, reload }) {
  return <SpacesPage spaces={spaces} reload={reload} />;
}

