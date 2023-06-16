import React from 'react';
import List from '../../matter/List';
import { useParams } from 'react-router';

const SpaceMatterList = () => {
  const params = useParams<{
    spaceUuid: string;
  }>();

  return <List spaceUuid={params.spaceUuid} />;
};

export default SpaceMatterList;
