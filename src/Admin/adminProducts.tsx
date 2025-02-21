import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TablePagination,
    Paper,
    Button,
    Modal,
    TextField,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
    fetchProducts,
    createProduct,
    updateProduct,
} from "../services/productService";
import { fetchCategories } from "../services/categoryService";

const AdminProducts: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [modalOpen, setModalOpen] = useState(false);
    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        id: 0,
        name: "",
        price: 0,
        stock: 0,
        sold: 0,
        categoryId: 0,
        images: [] as { id: number; url: string }[],
        isActive: true,
    });
    const [imageInput, setImageInput] = useState("");
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [formErrors, setFormErrors] = useState({ name: "", price: "", stock: "" });
    const [isEditMode, setIsEditMode] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Snackbar Mesajı
    const handleSnackbarMessage = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    // Ürün ve Kategori Verilerini Yükleme
    useEffect(() => {
        const loadData = async () => {
            try {
                const productData = await fetchProducts();
                const categoryData = await fetchCategories();
                setProducts(productData);
                setCategories(categoryData);
            } catch (error) {
                console.error("Veriler yüklenirken hata oluştu:", error);
            }
        };
        loadData();
    }, []);

    // Modal Aç/Kapat
    const handleOpenModal = (product?: typeof formValues) => {
        if (product) {
            setFormValues(product);
            setIsEditMode(true);
        } else {
            setFormValues({
                id: 0,
                name: "",
                price: 0,
                stock: 0,
                sold: 0,
                categoryId: 0,
                images: [],
                isActive: true,
            });
        }
        setImageInput("");
        setFormErrors({ name: "", price: "", stock: "" });
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    const handleOpenImageModal = (images: { id: number; url: string }[]) => {
        setSelectedImages(images.map((img) => img.url));
        setImageModalOpen(true);
    };

    const handleCloseImageModal = () => setImageModalOpen(false);

    // Form Doğrulama
    const validateForm = () => {
        let errors = { name: "", price: "", stock: "" };
        let isValid = true;

        if (!formValues.name.trim()) {
            errors.name = "Ürün adı zorunludur.";
            isValid = false;
        }

        if (formValues.price <= 0) {
            errors.price = "Fiyat pozitif bir değer olmalıdır.";
            isValid = false;
        }

        if (formValues.stock < 0) {
            errors.stock = "Stok sıfır veya pozitif bir değer olmalıdır.";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Ürün Ekleme/Güncelleme
    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        try {
            const formattedImages = formValues.images.map((img) => img.url);
            if (isEditMode) {
                const updatedProduct = await updateProduct(formValues.id,{
                    ...formValues,
                    images: formattedImages, // Sadece URL'leri gönder
                });
                setProducts((prev) =>
                    prev.map((product) =>
                        product.id === formValues.id ? updatedProduct : product
                    )
                );
                handleSnackbarMessage("Ürün başarıyla güncellendi!");
            } else {
                const { id, ...productData } = formValues;
                const newProduct = await createProduct({
                    ...productData,
                    images: formattedImages, // Sadece URL'leri gönder
                });
                setProducts((prev) => [...prev, newProduct]);
                handleSnackbarMessage("Ürün başarıyla eklendi!");
            }
            handleCloseModal();
        } catch (error) {
            console.error("Ürün işlemi sırasında hata oluştu:", error);
            handleSnackbarMessage("Ürün işlemi başarısız oldu!");
        }
    };

    // Ürün Durumu Değiştirme
    const toggleProductStatus = async (productId: number) => {
        try {
            const product = products.find((p) => p.id === productId);
            if (!product) return;
            const updatedProduct = await updateProduct(productId, {
                ...product,
                isActive: !product.isActive,
            });
            setProducts((prev) =>
                prev.map((p) => (p.id === productId ? updatedProduct : p))
            );
            handleSnackbarMessage(
                `Ürün ${updatedProduct.isActive ? "Aktif" : "Pasif"} yapıldı!`
            );
        } catch (error) {
            console.error("Ürün durumu değiştirilirken hata oluştu:", error);
            handleSnackbarMessage("Ürün durumu değiştirilemedi.");
        }
    };

    // Ürün Arama
    const filteredProducts = products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            categories.find((cat) => cat.id === product.categoryId)?.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Ürün Yönetimi
            </Typography>
            {/* Arama Alanı */}
            <TextField
                fullWidth
                label="Ürün Ara"
                sx={{ mb: 3 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button variant="contained" onClick={() => handleOpenModal()} sx={{ mb: 2 }}>
                Ürün Ekle
            </Button>

            {/* Ürün Tablosu */}
            <Paper sx={{ overflowX: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ürün Adı</TableCell>
                            <TableCell>Fiyat</TableCell>
                            <TableCell>Stok</TableCell>
                            <TableCell>Satın Alınma</TableCell>
                            <TableCell>Kategori</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Görseller</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.stock}</TableCell>
                                    <TableCell>{product.sold}</TableCell>
                                    <TableCell>
                                        {categories.find((cat) => cat.id === product.categoryId)
                                            ?.name || "Kategori Yok"}
                                    </TableCell>
                                    <TableCell>
                                        {product.isActive ? "Aktif" : "Pasif"}
                                    </TableCell>
                                    <TableCell>
                                        {product.images.length > 0 ? (
                                            <IconButton
                                                onClick={() =>
                                                    handleOpenImageModal(product.images)
                                                }
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        ) : (
                                            "Görsel Yok"
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenModal(product)}
                                            sx={{ mr: 1 }}
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color={product.isActive ? "error" : "success"}
                                            onClick={() => toggleProductStatus(product.id)}
                                        >
                                            {product.isActive ? "Pasif Yap" : "Aktif Yap"}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={products.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) =>
                        setRowsPerPage(parseInt(e.target.value, 10))
                    }
                />
            </Paper>

            {/* Ürün Ekle/Düzenle Modal */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6">
                        {isEditMode ? "Ürün Düzenle" : "Ürün Ekle"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Ürün Adı"
                        sx={{ mb: 2 }}
                        value={formValues.name}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        error={!!formErrors.name}
                        helperText={formErrors.name}
                    />
                    <TextField
                        fullWidth
                        label="Fiyat"
                        type="number"
                        sx={{ mb: 2 }}
                        value={formValues.price}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                price: parseFloat(e.target.value),
                            }))
                        }
                        error={!!formErrors.price}
                        helperText={formErrors.price}
                    />
                    <TextField
                        fullWidth
                        label="Stok"
                        type="number"
                        sx={{ mb: 2 }}
                        value={formValues.stock}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                stock: parseInt(e.target.value, 10),
                            }))
                        }
                        error={!!formErrors.stock}
                        helperText={formErrors.stock}
                    />
                    <TextField
                        fullWidth
                        select
                        label="Kategori"
                        sx={{ mb: 2 }}
                        SelectProps={{
                            native: true,
                        }}
                        value={formValues.categoryId}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                categoryId: parseInt(e.target.value, 10),
                            }))
                        }
                    >
                        <option value={0}>Kategori Seç</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        label="Görsel URL"
                        sx={{ mb: 2 }}
                        value={imageInput}
                        onChange={(e) => setImageInput(e.target.value)}
                    />
                    <Button
                        variant="outlined"
                        fullWidth
                        sx={{ mb: 2 }}
                        onClick={() => {
                            if (imageInput.trim()) {
                                setFormValues((prev) => ({
                                    ...prev,
                                    images: [...prev.images, { id: Date.now(), url: imageInput }],
                                }));
                                setImageInput("");
                            }
                        }}
                    >
                        Görsel Ekle
                    </Button>
                    <Button variant="contained" fullWidth onClick={handleFormSubmit}>
                        Kaydet
                    </Button>
                </Box>
            </Modal>

            {/* Görseller Modal */}
            <Modal open={imageModalOpen} onClose={handleCloseImageModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 500,
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Ürün Görselleri
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                        }}
                    >
                        {selectedImages.map((url, index) => (
                            <Box key={index} sx={{ position: "relative" }}>
                                <img
                                    src={url}
                                    alt={`Görsel ${index + 1}`}
                                    style={{
                                        width: "calc(50% - 8px)",
                                        borderRadius: "8px",
                                        border: "1px solid #ddd",
                                    }}
                                />
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Modal>

            {/* Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminProducts;
