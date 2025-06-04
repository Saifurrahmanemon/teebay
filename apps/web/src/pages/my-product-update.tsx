import { Container } from '@mantine/core';
import React from 'react';
import { useParams } from 'react-router-dom';

import UpdateMyProduct from '@/components/my-products/update-product';

function MyProductUpdate() {
  const { id } = useParams();

  if (!id) {
    return (
      <Container>
        <h1>ID not Found</h1>
      </Container>
    );
  }

  return (
    <div>
      <UpdateMyProduct productId={id} />
    </div>
  );
}

export default MyProductUpdate;
