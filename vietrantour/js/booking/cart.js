Vue.component('niceSelect', {
    props: ['gender', 'value', 'selected'],
    template: '<select><option v-for="(ge, g) in gender" :value="ge.id" v-model="selected">{{ ge.name }}</option></select>',
    mounted: function () {
        var vm = this
        $(this.$el)
            // init select2
            .niceSelect({ data: this.options })
            .val(this.value)
            .trigger('change')
            // emit event on change.
            .on('change', function () {
                vm.$emit('input', this.value)
            })
        $(this.$el).val(vm.selected).trigger('change');
    },
    watch: {
        value: function (value) {
            console.log(value)
            // update value
            $(this.$el).val(value).trigger('change');
        },
        options: function (options) {
            // update options
            $(this.$el).empty().niceSelect({ data: options })
        }
    },
    destroyed: function () {
        $(this.$el).off().niceSelect('destroy')
    }
})
const _token = jQuery('meta[name=_token]').attr("content");
const HTTP = axios.create({
    baseURL: `https://vpvietrantour.local/`,
    headers: {
        Authorization: 'Bearer {_token}',
        "Content-Type": "application/x-www-form-urlencoded"
    },
})
Vue.config.devtools = true;
const regionBooking = new Vue({
    el: '#regionBooking',
    data() {
        return {
            member: {
                name: member.name,
                email: member.email,
                dien_thoai: member.dien_thoai,
                phone: member.phone,
                note: '',
                check: '',
                send_email: '',
            },
            dytNguoiLon: {
                total: 1,
                list: [
                    {
                        name: '',
                        gender: 'male',
                        birthday: '',
                        age: 0
                    }
                ]
            },
            dytTreEm: {
                total: 0,
                list: [
                    {
                        name: '',
                        gender: 'male',
                        birthday: '',
                        age: 0
                    }
                ]
            },
            dytTreNho: {
                total: 0,
                list: [
                    {
                        name: '',
                        gender: 'male',
                        birthday: '',
                        age: 0
                    }
                ]
            },
            GENDER: [
                {id: 'male', name: 'Nam'},
                {id: 'female', name: 'Nữ'},
            ],
            SELECT_EMAIL: [
                { id: 'yes', name: 'Đồng ý' },
                { id: 'no', name: 'Không, tôi không muốn nhận' },
            ],
            PAY: lsPayment,
            PAY_CHECKED: 'PAY_TIENMAT',
            cart: cart,
            current_fs: '',
            next_fs: '', previous_fs: '',
            left: '', opacity: '', scale: '',
            animating: ''
        }
    },
    mounted() {
        this.$nextTick(() => {
            INPUT_NUMBER()
            this._init_niceselect()
        })
    },
    computed: {

    },
    methods: {
        newMembers(key) {
            var tpl = {name: '', gender: 'male', birthday: '', age: 0};
            var io = this;
            axios.post('/public_api/tour/check-member-valid', {
                lsObj: io.cart,
                cart: true
            })
                .then(response => {
                    json = response.data
                    if(json.status == 1) {
                        key.list = JSON.stringify([tpl]);
                        key.list = JSON.parse(key.list);
                        if(key.total > 1) {
                            for (let i = 1; i < key.total; i++) {
                                key.list.push(tpl);
                                io.$nextTick(() => {
                                    io._init_niceselect(i)
                                })
                            }
                        }else {
                            key.total = 1;
                        }

                    }else {
                        alert(json.msg)
                    }
                })
                .catch(e => {
                    this.errors.push(e)
                })
                .finally(() => this.loading = false)

        },
        _check_member(key, tab) {
            var io = this;

            axios.post('/public_api/tour/check-member-valid', {
                member: io.member,
                lsObj: io.cart,
                cart: true,
                tab: tab
            })
                .then(response => {
                    json = response.data
                    if(json.status == 1) {
                        io.$nextTick(() => {
                            io._next_form(key)
                        })
                    }else {
                        alert(json.msg)
                    }
                })
                .catch(e => {
                    this.errors.push(e)
                })
                .finally(() => this.loading = false)
        },
        _save(key) {
            var io = this;
            axios.post('/booking/_save_cart', {
                headers: {
                    Authorization: 'Bearer {_token}',
                },
                member: io.member,
                lsObj: io.cart,
                cart: true,
                PAY: io.PAY_CHECKED
            })
                .then(response => {
                    json = response.data
                    if(json.status == 1) {
                        io.$nextTick(() => {
                            io._next_form(key)
                        })
                        if(typeof json.data.code  != "undefined") {
                            $('#co_cai_lz').attr('href', BASE_URL+'/booking/search/'+json.data.code)
                        }
                    }else {
                        alert(json.msg)
                    }
                })
                .catch(e => {
                    this.errors.push(e)
                })
                .finally(() => this.loading = false)
        },
        _next_form(key) {
            var io = this
            if (io.animating) return false;
            io.animating = true;
            io.current_fs = $(io.$refs[key]).parent();
            io.next_fs = $(io.$refs[key]).parent().next();
            $("#progressbar li").eq($("fieldset.book_mdf").index(io.next_fs)).addClass("active");
            io.next_fs.show();
            io.current_fs.animate({
                opacity: 0
            }, {
                step: function (now, mx) {
                    io.scale = 1 - (1 - now) * 0.2;
                    io.left = (now * 50) + "%";
                    io.opacity = 1 - now;
                    io.current_fs.css({
                        'transform': 'scale(' + io.scale + ')',
                        'position': 'absolute'
                    });
                    io.next_fs.css({
                        'left': io.left,
                        'opacity': io.opacity,
                        'position': 'relative'
                    });
                },
                duration: 1200,
                complete: function () {
                    io.current_fs.hide();
                    io.animating = false;
                },
                easing: 'easeInOutBack'
            });
        },
        _init_niceselect(index = 0) {
            $('#nice-select-'+index).niceSelect();
        }
    }
});