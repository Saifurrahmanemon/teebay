import { Container } from '@mantine/core';

import { ProductForm } from '@/components/create-product/product-form';

function CreateProduct() {
  return (
    <Container my={40}>
      <ProductForm />
    </Container>
  );
}

export default CreateProduct;
