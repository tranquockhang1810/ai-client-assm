"use client";
import { useState, useEffect } from "react";
import { Layout, Menu, Form, Input, Button, Upload, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";

const { Header, Content } = Layout;

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image_url: string;
  created_at: string;
  emotion?: string;
}

const App = () => {
  const [currentPage, setCurrentPage] = useState("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [reviewVisible, setReviewVisible] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (currentPage === "positive") {
      fetchProducts("POSITIVE");
    } else {
      fetchProducts();
    }
  }, [currentPage]);

  const fetchProducts = async (emotion?: string) => {
    setLoading(true);
    try {
      const url = emotion
        ? `${process.env.NEXT_PUBLIC_API_URL!}/products?emotion=${emotion}`
        : `${process.env.NEXT_PUBLIC_API_URL!}/products`;
      const res = await axios.get(url);
      setProducts(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (error) {
      message.error("Failed to fetch products");
      setProducts([]);
    }
    setLoading(false);
  };

  const handleAddProduct = async (values: { name: string; price: number }) => {
    if (!selectedFile) {
      message.error("Please upload an image");
      return;
    }

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("price", values.price.toString());
    formData.append("image", selectedFile);

    try {
      setAddLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL!}/products`, formData);
      message.success("Product added");
      fetchProducts();
    } catch (error) {
      message.error("Failed to add product");
    } finally {
      setAddLoading(false);
    }
  };

  const handleAddReview = async (productId: string, comment: string) => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL!}/reviews`, { productId, comment });
      message.success("Review added");
      fetchProducts();
    } catch (error) {
      message.error("Failed to add review");
    }
  };

  const menuItems = [
    { key: "products", label: "Manage Products" },
    { key: "positive", label: "Recommendations" },
  ];

  return (
    <Layout className="min-h-screen">
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={[currentPage]}
          onClick={(e) => setCurrentPage(e.key)}
          items={menuItems}
        />
      </Header>
      <Content className="p-5">
        {currentPage === "products" && (
          <>
            <Form className="flex flex-wrap gap-4 mb-6" layout="inline" onFinish={handleAddProduct}>
              <Form.Item name="name" rules={[{ required: true, message: "Enter product name" }]}>
                <Input placeholder="Product Name" />
              </Form.Item>
              <Form.Item name="price" rules={[{ required: true, message: "Enter product price" }]}>
                <Input placeholder="Price" type="number" />
              </Form.Item>
              <Upload beforeUpload={(file) => (setSelectedFile(file), false)}>
                <Button icon={<UploadOutlined />}>Upload Image</Button>
              </Upload>
              <Button type="primary" htmlType="submit" loading={addLoading}>Add Product</Button>
            </Form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              {products &&products?.map((item) => (
                <Card
                  key={item.id}
                  cover={<img className="h-[600px] object-cover" alt="product" src={`${process.env.NEXT_PUBLIC_API_URL!}${item.image_url}`} />}
                  className="shadow-lg rounded-lg p-4"
                >
                  <Card.Meta title={item.name} description={`Price: $${item.price}`} />
                  <p className="mt-2 font-semibold">Category: {item.category}</p>
                  <Button
                    className="my-3"
                    onClick={() => setReviewVisible({ [item.id]: !reviewVisible[item.id] })}
                  >
                    Add Review
                  </Button>
                  {reviewVisible[item.id] && (
                    <Form onFinish={(values) => handleAddReview(item.id, values.comment)}>
                      <Form.Item name="comment" rules={[{ required: true, message: "Enter review" }]}>
                        <Input.TextArea placeholder="Write a review" />
                      </Form.Item>
                      <Button type="primary" htmlType="submit">Submit</Button>
                    </Form>
                  )}
                </Card>
              ))}
            </div>
          </>
        )}

        {currentPage === "positive" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {products
              .filter((p) => p.emotion === "POSITIVE")
              .map((item) => (
                <Card
                  key={item.id}
                  cover={<img className="h-[600px] object-cover" alt="product" src={`${process.env.NEXT_PUBLIC_API_URL!}${item.image_url}`} />}
                  className="shadow-lg rounded-lg p-4"
                >
                  <Card.Meta title={item.name} description={`Price: $${item.price}`} />
                  <p className="mt-2 font-semibold">Category: {item.category}</p>
                  <p className="mt-2 text-green-600 font-semibold">Review Sentiment: {item.emotion}</p>
                </Card>
              ))}
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default App;
