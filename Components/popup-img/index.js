
Component({
  externalClasses: ['wux-class'],
  options: {
    multipleSlots: true,
  },
  properties: {
    classN: {
      type: String,
      value: '',
    },
    images:{
      type: String,
      value: '',
    },
    dat:{
      type: Object,
      value: [],
    },
    visablen:{
      type: String,
      value: '',
    }
  },
  data: {
    transitionName: '',
    visablen: '',
  },
  methods: {
    close(e) {
      // this.setData({
      //   visablen:0
      // })
      this.triggerEvent('close',{data:e.currentTarget.dataset.item})
    },
    
  },
  created() {
    // console.log(this)
  },
  
})