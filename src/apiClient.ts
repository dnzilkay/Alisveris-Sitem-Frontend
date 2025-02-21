// Axios modülünü içe aktarıyoruz.
import axios from 'axios';

// API çağrıları için bir axios istemcisi (apiClient) oluşturuyoruz.
// `baseURL`, çevresel değişkenlerden alınır (Vite için `import.meta.env.VITE_API_BASE_URL`).
// Eğer çevresel değişken tanımlı değilse, localhost URL'si varsayılan olarak kullanılır.
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api', // Vite için baseURL
    headers: {
        'Content-Type': 'application/json', // Tüm isteklerde JSON formatı belirtmek için içerik tipi başlığı
    },
});

// İsteklerde token eklemek için bir interceptor tanımlıyoruz.
// Bu interceptor, her isteğin gönderilmeden önce üzerinde işlem yapılmasını sağlar.
apiClient.interceptors.request.use((config) => {
    // Tarayıcıdaki localStorage'dan `token` değerini alıyoruz.
    const token = localStorage.getItem('token');

    // Eğer bir token varsa, bu token'ı Authorization başlığına ekliyoruz.
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Bearer Token formatında ekleme
    }

    // Güncellenen config objesini döndürüyoruz.
    return config;
});

// Oluşturulan apiClient istemcisini dışa aktarıyoruz, böylece diğer dosyalarda kullanılabilir.
export default apiClient;
