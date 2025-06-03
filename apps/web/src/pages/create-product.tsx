import { ProductForm } from '@/components/create-product/product-form';
import { Container } from '@mantine/core';

function CreateProduct() {
  return (
    <Container my={40}>
      <ProductForm />
    </Container>
  );
}

export default CreateProduct;
