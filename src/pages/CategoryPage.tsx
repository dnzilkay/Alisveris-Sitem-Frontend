import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, Card, CardContent, CardMedia, Pagination } from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchCategoryById } from "../services/categoryService";
import { fetchProducts } from "../services/productService";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    isActive: boolean;
    images?: Array<{ id: number; url: string }>;
}

const CategoryPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { id = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                // Kategori bilgilerini ve ürünleri al
                const categoryData = await fetchCategoryById(Number(id));
                setCategoryName(categoryData.name);

                // Ürünleri al ve resimleri dahil et
                const productsWithImages = await Promise.all(
                    categoryData.products.map(async (product: Product) => {
                        const productDetails: Product[] = await fetchProducts();
                        const productImages = productDetails.find((p: Product) => p.id === product.id)?.images || [];
                        return {
                            ...product,
                            images: productImages,
                        };
                    })
                );

                setProducts(productsWithImages);
                setError(null);
            } catch (error) {
                console.error("Veriler alınırken hata oluştu:", error);
                setError("Kategori ve ürün bilgileri alınırken bir hata oluştu.");
            }
        };

        fetchCategoryData();
    }, [id]);

    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ padding: 4 }}>
            {error && (
                <Typography color="error" variant="h6" gutterBottom>
                    {error}
                </Typography>
            )}
            <Typography variant="h4" gutterBottom>
                {categoryName} Ürünleri
            </Typography>

            {paginatedProducts.length > 0 ? (
                <>
                    <Grid container spacing={3}>
                        {paginatedProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Card
                                    onClick={() => navigate(`/product/${product.id}`)}
                                    sx={{
                                        cursor: "pointer",
                                        "&:hover": { boxShadow: 5 },
                                    }}
                                >
                                    <CardMedia
                                        component="img"
                                        height="150"
                                        image={
                                            product.images && product.images.length > 0
                                                ? product.images[0].url
                                                : "https://via.placeholder.com/200"
                                        }
                                        alt={product.name}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{product.name}</Typography>
                                        <Typography>{product.price} TL</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
                        <Pagination
                            count={Math.ceil(products.length / itemsPerPage)}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Box>
                </>
            ) : (
                <Typography>Bu kategoriye ait ürün bulunamadı.</Typography>
            )}
        </Box>
    );
};

export default CategoryPage;
