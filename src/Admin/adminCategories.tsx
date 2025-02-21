import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Button,
    Modal,
    TextField,
    Snackbar,
    Alert,
} from "@mui/material";
import {
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../services/categoryService";

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<any[]>([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [productModalOpen, setProductModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        id: 0,
        name: "",
        description: "",
        isActive: true,
    });
    const [selectedCategoryProducts, setSelectedCategoryProducts] = useState<any[]>([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Snackbar Kontrolü
    const handleSnackbarMessage = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    // Kategorileri Yükleme
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                console.log("Alınan Kategoriler:", data); // Debugging için
                setCategories(data);
            } catch (error) {
                console.error("Kategoriler yüklenirken hata oluştu:", error);
            }
        };
        loadCategories();
    }, []);

    // Modal Açma
    const handleOpenModal = (category?: typeof formValues) => {
        if (category) {
            console.log("Düzenlenecek Kategori:", category); // Debugging için
            setFormValues(category);
            setIsEditMode(true);
        } else {
            setFormValues({ id: 0, name: "", description: "", isActive: true });
            setIsEditMode(false);
        }
        setModalOpen(true);
    };

    // Modal Kapatma
    const handleCloseModal = () => setModalOpen(false);

    // Kategori Ekleme/Düzenleme
    const handleFormSubmit = async () => {
        if (!formValues.name.trim()) {
            handleSnackbarMessage("Kategori adı zorunludur!");
            return;
        }

        try {
            if (isEditMode) {
                // Güncelleme işlemi için id'yi dahil et
                const updatedCategory = await updateCategory(formValues.id, formValues);
                setCategories((prev) =>
                    prev.map((cat) =>
                        cat.id === formValues.id ? updatedCategory : cat
                    )
                );
                handleSnackbarMessage("Kategori başarıyla güncellendi!");
            } else {
                // Yeni kategori eklerken id alanını gönderme
                const { id, ...data } = formValues;
                const newCategory = await createCategory(data);
                setCategories((prev) => [...prev, newCategory]);
                handleSnackbarMessage("Kategori başarıyla eklendi!");
            }
            handleCloseModal();
        } catch (error) {
            console.error("Kategori işlemi sırasında hata oluştu:", error);
            handleSnackbarMessage("Kategori işlemi başarısız oldu!");
        }
    };


    // Kategori Silme
    const handleDeleteCategory = async (categoryId: number) => {
        if (window.confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) {
            try {
                await deleteCategory(categoryId);
                setCategories((prev) =>
                    prev.filter((cat) => cat.id !== categoryId)
                );
                handleSnackbarMessage("Kategori başarıyla silindi!");
            } catch (error) {
                console.error("Kategori silinirken hata oluştu:", error);
                handleSnackbarMessage("Kategori silme işlemi başarısız oldu!");
            }
        }
    };

    // Ürün Modalını Açma
    const handleOpenProductModal = (products: any[]) => {
        console.log("Seçilen Kategori Ürünleri:", products); // Debugging için
        setSelectedCategoryProducts(products);
        setProductModalOpen(true);
    };

    // Ürün Modalını Kapatma
    const handleCloseProductModal = () => setProductModalOpen(false);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Kategori Yönetimi
            </Typography>
            <Button
                variant="contained"
                onClick={() => handleOpenModal()}
                sx={{ mb: 2 }}
            >
                Kategori Ekle
            </Button>
            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Kategori Adı</TableCell>
                            <TableCell>Açıklama</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>Ürün Sayısı</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.description}</TableCell>
                                <TableCell>
                                    {category.isActive ? "Aktif" : "Pasif"}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="text"
                                        onClick={() =>
                                            handleOpenProductModal(category.products || [])
                                        }
                                    >
                                        {category.products?.length || 0}
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        onClick={() => handleOpenModal(category)}
                                        sx={{ mr: 1 }}
                                    >
                                        Düzenle
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        onClick={() =>
                                            handleDeleteCategory(category.id)
                                        }
                                    >
                                        Sil
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Kategori Ekle/Düzenle Modal */}
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
                        {isEditMode ? "Kategori Düzenle" : "Kategori Ekle"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Kategori Adı"
                        sx={{ mb: 2 }}
                        value={formValues.name}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        error={!formValues.name.trim()}
                        helperText={
                            !formValues.name.trim()
                                ? "Bu alan zorunludur"
                                : ""
                        }
                    />
                    <TextField
                        fullWidth
                        label="Açıklama"
                        sx={{ mb: 2 }}
                        value={formValues.description}
                        onChange={(e) =>
                            setFormValues((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleFormSubmit}
                    >
                        Kaydet
                    </Button>
                </Box>
            </Modal>

            {/* Ürün Listesi Modal */}
            <Modal open={productModalOpen} onClose={handleCloseProductModal}>
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
                    <Typography variant="h6">Ürünler</Typography>
                    {selectedCategoryProducts.length > 0 ? (
                        <ul>
                            {selectedCategoryProducts.map((product) => (
                                <li key={product.id}>{product.name} - {product.price} ₺</li>
                            ))}
                        </ul>
                    ) : (
                        <Typography>Bu kategoride ürün bulunmuyor.</Typography>
                    )}
                </Box>
            </Modal>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default AdminCategories;
