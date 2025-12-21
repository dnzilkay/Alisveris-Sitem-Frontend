import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Pagination,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { fetchCategoryById } from "../services/categoryService";
import { fetchProducts } from "../services/productService";

interface Product {
    id: number;
    name: string;
    price: number;
    categoryId: number;
    images?: Array<{ url: string }>;
}

const CategoryPage: React.FC = () => {
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categoryName, setCategoryName] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchCategoryAndProducts = async () => {
            try {
                if (!id || isNaN(Number(id))) {
                    setError("Geçersiz kategori ID");
                    return;
                }

                // Kategori bilgilerini al
                const categoryData = await fetchCategoryById(Number(id));

                if (!categoryData || !categoryData.name) {
                    setError("Kategori bilgisi bulunamadı.");
                    return;
                }

                setCategoryName(categoryData.name);

                // Kategoriye ait ürünleri çek
                const allProducts = await fetchProducts();
                const categoryProducts = allProducts.filter((product: Product) => product.categoryId === Number(id));

                setProducts(categoryProducts);
                setError(null);
            } catch (error) {
                console.error("Veriler alınırken hata oluştu:", error);
                setError("Kategori ve ürün bilgileri alınırken bir hata oluştu.");
            }
        };

        fetchCategoryAndProducts();
    }, [id]);

    const paginatedProducts = products.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    return (
        <Box sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: "1200px", margin: "0 auto" }}>
            {error ? (
                <Typography
                    color="error"
                    variant="h6"
                    gutterBottom
                    sx={{
                        textAlign: "center",
                        py: 4,
                        fontSize: { xs: "1rem", md: "1.25rem" },
                    }}
                >
                    {error}
                </Typography>
            ) : (
                <>
                    <Typography
                        variant="h4"
                        gutterBottom
                        sx={{
                            fontWeight: 700,
                            mb: 3,
                            fontSize: { xs: "1.75rem", md: "2.5rem" },
                            color: "primary.main",
                        }}
                    >
                        {categoryName} Ürünleri
                    </Typography>

                    {paginatedProducts.length > 0 ? (
                        <>
                            <Grid container spacing={{ xs: 2, sm: 3, md: 3 }}>
                                {paginatedProducts.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                        <Card
                                            onClick={() => navigate(`/product/${product.id}`)}
                                            sx={{
                                                cursor: "pointer",
                                                borderRadius: 3,
                                                boxShadow: 3,
                                                transition: "all 0.3s ease",
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                "&:hover": {
                                                    boxShadow: 8,
                                                    transform: "translateY(-4px)",
                                                },
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                sx={{
                                                    height: { xs: 200, sm: 220, md: 240 },
                                                    objectFit: "cover",
                                                }}
                                                image={product.images?.[0]?.url || "https://via.placeholder.com/200"}
                                                alt={product.name}
                                            />
                                            <CardContent sx={{ flexGrow: 1 }}>
                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        fontWeight: 600,
                                                        mb: 1,
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient: "vertical",
                                                    }}
                                                >
                                                    {product.name}
                                                </Typography>
                                                <Typography
                                                    variant="h6"
                                                    color="primary"
                                                    sx={{ fontWeight: 700 }}
                                                >
                                                    {product.price.toLocaleString("tr-TR", {
                                                        style: "currency",
                                                        currency: "TRY",
                                                    })}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    marginTop: 4,
                                }}
                            >
                                <Pagination
                                    count={Math.ceil(products.length / itemsPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    color="primary"
                                    size={isMobile ? "small" : "medium"}
                                />
                            </Box>
                        </>
                    ) : (
                        <Box
                            sx={{
                                textAlign: "center",
                                py: 8,
                                backgroundColor: "background.paper",
                                borderRadius: 3,
                                boxShadow: 2,
                            }}
                        >
                            <Typography
                                variant="h6"
                                color="text.secondary"
                                sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                            >
                                Bu kategoriye ait ürün bulunamadı.
                            </Typography>
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

export default CategoryPage;
