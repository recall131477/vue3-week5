import uesrProductModal from "./uesrProductModal.js"; // 預設匯出

// 解構取出 VeeValidate 方法
const { defineRule, Form, Field, ErrorMessage, configure } = VeeValidate;
const { required, email, min, max } = VeeValidateRules;
const { localize, loadLocaleFromURL } = VeeValidateI18n;

// rules
defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
defineRule('max', max);

// 語言i18n
loadLocaleFromURL('./zh_TW.json');

configure({
  generateMessage: localize('zh_TW'),
  validateOnInput: true, // input輸入字元立即進行驗證
});

// API 相關路徑
const apiUrl = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'rousong';

const app = Vue.createApp({
  data() {
    return {
      productData: [],
      productId: '',
      cartData: [],
      isLoadingItem: '',
      form: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
    };
  },
  components: {
    uesrProductModal,
    VForm: Form,
    VField: Field,
    ErrorMessage: ErrorMessage,
  },
  methods: {
    getProductData() { // 取得產品資料
      const url = `${apiUrl}/api/${apiPath}/products/all`;
      axios.get(url)
        .then((res) => {
          this.productData = res.data.products;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    openProductModal(id) { // 當 id 與產品 id 相同時，打開產品 modal
      this.productId = id;
      this.$refs.callUserProductModal.openModal();
    },
    getCartData() { // 取得購物車資料
      const url = `${apiUrl}/api/${apiPath}/cart`;
      axios.get(url)
        .then((res) => {
          this.cartData = res.data.data;
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    addToCart(id, qty = 1) { // 加入購物車，當 qty 沒有傳入值時，預設為1
      const data = {
        product_id: id,
        qty,
      };
      const url = `${apiUrl}/api/${apiPath}/cart`;
      this.isLoadingItem = id;
      axios.post(url, { data })
        .then((res) => {
          this.getCartData();
          this.$refs.callUserProductModal.closeModal();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    updateCartItem(item) { // 更新購物車
      const data = {
        product_id: item.id,
        qty: item.qty,
      };
      const url = `${apiUrl}/api/${apiPath}/cart/${item.id}`;
      this.isLoadingItem = item.id;
      axios.put(url, { data })
        .then((res) => {
          this.getCartData();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteAllCarts() { // 刪除購物車全部產品
      const url = `${apiUrl}/api/${apiPath}/carts`;
      axios.delete(url)
        .then((res) => {
          Swal.fire({
            icon: 'success',
            text: '已刪除全部商品'
          });
          this.getCartData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    deleteCartItem(id) { // 刪除購物車特定產品
      const url = `${apiUrl}/api/${apiPath}/cart/${id}`;
      this.isLoadingItem = id;
      axios.delete(url)
        .then((res) => {
          this.getCartData();
          this.isLoadingItem = '';
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    createOrder() { // 建立訂單
      const url = `${apiUrl}/api/${apiPath}/order`;
      const order = this.form;
      axios.post(url, { data: order })
        .then((res) => {
          Swal.fire({
            icon: 'success',
            text: '已建立訂單'
          });
          console.log(res);
          this.$refs.form.resetForm(); // 清空 form 表單內容，套件用法
          this.form.message = '';
          this.getCartData();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    isPhone(value) { // 判斷電話是否符合正規表達式
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '請輸入正確的電話號碼'
    }
  },
  created() {
    this.getProductData();
    this.getCartData();
  }
});
app.mount('#app');