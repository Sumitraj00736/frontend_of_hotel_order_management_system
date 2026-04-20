import React from 'react';
import TablesPage from './tableFeature/TablesPage.jsx';

export default function Table({ tables, spaces, reload }) {
  return <TablesPage tables={tables} spaces={spaces} reload={reload} />;
}

