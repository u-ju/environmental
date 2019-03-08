

/**
 * 字符串转换成 UTF-8
 * @param {String} str 文本内容
 */

Component({
    properties: {
        typeNumber: {
            type: Number,
            value: -1,
            observer(newVal) {
                this.draw({
                    typeNumber: newVal,
                })
            },
        },
        errorCorrectLevel: {
            type: Number,
            value: 2,
            observer(newVal) {
                this.draw({
                    errorCorrectLevel: newVal,
                })
            },
        },
        width: {
            type: Number,
            value: 200,
            observer(newVal) {
                this.draw({
                    width: newVal,
                })
            },
        },
        height: {
            type: Number,
            value: 200,
            observer(newVal) {
                this.draw({
                    height: newVal,
                })
            },
        },
        fgColor: {
            type: String,
            value: 'black',
            observer(newVal) {
                this.draw({
                    fgColor: newVal,
                })
            },
        },
        bgColor: {
            type: String,
            value: 'white',
            observer(newVal) {
                this.draw({
                    bgColor: newVal,
                })
            },
        },
        canvasId: {
            type: String,
            value: 'wux-qrcode',
        },
        data: {
            type: String,
            value: '',
            observer(newVal) {
                this.draw({
                    data: newVal,
                })
            },
        },

    },
    methods: {
        /**
         * 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
         */
        draw(opts = {}) {
            const { typeNumber, errorCorrectLevel, width, height, fgColor, bgColor, canvasId, data } = Object.assign({}, this.data, opts)
            
            this.ctx = this.ctx || wx.createCanvasContext(canvasId, this)
            var path = '../../images/erwm.jpg';
            //这个地方的图片是需要注意，图片需要下载不然，手机上不能正常显示
            this.ctx.drawImage(path, 0, 0, 686, 686)
            this.ctx.scale(1, 1)
            

            this.ctx.draw()
            // console.log(canvasId)
            
        },
        /**
         * 手指触摸后马上离开
         */
        onTap() {
            this.triggerEvent('click')
        },
    },
    attached() {
        this.draw()
    },
    detached() {
        this.ctx = null
    },
})
