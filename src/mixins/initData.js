import { initData ,initDatas} from '@/api/data'

export default {
  data() {
    return {
      loading: true, data: [], page: 0, size: 10, total: 0, url: '', params: {}, query: {}, time: 50, isAdd: false, downloadLoading: false, methods: '',dataStructure:''
    }
  },
  methods: {
    async init() {
      if (!await this.beforeInit()) {
        return
      }
      return new Promise((resolve, reject) => {
        this.loading = true
        if (this.methods == 'post') {
          initDatas(this.url, this.params).then(res => {
            this.total = res.totalElements
            this.data = res.content
            console.log('sososos', res.content)

              
            // if (this.dataStructure == 'children') {
            //   let arr = res.content;
            //   arr.forEach((element,index) => {
            //     console.log('element', element, index)
            //     element.children = [],
                
            //     element.children[index] = element.enterpriseAddresses[index]
           
                

            //   });

            //   this.data=arr
            //   console.log('arr',arr)
              



            // }
            setTimeout(() => {
              this.loading = false
            }, this.time)
            resolve(res)
          }).catch(err => {
            this.loading = false
            reject(err)
          })

        } else {
          initData(this.url, this.params).then(res => {
            this.total = res.totalElements
            this.data = res.content
          
            console.log('sososos', res.content)
            setTimeout(() => {
              this.loading = false
            }, this.time)
            resolve(res)
          }).catch(err => {
            this.loading = false
            reject(err)
          })
        }

      })
    },
    beforeInit() {
      return true
    },
    pageChange(e) {
      this.page = e - 1
      this.init()
    },
    sizeChange(e) {
      this.page = 0
      this.size = e
      this.init()
    },
    // ????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
    dleChangePage(size) {
      if (size === undefined) {
        size = 1
      }
      if (this.data.length === size && this.page !== 0) {
        this.page = this.page - 1
      }
    },
    toQuery() {
      this.page = 0
      this.init()
    }
  }
}
