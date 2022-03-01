export default {
  data() {
    return {
      apiUrl: 'https://vue3-course-api.hexschool.io/v2',
      apiPath: 'rousong',
      product: [],
      modal: '',
      qty: 1,
    };
  },
  watch: {
    qty() { // 當 qty 小於等於0時，跳出提示並將 qty 值為1
      if(this.qty < 0 || this.qty === 0) {
        alert('數量不能低於1');
        this.qty = 1;
      }
    }
  },
  methods: {
    getProduct(id) { // 取得特定產品資料
      const url = `${this.apiUrl}/api/${this.apiPath}/product/${id}`;
      axios.get(url)
        .then((res) => {
          this.product = res.data.product;
          this.openModal();
        })
        .catch((err) => {
          alert(err.data.message);
        });
    },
    addToCart() { // 元件內的加入購物車
      this.$emit('add-cart', this.product.id, this.qty);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '已加入購物車',
        showConfirmButton: false,
        timer: 1500,
      });
    },
    openModal() { // 打開 modal
      this.modal.show();
    },
    closeModal() { // 關閉 modal
      this.modal.hide();
    }
  },
  mounted() {
    // 實體化 modal (這裡才取的到 DOM 元素)
    this.modal = new bootstrap.Modal(this.$refs.userProductModal);
  },
  template:
    `
      <div class="modal fade" id="userProductModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
      aria-hidden="true" ref="userProductModal">
      <div class="modal-dialog modal-xl" role="document">
        <div class="modal-content border-0">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title" id="exampleModalLabel">
              <span>{{ product.title }}</span>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-sm-6">
                <img class="img-fluid" :src="product.imageUrl" alt="" />
              </div>
              <div class="col-sm-6">
                <span class="badge bg-primary rounded-pill"> </span>
                <p>商品描述： {{ product.description }}</p>
                <p>商品內容： {{ product.content }}</p>
                <div class="h5" 
                v-if="product.price === product.origin_price"> 
                  {{ product.price }} 元
                </div>
                <div v-else>
                  <del class="h6">原價 {{ product.origin_price }} 元</del>
                  <div class="h5">現在只要 {{ product.price }} 元</div>
                </div>
                <div>
                  <div class="input-group">
                    <input type="number" class="form-control" min="1" v-model="qty"/>
                      <button type="button" class="btn btn-primary" @click="addToCart">
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
}