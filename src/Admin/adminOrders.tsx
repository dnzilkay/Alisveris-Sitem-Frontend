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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Snackbar,
    Alert,
} from "@mui/material";
import { getOrders, updateOrderStatus } from "../services/orderService";

// Sipariş tipi tanımlaması
interface OrderItem {
    productName: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    customer: string; // Müşteri adı
    total: number;
    status: string;
    items: OrderItem[];
}

const AdminOrders: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");

    // Siparişleri backend'den çek
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const backendOrders = await getOrders();

                // Backend'den gelen veriyi frontend için dönüştür
                const transformedOrders = backendOrders.map((order: any) => ({
                    id: order.id,
                    customer: order.User?.username || "Bilinmeyen Müşteri", // Kullanıcı adı
                    total: order.items?.reduce(
                        (sum: number, item: any) =>
                            sum + item.quantity * (item.Product?.price || 0),
                        0
                    ) || 0,
                    status: order.status || "Bilinmiyor",
                    items: order.items?.map((item: any) => ({
                        productName: item.Product?.name || "Bilinmeyen Ürün",
                        quantity: item.quantity || 0,
                        price: item.Product?.price || 0,
                    })) || [],
                }));

                setOrders(transformedOrders); // Dönüştürülmüş veriyi state'e kaydet
            } catch (err) {
                console.error("Siparişler yüklenemedi:", err);
            }
        };

        fetchOrders();
    }, []);

    // Filtreleme işlemi
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.total.toString().includes(searchTerm);

        const matchesStatus =
            statusFilter === "" || order.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleOpenModal = (order: Order) => {
        setSelectedOrder(order);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedOrder(null);
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateOrderStatus(id, newStatus);
            setOrders((prev) =>
                prev.map((order) =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );
            setSnackbarMessage("Sipariş durumu başarıyla güncellendi!");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Sipariş durumu güncellenemedi:", err);
            setSnackbarMessage("Sipariş durumu güncellenemedi!");
            setSnackbarOpen(true);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Sipariş Yönetimi
            </Typography>

            {/* Arama ve Filtreleme Alanı */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    label="Müşteri Adı veya Tutar Ara"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FormControl fullWidth>
                    <InputLabel>Duruma Göre Filtrele</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <MenuItem value="">Tümü</MenuItem>
                        <MenuItem value="Hazırlanıyor">Hazırlanıyor</MenuItem>
                        <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
                        <MenuItem value="İptal Edildi">İptal Edildi</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Paper sx={{ overflowX: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Müşteri</TableCell>
                            <TableCell>Toplam Tutar</TableCell>
                            <TableCell>Durum</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order) => (
                                <TableRow
                                    key={order.id}
                                    sx={{
                                        backgroundColor:
                                            order.status === "Tamamlandı"
                                                ? "#C8E6C9"
                                                : order.status === "Hazırlanıyor"
                                                    ? "#FFECB3"
                                                    : "#FFCDD2",
                                    }}
                                >
                                    <TableCell>{order.customer}</TableCell>
                                    <TableCell>{order.total} ₺</TableCell>
                                    <TableCell>
                                        <FormControl fullWidth>
                                            <Select
                                                value={order.status}
                                                onChange={(e) =>
                                                    handleStatusChange(order.id, e.target.value)
                                                }
                                            >
                                                <MenuItem value="Ödeme Bekleniyor">Ödeme Bekleniyor</MenuItem>
                                                <MenuItem value="Hazırlanıyor">Hazırlanıyor</MenuItem>
                                                <MenuItem value="Tamamlandı">Tamamlandı</MenuItem>
                                                <MenuItem value="İptal Edildi">İptal Edildi</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenModal(order)}
                                        >
                                            Detaylar
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    page={page}
                    count={filteredOrders.length}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) =>
                        setRowsPerPage(parseInt(e.target.value, 10))
                    }
                />
            </Paper>

            {/* Sipariş Detayları Modal */}
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
                    <Typography variant="h6" gutterBottom>
                        Sipariş Detayları
                    </Typography>
                    {selectedOrder && (
                        <Box>
                            <Typography>Müşteri: {selectedOrder.customer}</Typography>
                            <Typography>Toplam Tutar: {selectedOrder.total} ₺</Typography>
                            <Typography>Ürünler:</Typography>
                            {selectedOrder.items.map((item, index) => (
                                <Typography key={index}>
                                    {item.productName} - {item.quantity} x {item.price} ₺
                                </Typography>
                            ))}
                        </Box>
                    )}
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

export default AdminOrders;
