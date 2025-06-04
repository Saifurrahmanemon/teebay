import { Container } from '@mantine/core';
import React from 'react';
import { useParams } from 'react-router-dom';

import ProductDetailsComponent from '@/components/all-products/product-details';

function ProductDetails() {
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
      <ProductDetailsComponent productId={id} />
    </div>
  );
}

export default ProductDetails;
