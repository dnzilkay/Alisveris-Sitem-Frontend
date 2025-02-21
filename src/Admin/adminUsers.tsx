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
import { getUsers, addUser, updateUser, deleteUser } from "../services/userService";

interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: string;
}

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]); // Başlangıç değeri boş bir dizi
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [formValues, setFormValues] = useState({
        id: 0,
        username: "",
        email: "",
        password: "",
        role: "User",
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [formErrors, setFormErrors] = useState({ username: "", email: "" });

    // Kullanıcıları backend'den al
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
                console.log(data);
            } catch (err) {
                console.error("Kullanıcılar yüklenemedi:", err);
            }
        };
        fetchUsers();
    }, []);

    // Modal Aç/Kapat
    const handleOpenModal = (user?: typeof formValues) => {
        if (user) {
            setFormValues(user);
        } else {
            setFormValues({ id: 0, username: "", email: "",password: "", role: "User" });
        }
        setFormErrors({ username: "", email: "" }); // Hata mesajlarını sıfırla
        setModalOpen(true);
    };

    const handleCloseModal = () => setModalOpen(false);

    // Form Doğrulama
    const validateForm = () => {
        let errors = { username: "", email: "" };
        let isValid = true;

        if (!formValues.username.trim()) {
            errors.username = "Ad zorunludur.";
            isValid = false;
        }

        if (!formValues.email.trim()) {
            errors.email = "E-posta zorunludur.";
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            errors.email = "Geçerli bir e-posta adresi giriniz.";
            isValid = false;
        }

        setFormErrors(errors);
        return isValid;
    };

    // Kullanıcı Ekleme/Düzenleme
    const handleFormSubmit = async () => {
        if (!validateForm()) {
            return;
        }
        try {
            if (formValues.id === 0) {
                const { id, ...newUserValues } = formValues; // `id` hariç diğer alanları al
                newUserValues.password = "123456";
                console.log("Gönderilen Veriler:", newUserValues);
                const newUser = await addUser(newUserValues);
                console.log("Yeni Kullanıcı:", newUser);
                setUsers((prev) => [...prev, newUser]);
                setSnackbarMessage("Kullanıcı başarıyla eklendi!");
            } else {
                const updatedUser = await updateUser(formValues.id, formValues);
                setUsers((prev) =>
                    prev.map((user) => (user.id === formValues.id ? updatedUser : user))
                );
                setSnackbarMessage("Kullanıcı başarıyla güncellendi!");
            }
            setSnackbarOpen(true);
            handleCloseModal();
        } catch (err) {
            console.error("Kullanıcı işlemi başarısız:", err);
        }
    };

    // Kullanıcı Silme
    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            setUsers((prev) => prev.filter((user) => user.id !== id));
            setSnackbarMessage("Kullanıcı başarıyla silindi!");
            setSnackbarOpen(true);
        } catch (err) {
            console.error("Kullanıcı silinemedi:", err);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Kullanıcı Yönetimi
            </Typography>
            <Button variant="contained" onClick={() => handleOpenModal()} sx={{ mb: 2 }}>
                Kullanıcı Ekle
            </Button>

            <Paper sx={{ overflowX: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ad</TableCell>
                            <TableCell>E-posta</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>İşlemler</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    {/*<TableCell>{user.password}</TableCell>*/}
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => handleOpenModal(user)}
                                            sx={{ mr: 1 }}
                                        >
                                            Düzenle
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            Sil
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={users.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) =>
                        setRowsPerPage(parseInt(e.target.value, 10))
                    }
                />
            </Paper>

            {/* Kullanıcı Ekle/Düzenle Modal */}
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
                        {formValues.id === 0 ? "Kullanıcı Ekle" : "Kullanıcı Düzenle"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Ad"
                        sx={{ mb: 2 }}
                        value={formValues.username}
                        onChange={(e) =>
                            setFormValues((prev) => ({ ...prev, username: e.target.value }))
                        }
                        error={!!formErrors.username}
                        helperText={formErrors.username}

                    />
                    <TextField
                        fullWidth
                        label="E-posta"
                        sx={{ mb: 2 }}
                        value={formValues.email}
                        onChange={(e) =>
                            setFormValues((prev) => ({ ...prev, email: e.target.value }))
                        }
                        error={!!formErrors.email}
                        helperText={formErrors.email}
                    />
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Rol</InputLabel>
                        <Select
                            value={formValues.role}
                            onChange={(e) =>
                                setFormValues((prev) => ({ ...prev, role: e.target.value }))
                            }
                        >
                            <MenuItem value="Admin">Admin</MenuItem>
                            <MenuItem value="User">User</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" fullWidth onClick={handleFormSubmit}>
                        Kaydet
                    </Button>
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

export default AdminUsers;
