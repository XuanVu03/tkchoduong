/**
 * Created by sakura on 20/03/2016.
 */
(function (c) {
    c.fn.serializeJSON = function () {
        var e, d;
        e = {};
        d = this.serializeArray();
        c.each(d, function (h, f) {
            var g, k, j;
            g = f.name;
            k = f.value;
            j = c.map(g.split("["), function (i) {
                var l;
                l = i[i.length - 1];
                return l === "]" ? i.substring(0, i.length - 1) : i
            });
            if (j[0] === "") {
                j.shift()
            }
            c.deepSet(e, j, k)
        });
        return e
    };
    var a = function (d) {
        return d === Object(d)
    };
    var b = function (d) {
        return /^[0-9]+$/.test(String(d))
    };
    c.deepSet = function (d, l, i) {
        var j, h, f, g, k, e;
        if (!l || l.length === 0) {
            throw new Error("ArgumentError: keys param expected to be an array with least one key")
        }
        j = l[0];
        if (l.length == 1) {
            if (j === "") {
                d.push(i)
            } else {
                d[j] = i
            }
        } else {
            h = l[1];
            if (j === "") {
                k = d.length - 1;
                e = d[d.length - 1];
                if (a(e) && !e[h]) {
                    j = k
                } else {
                    d.push({});
                    j = k + 1
                }
            }
            if (d[j] === undefined) {
                if (h === "" || b(h)) {
                    d[j] = []
                } else {
                    d[j] = {}
                }
            }
            f = l.slice(1);
            c.deepSet(d[j], f, i)
        }
    }
}(jQuery));

function _convertToAlias(Text) {
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-')
        ;
}

function _EDITABLE_SELECT(selectIlement, val = 'active', source = []) {
    if(typeof source[0] == "undefined") {
        source = [
            {value: 'active', text: 'Đang hoạt động'},
            {value: 'dratf', text: 'Bản nháp'},
        ]
    }
    $(selectIlement).editable({
        value: val,
        source: source,
        params: function(params) {
            //originally params contain pk, name and value
            params._token = jQuery('meta[name=_token]').attr("content");
            return params;
        },
        display: function(value, sourceData) {
            //display checklist as comma-separated values
            var html = [],
                checked = $.fn.editableutils.itemsByValue(value, sourceData);
            if(checked.length) {
                $.each(checked, function(i, v) { html.push($.fn.editableutils.escape(v.text)); });
                $(this).html(html.join(', '));
            } else {
                $(this).empty();
            }

        },
        success: function(response) {
            if(response.status == 0) {
                alert(response.msg);
                window.location.href = '';
            }
        }
    });
}
function _EDITABLE_TEXT(selectIlement, val = 'Chưa cập nhật', source = []) {
    $(selectIlement).editable({
        title: '',
        params: function(params) {
            //originally params contain pk, name and value
            params._token = jQuery('meta[name=_token]').attr("content");
            return params;
        },
        display: function(v, json) {
            //display checklist as comma-separated values
            var html = [], m;
            var v = $(this).data('title');
            if(typeof v == 'string') {
                m = v;
            }else {
                m = _FORMAT_MONEY(v)
            }
            if(typeof json != 'undefined' && json.status == 1) {
                m = _FORMAT_MONEY(json.data.cong_no)
                let so_diem_duoc_nhan = _FORMAT_MONEY(json.data.so_diem_duoc_nhan)
                $(this).parents('.so_diem_no').next('.so_diem_duoc_nhan').find('b.so_diem_duoc_nhan').text(so_diem_duoc_nhan);
            }else if(typeof json != 'undefined' && json.status == 0) {
                window.location.href = '';
            };
            $(this).text(m);

        },
        validate: function(v) {
            if(!v) return 'Công nợ không được bỏ trống';
        },
        success: function(response) {
            if(response.status == 0) {
                alert(response.msg);
                window.location.href = '';
            }
        }
    });

}

function _FORMAT_MONEY(value) {
    let val = (value/1).toFixed(0).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+' ₫';
}

function _INIT_DATERANGEPICKER_SINGLE() {
    $('.daterange-single, .date-datepicker').daterangepicker({
        singleDatePicker: true,
        opens: 'right',
        locale: {
            format: 'DD/MM/YYYY',
        }
    });
}
function _INIT_DATETIMERANGEPICKER_NOTAUTO() {
    $('.datetime-datepicker-notauto').daterangepicker({
        opens: 'right',
        timePicker: true,
        singleDatePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 1,
        locale: {
            format: 'DD/MM/YYYY hh:mm',
        }
    });
}

function _INIT_DATERANGEPICKER_INC() {
    // 10 minute increments
    $('.daterange-increments').daterangepicker({
        timePicker: true,
        opens: 'right',
        applyClass: 'btn-primary',
        cancelClass: 'btn-light',
        timePickerIncrement: 10,
        locale: {
            format: 'MM/DD/YYYY h:mm: a'
        }
    });
}

function _INIT_DATERANGEPICKER() {
    $('.daterange-basic').daterangepicker({
        applyClass: 'btn-primary',
        cancelClass: 'btn-light',
        opens: 'left',
        timePicker: true,
        opens: 'left',
        autoUpdateInput: false,
        locale: {
            format: 'DD/MM/YYYY',
        }
    });
    $('.daterange-basic').on('apply.daterangepicker', function(ev, picker) {
        $(this).val(picker.startDate.format('DD/MM/YYYY') + ' - ' + picker.endDate.format('DD/MM/YYYY'));
    });
    $('.daterange-basic').on('cancel.daterangepicker', function(ev, picker) {
        //do something, like clearing an input
        $(this).val('');
    });
}

function calcTime(dt, pattern = /(\d{2})\/(\d{2})\/(\d{4})/) {
    var date_future = new Date(dt.replace(pattern,'$3-$2-$1'));
    date_now = new Date();

    seconds = Math.floor((date_future - (date_now))/1000);
    minutes = Math.floor(seconds/60);
    hours = Math.floor(minutes/60);
    days = Math.floor(hours/24);

    hours -= (days*24);
    minutes -= (days*24*60)-(hours*60);
    seconds -= (days*24*60*60)-(hours*60*60)-(minutes*60);
    var time = {
        'd': days,
        'h': hours,
        'm': minutes,
        's': seconds,
    };
    return time;
}

function _INIT_EDITABLE_PICKER() {
    // Editable input
    var $input_date = $('.pickadate-editable').pickadate({
        editable: true,
        format: 'dd/mm/yyyy',
        onClose: function() {
            $('.datepicker').focus();
        }
    });
    var picker_date = $input_date.pickadate('picker');
    $input_date.on('click', function(event) {
        if (picker_date.get('open')) {
            picker_date.close();
        } else {
            picker_date.open();
        }
        event.stopPropagation();
    });
}

function _AUTOCOMPLETE_INIT(inputElement, sourceRemote) {
    $(inputElement).autocomplete({
        minLength: 3,
        source: sourceRemote,
        focus: function (event, ui) {
            $(inputElement).val(ui.item.label);
            return false;
        },
        select: function (event, ui) {
            $(inputElement).val(ui.item.label);
            return false;
        }
    })
        .autocomplete("instance")._renderItem = function (ul, item) {
        return $("<li>").append("<a>" + item.label + "</a>").appendTo(ul);

    };
}

/***
 * @public
 * @name: _SHOW_FORM_REMOTE
 * @note: Hiển thị form modal popup lấy template từ server về
 */
// var _EDITOR = false;
//
// function _EDITOR_INIT(element, height, _tool_bar_small, readonly = 0) {
//     tinymce.init({
//         selector: element,
//         readonly : readonly,
//         //toolbar1: 'addMediaAdvance | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image  preview media forecolor backcolor code fullscreen',
//         toolbar1: (typeof _tool_bar_small !== 'undefined' && _tool_bar_small == true ?
//             'styleselect | bold italic alignleft aligncenter alignright alignjustify bullist numlist link unlink code fullscreen'
//             : 'styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link unlink image  preview media forecolor backcolor code '),
//         setup: function (editor) {
//             editor.on('change', function () {
//                 editor.save();
//             });
//             editor.addButton('addMediaAdvance', {
//                 text: 'Thêm media',
//                 icon: false,
//                 onclick: function () {
//                     return MNG_MEDIA.openUploadForm('insertImageToEditor', '');
//                     //editor.insertContent('&nbsp;<b>It\'s my button!</b>&nbsp;');
//                 }
//             });
//             _EDITOR = editor;
//         },
//         urlconverter_callback: function(url, node, on_save, name) {
//             //  var node = admin_link('admin');
//             // // var https = 'vpdt.cophan.minhphucgroup.com.vn';
//             // url = url.substring(3);
//             // console.log(url);
//             return url;
//         },
//         language: 'vi_VN',
//         entity_encoding: "raw",
//         menubar: false,//không hiển thị menu bar,
//         fix_list_elements: true,
//         force_p_newlines: true,
//         allow_conditional_comments: false,//Không chấp nhận comment html
//         height: (typeof height !== 'undefined' ? height : 300),
//         plugins: [
//             'advlist autolink lists link image charmap print preview hr anchor pagebreak',
//             'searchreplace wordcount visualblocks visualchars code fullscreen',
//             'insertdatetime media nonbreaking save table contextmenu directionality',
//             'template paste textcolor colorpicker textpattern imagetools '
//         ],
//         image_caption: true,
//         image_advtab: true,
//         image_description: true,
//         image_title: true,
//         images_upload_base_path: '/media/_doUpload',
//         images_upload_credentials: true,
//         images_upload_handler: function (blobInfo, success, failure) {
//             var xhr, formData;
//
//             xhr = new XMLHttpRequest();
//             xhr.withCredentials = false;
//             xhr.open('POST', '/media/_doUpload');
//             xhr.setRequestHeader("X-CSRF-Token", jQuery('meta[name=_token]').attr("content"));
//             xhr.onload = function() {
//                 var json;
//
//                 if (xhr.status != 200) {
//                     failure('HTTP Error: ' + xhr.status);
//                     return;
//                 }
//
//                 json = JSON.parse(xhr.responseText);
//
//                 if (!json || typeof json.data.full_size_link != 'string') {
//                     failure('Invalid JSON: ' + xhr.responseText);
//                     return;
//                 }
//
//                 success(json.data.full_size_link);
//             };
//
//             formData = new FormData();
//             formData.append('file', blobInfo.blob(), blobInfo.filename());
//
//             xhr.send(formData);
//         },
//     });
// }

function _GET_SCRIPT(link) {
    var resource = document.createElement('script');
    resource.src = link;
    var script = document.getElementsByTagName('script')[0];
    script.parentNode.insertBefore(resource, script);
}

function _SHOW_FORM_REMOTE(remote_link, target, multiform) {
    if (target === undefined || target == '') {
        target = 'myModal';
    }
    if (multiform != undefined) {
        target = target + remote_link.replace(/[^\w\s]/gi, '');
    } else {
        jQuery('.modal-backdrop').remove();
    }
    jQuery('#' + target).remove();
    jQuery('body').append('<div class="modal fade" id="' + target + '" tabindex="-1" role="dialog" ' +
        'aria-labelledby="' + target + 'Label" aria-hidden="true">' +
        '<div class="mmbd"></div></div>');
    var modal = jQuery('#' + target), modalBody = jQuery('#' + target + ' .mmbd');
    modal.on('show.bs.modal', function () {
        modalBody.load(remote_link);
    }).modal({backdrop: 'static'});
    return false;
}

var STATUS_JSON_DONE = 1;
var STATUS_JSON_RELOGIN = -2;
var ALL_POST_RESULT = [];
var ADMIN_PREFIX = '/';

/***
 *
 * @param url
 * @param data
 * @param callback
 * @param cache
 * @param type
 * @returns {*}
 * @public
 */
function getUrlParameters(url, name) {
    let _url = new URL(url);
    return _url.searchParams.get(name);
}
function __callback(res) {

    var typeNoty = 'error';
    var msg = res.msg;
    var _alert = 'danger';
    var animation = {
        open: function (promise) {
            var n = this;
            var Timeline = new mojs.Timeline();
            var body = new mojs.Html({
                el        : n.barDom,
                x         : {500: 0, delay: 0, duration: 500, easing: 'elastic.out'},
                isForce3d : true,
                onComplete: function () {
                    promise(function(resolve) {
                        resolve();
                    })
                }
            });

            var parent = new mojs.Shape({
                parent: n.barDom,
                width      : 200,
                height     : n.barDom.getBoundingClientRect().height,
                radius     : 0,
                x          : {[150]: -150},
                duration   : 1.2 * 500,
                isShowStart: true
            });

            n.barDom.style['overflow'] = 'visible';
            parent.el.style['overflow'] = 'hidden';
            parent.el.style['z-index'] = '-1';

            var burst = new mojs.Burst({
                parent  : parent.el,
                count   : 10,
                top     : n.barDom.getBoundingClientRect().height + 75,
                degree  : 90,
                radius  : 75,
                angle   : {[-90]: 40},
                children: {
                    fill     : '#EBD761',
                    delay    : 'stagger(500, -50)',
                    radius   : 'rand(8, 25)',
                    direction: -1,
                    isSwirl  : true
                }
            });

            var fadeBurst = new mojs.Burst({
                parent  : parent.el,
                count   : 2,
                degree  : 0,
                angle   : 75,
                radius  : {0: 100},
                top     : '90%',
                children: {
                    fill     : '#EBD761',
                    pathScale: [.65, 1],
                    radius   : 'rand(12, 15)',
                    direction: [-1, 1],
                    delay    : .8 * 500,
                    isSwirl  : true
                }
            });

            Timeline.add(body, burst, fadeBurst, parent);
            Timeline.play();
        },
        close: function (promise) {
            var n = this;
            new mojs.Html({
                el        : n.barDom,
                x         : {0: 500, delay: 10, duration: 500, easing: 'cubic.out'},
                skewY     : {0: 10, delay: 10, duration: 500, easing: 'cubic.out'},
                isForce3d : true,
                onComplete: function () {
                    promise(function(resolve) {
                        resolve();
                    })
                }
            }).play();
        }
    };
    Noty.overrideDefaults({
        theme: 'limitless',
        layout: 'topRight',
        type: typeNoty,
        timeout: 12000,
    });
    switch (res.status) {
        case 'notif-error': {
            typeNoty = 'error';
            animation = {};
            break;
        }
        case 'notif-info': {
            typeNoty = 'info/information';
            _alert = 'info';
            break;
        }
        case 'notif-success': {
            typeNoty = 'confirm';
            _alert = 'success';
            break;
        }
        case 1: {
            alert(res.msg);
            if (typeof res.data.reload !== "undefined" && res.data.reload === true) {
                if(getUrlParameters(window.location.href,'slink')){
                    let newLink  = removeParam('slink',window.location.href);
                    window.location.href = newLink;
                }else {
                    location.reload();
                }
            } else if (typeof res.data.redirect !== "undefined" && res.data.redirect) {
                window.location.href = res.data.redirect;
            }
            break;
        }
        default: {
            _alert = 'danger';
            animation = {};
            break;
        }
    }
    if(typeNoty == 'notif-success' && typeof res.data !== "undefined") {
        location.reload();
    }else {
        new Noty({
            theme: ' alert alert-' + _alert + ' alert-styled-left p-0 mb-2',
            progressBar: false,
            closeWith: ['button'],
            layout: 'topRight',
            text: msg,
            type: typeNoty,
            animation: animation,
        }).show();
    }
}
function _POST(url, data, callback, cache, type) {
    if (cache != undefined) {
        if (ALL_POST_RESULT[cache] != undefined) {
            return callback(ALL_POST_RESULT[cache])
        }
    }
    var _token = jQuery('meta[name=_token]').attr("content");
    if (_token) {
        var _data = {'name': '_token', 'value': _token};
        data.push(_data);
    }
    if (type == undefined) {
        type = 'json';
    }
    jQuery.ajax({
        url: url,
        type: "POST",
        data: data,
        dataType: type,
        success: function (data) {
            console.log('data', data);
            if (cache != undefined && cache != null) {
                ALL_POST_RESULT[cache] = data;
            }
            return eval(callback(data));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
    return true;
}
function _POST_FORM(formId, url, options = {}) {

    let {callback, type = 'json',globalCallback =true} = options;
    if (typeof callback !== 'function') {

    }
    let data = [];
    if(typeof formId!=="undefined") {
        data = $(formId).serializeArray();
    }else{

    }
    let _token = jQuery('meta[name=_token]').attr("content");
    if (_token) {
        let _data = {'name': '_token', 'value': _token};
        data.push(_data);
    }
    jQuery.ajax({
        url: url,
        type: "POST",
        data: data,
        dataType: type,
        success: function (res) {
            try {
                eval(options.callback(res))
            }catch(e) {

            }
            if(globalCallback){
                return eval(__callback(res));
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
    return false;

}
function _GET_FORM(formId, url, options = {}) {

    let {callback, type = 'json',globalCallback =true} = options;
    if (typeof callback !== 'function') {

    }
    let data = [];
    if(typeof formId!=="undefined") {
        data = $(formId).serializeArray();
    }else{

    }
    let _token = jQuery('meta[name=_token]').attr("content");
    if (_token) {
        let _data = {'name': '_token', 'value': _token};
        data.push(_data);
    }
    jQuery.ajax({
        url: url,
        type: "GET",
        data: data,
        dataType: type,
        success: function (res) {
            try {
                eval(options.callback(res))
            }catch(e) {

            }
            if(globalCallback){
                return eval(__callback(res));
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if( xhr.status === 422 ) {
                var errors = xhr.responseJSON;
                var errorsHtml = '';
                $.each(errors['errors'], function (index, value) {
                    errorsHtml =  value ;
                });
                alert(errorsHtml);
            }
            else{
                alert(xhr);
            }


        }
    });
    return false;

}
function _POST_JSON_BODY(url, data, callback) {
    jQuery.ajax({
        url: url,
        type: "POST",
        data: JSON.stringify(data),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
            console.log('data', data);
            return eval(callback(data));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
    return true;
}

var App = {
    DOMAIN: document.location.origin,
    API: document.location.origin + '/api'
};

/***
 * @public
 * @name: show_notify
 * @note: Hiển thị notify từ thư viện pnotify.min.js
 */
function show_notify($title, $type, $icon, $text) {
    new PNotify({
        title: $title,
        text: $text,
        icon: $icon,
        type: $type
    });
}

/***
 * @public
 * @name: isUrlValid
 * @note: validate url link
 */
function isUrlValid(url) {
    return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
}

/***
 * @param table
 * @name: checkAll
 * @note: checked check box in table
 */
function checkAll(table) {
    jQuery("#checkAll").change(function () {
        jQuery("#" + table + " input:checkbox").prop('checked', $(this).prop("checked"));
        $(".styled.js-bl-ck").uniform({
            radioClass: 'choice'
        });
    });
}

/***
 * @param table
 * @param cbName
 * @name: getCheckBoxVal
 * @note: get checked value of checkbox in table
 */
function getCheckBoxVal(table, cbName) {
    var ids = '';
    var first = true;
    jQuery("#" + table + " tbody input[name=" + cbName + "]:checked").each(function () {
        if (first) {
            ids += jQuery(this).val();
            first = false;
        } else {
            ids += ',' + jQuery(this).val();
        }
    });
    return ids;
}

/***
 * @param name
 * @name: triggerInput
 * @note: trigger click function of id
 */
function triggerInput(name) {
    jQuery('#' + name).trigger('click');
}

/***
 * @param obj
 * @name: validate_link
 * @note: validate link format
 */
function validate_link(obj) {
    var val = obj.val();
    var parent = obj.parent();
    var html = '';
    if (val === undefined || val == '') {
        return false;
    }
    parent.removeClass('has-warning has-success has-error');
    parent.find('.form-control-feedback').remove();
    if (!isUrlValid(val)) {
        show_notify('Lưu ý', 'warning', 'icon-warning2', 'Link của bạn chưa đúng định dạng');
        parent.addClass('has-warning ');
        html = '<div class="form-control-feedback right10"><i class="icon-notification2"></i></div>';
    } else {
        parent.addClass('has-success');
        html = '<div class="form-control-feedback right10"><i class="icon-checkmark-circle"></i></div>';
    }
    obj.after(html);
}

/***
 * @param inputName
 * @param focus
 * @name: validateInput
 * @note: validate input
 */
function validateInput(inputName, focus) {
    var input = jQuery('input[name=' + inputName + ']');
    if (input === undefined) {
        return false;
    }
    var parent = input.parent(); //div parent
    parent.removeClass('has-warning has-success has-error').addClass('has-error');
    parent.find('.form-control-feedback').remove();
    input.after('<div class="form-control-feedback right10"><i class="icon-cancel-circle2"></i></div>');
    if (focus) {
        input.focus();
    }
}

/***
 * @param form
 * @name: validateInput
 * @note: validate input
 */
function removeError(form) {
    jQuery('#' + form + ' input').change(function () {
        jQuery(this).parent().removeClass('has-warning has-success has-error').find('.form-control-feedback').remove();
    });
}

jQuery.fn.selectText = function () {
    var doc = document;
    var element = this[0];
    console.log(this, element);
    if (doc.body.createTextRange) {
        var range = document.body.createTextRange();
        range.moveToElementText(element);
        range.select();
    } else if (window.getSelection) {
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);
    }
};


var MNG_CATE = {
    URL_ACTION: ADMIN_PREFIX + 'news/cate/',
    save: function (formElementId, addnew) {
        var $form = jQuery(formElementId);
        //$form.find("button[type='submit']").attr('disabled', true);
        var formdata = $form.serializeArray();
        var callBack = function (json) {
            // $form.find("button[type='submit']").attr('disabled', true);
            if (json.status != 1) {
                alert(json.msg);
                if (json.key != undefined) {
                    jQuery(json.key).focus();
                }
            } else {
                if (json.data != undefined) {
                    if (addnew == undefined && json.data.link != undefined) {
                        window.location.href = json.data.link;
                    } else {
                        alert(json.msg);
                        window.location.href = MNG_CATE.URL_ACTION + 'input';
                    }
                }
            }
        };
        _POST(this.URL_ACTION + '_save', formdata, callBack);
        return false;
    },

    updateStatus: function (cate, status) {
        if (!confirm('Danh mục này sẽ bị xóa, bạn có chắc chắn muốn thực hiện hành động này?')) {
            return false;
        }
        var formdata = [{'name': 'cate', 'value': cate}];
        formdata.push({'name': 'status', 'value': status});
        var callBack = function (json) {
            alert(json.msg);
            window.location.reload();
        };
        _POST(this.URL_ACTION + '_updateStatus', formdata, callBack);
    },
    getCateSelectOptionByObject: function () {
        var objectId = jQuery('#obj-object').val();
        var $cateElement = jQuery('#obj-parent');
        var callBack = function (json) {
            if (json.data.html != undefined) {
                $cateElement.html(json.data.html).select2();
            }
            $cateElement.attr('disabled', false);
        };
        _POST(this.URL_ACTION + '_getCateSelectOptionByObject?object=' + objectId, [], callBack);
        return false;
    },
    getCateCheckBoxByObject: function (object) {
        if (typeof object === 'undefined') {
            object = '#obj-type';
        }
        var objectId = jQuery(object).val();
        var $cateElement = jQuery('#inputCateCheckBoxRegion');
        var callBack = function (json) {
            if (json.data.html != undefined) {
                $cateElement.html(json.data.html);
                jQuery("input:checkbox, input:radio").uniform();
            }
        };
        _POST(this.URL_ACTION + '_getCateCheckBoxByObject?object=' + objectId, [], callBack);
        return false;
    }
};

var MNG_MENU = {
    URL_ACTION: ADMIN_PREFIX + 'menu/',
    saveMenu: function (formElementId) {
        var $form = jQuery(formElementId);
        var formdata = $form.serializeArray();
        var callBack = function (json) {
            alert(json.msg);
        };
        _POST(this.URL_ACTION + '_save', formdata, callBack);
        return false;
    },
};

var MNG_MEDIA = {
    URL_ACTION: ADMIN_PREFIX + 'media/',
    BUTTON_ACTION_NAME: '',
    SELECTED: [],
    TARGET_OBJECT: false,
    SELECTED_MULTI: false,
    setting: {
        //setting for form upload
        MULTI_SELECT: false,
        BUTTON_ACTION: false,
        CURENT_IMAGE: '',//đường dẫn ảnh hiện tại: khi mở form và edit ảnh      cũng có thể là cả object
    },
    /***
     * @note: kịch bản mở form upload
     * -- trong form có các thành phần sau: nút upload hình ảnh
     * -- Danh sách hình ảnh đã được upload trước đó có phân trang
     * @param action_name = Tên action khi click vào nút chọn ảnh
     * @param curent = Link của ảnh hiện tại: support cả link tương đối và link tuyệt đối
     */
    openUploadForm: function (action_name, curent, object, object_type) {
        this.BUTTON_ACTION_NAME = action_name;
        this.SELECTED = [];
        this.TARGET_OBJECT = object;
        var linkremoteform = this.URL_ACTION + '_showFormUpload?action_name=' + action_name + '&curent=' + curent;
        return _SHOW_FORM_REMOTE(linkremoteform);
    },
    openUploadFormWithConfig: function (setting) {
        console.log(setting);
        this.setting = setting;
        this.SELECTED = [];
        var linkremoteform = this.URL_ACTION + '_showFormUpload?action_name=' + this.setting.BUTTON_ACTION + '&curent=' + this.setting.CURENT_IMAGE;
        return _SHOW_FORM_REMOTE(linkremoteform);
    },
    save: function (formElementId, script) {
        var $form = jQuery(formElementId);
        //$form.find("button[type='submit']").attr('disabled', true);
        var formdata = $form.serializeArray();
        var callBack = function (json) {
            // $form.find("button[type='submit']").attr('disabled', true);
            if (json.status != 1) {
                alert(json.msg);
                if (json.key != undefined) {
                    jQuery(json.key).focus();
                }
            } else {
                if (json.data != undefined) {
                    if (addnew == undefined && json.data.link != undefined) {
                        window.location.href = json.data.link;
                    } else {
                        alert(json.msg);
                        window.location.href = MNG_CATE.URL_ACTION + 'input';
                    }
                }
            }
        };
        _POST(this.URL_ACTION + '_save', formdata, callBack);
        return false;
    },
    uploadInit: function (options, addedCalback, doneCallback) {
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',

            browse_button: 'pickfiles', // you can pass in id...
            //container: document.getElementById('upload-container-fake'),
            url: this.URL_ACTION + '_doUpload',
            filters: {
                max_file_size: '51mb',
                mime_types: [
                    {title: "Chọn file bất kỳ", extensions: "*"},
                ]
            },
            multipart_params: {},
            init: {
                PostInit: function () {
                },
                FilesAdded: function (up, files) {
                    var $element = $('#uploadFileItemClone').clone();
                    for (var i in files) {
                        var file = files[i]
                        $element.find('.js-document-container').attr('id', file.id);
                        $element.find('.js-document-loading').show()
                        $('#documentFileRegion').append($element.html());
                    }
                    //jQuery(options.loading_element).show()
                    uploader.start();
                },
                FileUploaded: function (up, file, response) {
                    uploader.removeFile(file);

                    var response = JSON.parse(response.response);
                    //console.table(response);

                    var $_element = $('#' + file.id);
                    console.table(file)
                    $_element.find('.js-document-loading').hide()
                    $_element.find('.js-document-file').val(response.data.relative_link)
                    $_element.find('.js-document-link').attr('href', response.data.full_size_link)
                    $_element.find('.js-document-del').on('click', function () {
                        bootbox.confirm("File của bạn sẽ bị xóa.<br/>Bạn có chắc chắn muốn thực hiện hành động này?", function (result) {
                            if (result) {
                                $('#' + file.id).remove();
                            }
                        });

                    });
                    if(typeof doneCallback ==="function"){
                        doneCallback(response, $_element)
                    }

                },
                UploadComplete: function (up, files) {

                }
            }
        });
        uploader.init();
        uploader.bind('FilesAdded', function (up, files) {
        });

    },
    uploadAvatarInit: function (options, addedCalback, doneCallback) {
        var uploader = new plupload.Uploader({
            runtimes: 'html5,flash,silverlight,html4',

            browse_button: 'upload-avatar', // you can pass in id...
            //container: document.getElementById('upload-container-fake'),
            url: this.URL_ACTION + '_doUpload',
            filters: {
                max_file_size: '2mb',
                mime_types: [
                    {title: "Chọn file ảnh", extensions: "*"},
                ]
            },
            multipart_params: {},
            init: {
                PostInit: function () {
                },
                FilesAdded: function (up, files) {
                    if (files.length > 1) {
                        alert("Bạn chỉ được upload 1 file")
                        return false;
                    }
                    //jQuery(options.loading_element).show()
                    uploader.start();
                },
                FileUploaded: function (up, file, response) {
                    uploader.removeFile(file);

                    var response = JSON.parse(response.response);
                    //console.table(response);
                    console.table(file)
                    $('#xem-lightbox').attr('href', '/data/' + response.data.relative_link)
                    $('#upload-avatar').attr('src', '/data/' + response.data.relative_link)
                    $('#avatar-container').css('background-image', `url('/data/${response.data.relative_link}')`)
                    $('#input-avatar').val(response.data.relative_link)
                },
                UploadComplete: function (up, files) {

                }
            }
        });
        uploader.init();
        uploader.bind('FilesAdded', function (up, files) {
        });

    }
};
var MNG_POST = {
        URL_ACTION: ADMIN_PREFIX + 'post/',
        /***
         * @note: Thêm 1 tag vào trong inline hidden của html để post lên sơ vơ
         * @param sourceElement: id của input tag : nơi nhập từ khóa cách nhau bởi dấu phẩy
         * @param targetElement: id của html hiển thị tag nhập  và các thẻ hidden khác
         */
        addTag: function (sourceElement, targetElement) {
            var $targetElement = jQuery(targetElement);
            var $sourceElement = jQuery(sourceElement);
            var sourceContent = $sourceElement.val().trim();
            if (sourceContent == '') {
                return false;
            }
            sourceContent = sourceContent.split(';');
            for (var i in sourceContent) {

                if (sourceContent[i].trim() != '') {
                    var id = 'TAG-' + _convertToAlias(sourceContent[i].trim());
                    if (jQuery('#' + id + '').length == 0) {
                        var tag = '<li id="' + id + '"><input type="hidden" name="CATE[]" value="' + sourceContent[i].trim() + '"/>';
                        tag += '<i onclick="jQuery(\'#' + id + '\').remove();" class="icon-diff-removed"></i> ' + sourceContent[i].trim() + '</li>';
                        $targetElement.prepend(tag);
                    }
                }
            }
            $sourceElement.val('');
            return false;
        },
        inputTagPress: function (event) {
            if (event.which == 13) {
                MNG_POST.addTag('#post-input-tag', '#post-list-tag');
                return false;
            }
        },
        save: function (formElementId, script) {
            var $form = jQuery(formElementId);
            //$form.find("button[type='submit']").attr('disabled', true);
            var formdata = $form.serializeArray();
            var callBack = function (json) {
                // $form.find("button[type='submit']").attr('disabled', true);
                if (json.status != 1) {
                    alert(json.msg);
                    if (json.key != undefined) {
                        jQuery(json.key).focus();
                    }
                } else {
                    if (json.data != undefined) {
                        if (script == undefined && json.data.link_edit != undefined) {
                            window.location.href = json.data.link_edit;
                        } else {
                            alert(json.msg);
                            window.location.href = MNG_POST.URL_ACTION + 'input';
                        }
                    }
                }
            };
            _POST(this.URL_ACTION + '_save', formdata, callBack);
            return false;
        },
        update: function (link, formElementId, add_more, callbackOptions) {
            var $form = jQuery(formElementId);
            //$form.find("button[type='submit']").attr('disabled', true);
            var formdata = $form.serializeArray();
            var callBack = function (json) {
                if (json.msg !== '') {
                    alert(json.msg);
                }
                if (typeof add_more !== 'undefined') {
                    window.location.href = link;
                } else {
                    try {
                        if (typeof json.data.link !== 'undefined') {
                            window.location.href = json.data.link;
                        }
                    } catch (e) {
                    }
                }
                /**
                 * reset form
                 */
                try {
                    if (typeof json.data.reset !== 'undefined') {
                        $form[0].reset()
                    }
                } catch (e) {

                }
                try {
                    if (typeof json.data.reload !== 'undefined') {
                        window.location.reload()
                    }
                } catch (e) {
                }
            }
            if (typeof callbackOptions === "function") {
                callBack = callbackOptions
            }

            _POST(link, formdata, callBack);
            return false;
        },
        deleteItem: function (link, id) {
            if (!confirm("Đối tượng bị xóa sẽ không thể khôi phục lại được!\nBạn có chắc chắn muốn xóa đối tượng này?")) {
                return false;
            }
            var callBack = function (json) {
                // $form.find("button[type='submit']").attr('disabled', true);
                alert(json.msg);
                if (json.status == 1) {
                    jQuery('#itemRow_' + id).remove();
                    jQuery('#pos_' + id).remove();
                    jQuery('.pos_' + id).remove();
                }
                try {
                    if (typeof json.data.link !== 'undefined') {
                        window.location.href = json.data.link;
                    }
                } catch (e) {
                }
                try {
                    if (typeof json.data.reload !== 'undefined') {
                        window.location.reload()
                    }
                } catch (e) {

                }
            };
            _POST(link, [], callBack);
            return false;
        },
        sendNotification: function (link, formElementId) {
            var $form = jQuery(formElementId);
            //$form.find("button[type='submit']").attr('disabled', true);
            var formdata = $form.serializeJSON();
            console.log(formdata)
            var callBack = function (json) {
                alert(json.msg);
            };
            _POST_JSON_BODY(link, formdata, callBack);
            return false;
        }
    }
;
var MNG_MEMBER = {
    URL_ACTION: ADMIN_PREFIX + 'member/',

    save: function (formElementId, script) {
        var $form = jQuery(formElementId);
        var formdata = $form.serializeArray();
        var callBack = function (json) {
            // $form.find("button[type='submit']").attr('disabled', true);
            alert(json.msg);
            if (json.status != 1) {
                if (json.key != undefined) {
                    jQuery(json.key).focus();
                }
            } else {
                if (json.data != undefined) {
                    if (script == undefined && json.data.link_edit != undefined) {
                        window.location.href = json.data.link_edit;
                    } else {
                        window.location.href = MNG_MEMBER.URL_ACTION + 'input';
                    }
                }
            }
        };
        _POST(this.URL_ACTION + '_save', formdata, callBack);
        return false;
    },
    delete: function (obj, token, from) {
        if (!confirm('Bạn có chắc chắn muốn xóa thành viên: "' + obj.account + '"')) {
            return false;
        }
        var callBack = function (json) {
            alert(json.msg);
            if (json.status == 1) {
                jQuery('#row_' + obj.id).remove();
            }

            if (from == 'edit') {
                window.location.href = ADMIN_PREFIX + 'member/input';
            }
        };
        var formdata = [];
        formdata.push({name: 'obj', value: JSON.stringify(obj)})
        a
        formdata.push({name: 'token', value: token})
        _POST(this.URL_ACTION + '_delete', formdata, callBack);
    }
};

/**
 * Dùng để like
 *
 * @param elem là element chưa số like
 * @param post_id là id của bài viết
 * */
function TOGGLE_POST_LIKE(elem, post_id) {
    $.get('/forum/toggle_like?post_id=' + post_id, function (data) {
        $(elem).html(data.data.count)

    })

}
var HAVE_PUSH_SLINK = false;
function _SHOW_FORM_REMOTE_HAVE_LINK(remote_link, target, multiform){
    _SHOW_FORM_REMOTE(remote_link, target, multiform);
    let curentLink = window.location.href;
    let haveSlink = getUrlParameters(curentLink,'slink');
    console.log(curentLink)
    if(!haveSlink) {
        if (curentLink.indexOf("?") === -1) {
            curentLink += '?slink=' + btoa(remote_link);
        } else {
            curentLink += '&slink=' + btoa(remote_link);
        }
    }else{
        curentLink = replaceUrlParam(curentLink,'slink',btoa(remote_link));
    }
    console.log(curentLink)
    history.pushState(null, null, curentLink);
    HAVE_PUSH_SLINK = remote_link;
    //change link
    return false;
}
function _CLOSE_MODAL() {
    $('#myModal').remove()
    $('body').css({paddingRight:0})
    $('.modal-backdrop').remove()
    $('.modal-open').removeClass('modal-open');
    if(HAVE_PUSH_SLINK!==false){
        window.history.back();
        //todo: có thể check thêm nó là link gì
    }else{

        if(getUrlParameters(window.location.href,'slink')){
            //nếu có link tức là trường hợp này là share link thì close cái link này đi
            let link = removeURLParameter(window.location.href,'slink');
            window.location.href = link;
        }
    }

}

function INPUT_NUMBER() {
    $('.input-type-number').on('input', function () {
        event.target.value = event.target.value.replace(/\D/g, '');
    })
}

function INIT_TOUCHSPIN() {
    $(".touchspin-postfix").TouchSpin({
        min: 0,
        max: 200,
        step: 0.1,
        decimals: 2,
        postfix: '%'
    });
}

function INPUT_NUMBER_FORMAT() {
    var $container = $('.input-type-number-format');
    let length = $container.length;
    for (let i = 0; i < length; i++) {
        let $con = $($container[i])
        let val = $con.val();
        $con.val(number_format(val));
        let name = $con.attr('name');
        if(!$con.next('input:hidden').length) {
            $con.parent().append('<input type="hidden" name="'+name+'" value="'+INPUT_NUMBER_FORMAT_REPLACE_DOT(val)+'">');
        }
    }
    $container.on('input', function () {
        event.target.value = number_format(event.target.value.replace(/\D/g, ''));
        let val = $(this).val();
        let name = $(this).attr('name');
        if(!$(this).next('input:hidden').length) {
            $(this).parent().append('<input type="hidden" name="'+name+'" value="'+val+'">');
        }else {
            $(this).next('input:hidden').val(INPUT_NUMBER_FORMAT_REPLACE_DOT(val));
        }
    })
}

function INPUT_NUMBER_FORMAT_REPLACE_DOT(string) {
    return string.toString().replace(/\D/g, '')
}

function INPUT_NUMBER_WITH_COMMA() {
    $('.input-type-number-with-comma').on('input', function () {
        event.target.value = event.target.value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    })
}

function DATE_PICKER_INIT() {
    $('.datepicker').datepicker({dateFormat: 'dd/mm/yy'})
}

function SELECT2_CREATABLE() {

    $('.select2-createable').each(function () {
        // let initData = $(this).data('selected') ? $(this).data('selected') : [];
        let select2Options = {
            data: $(this).data('value') ? $(this).data('value') : [],
            formatNoMatches: term => "Nhập để thêm",
            createSearchChoice: term => {
                return {
                    id: term,
                    text: term
                }
            },

        }
        if ($(this).attr('multiple')) {
            select2Options.multiple = true;
        }
        if ($(this).attr('tags')) {
            select2Options.tags = true;
        }
        let cur = $(this).select2(select2Options)
    })
}

const MNG_META_MEMBER = {
    getTypeUrl(type) {
        return `/staff/metadata?type=${type}`
    }
}

function exportTableToExcel(tableID, filename = '') {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById(tableID);
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');

    // Specify file name
    filename = filename ? filename + '.xls' : 'excel_data.xls';

    // Create download link element
    downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if (navigator.msSaveOrOpenBlob) {
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob(blob, filename);
    } else {
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }
}

function select_tinh_thanh_quan_huyen(dom, url = '/category/suggest'){
    let selectProvince =$(dom).find('select.city');
    let selectDistrict =$(dom).find('select.district');
    let selectTown =$(dom).find('select.town');
    let getParams= ({action,parentDom})=>{
        return {

            ajax: {

                url: url+action,
                data: function (params) {
                    let parentVal = $(parentDom).val();
                    // Query parameters will be ?search=[term]&type=public
                    return {
                        q: params.term,
                        parent_key: parentVal

                    };
                },
                dataType: 'json',
                processResults: function (data) {
                    // Transforms the top-level key of the response object from 'items' to 'results'
                    return {
                        results: Array.isArray(data.data) ? data.data.map(item => ({
                            id: item.code, text: item.name,
                        })) : []
                    };
                }
            },

        };
    };
    selectProvince.select2((getParams({action:"get_all_city"})));
    selectDistrict.select2((getParams({action:"get_sub_location",parentDom : selectProvince})));
    selectTown.select2((getParams({action:"get_sub_location", parentDom: selectDistrict})));
    selectProvince.on('change', function(){
        selectDistrict.val("").trigger('change');
        selectTown.val("").trigger('change')
    });
    selectDistrict.on('change', function(){
        selectTown.val("").trigger('change')
    })


}

function _INIT_SWITCHERY_DELETE() {
    // Swal defaults
    var swalInit = swal.mixin({
        buttonsStyling: false,
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-light'
    });

    // Modal with custom checker
    $('#_accept_deleted').on('click', function() {
        var $this = $(this);
        swalInit.fire({
            title: 'Cảnh báo hành động nguy hiểm',
            input: 'checkbox',
            type: 'error',
            inputValue: 0,
            inputClass: 'form-check-styled',
            inputPlaceholder: 'Bạn có chắc chắn muốn xoá bản ghi này?',
            confirmButtonText: 'Xác nhận <i class="icon-arrow-right14 ml-2></i>',
            inputValidator: function(value) {
                return !value && 'Bạn cần xác nhận hành động của mình'
            },
            onOpen: function() {

                // Initialize Switchery
                var elem = document.querySelector('.swal2-checkbox.form-check-styled input[type=checkbox]');
                var init = new Switchery(elem);
            },
            preConfirm: function() {
                return fetch($this.data('link-trash'))
                    .then(function(response) {
                        if(!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json();
                    })
                    .catch(function(error) {
                        swalInit.showValidationMessage(
                            'Có gì đó không ổn. Vui lòng liên hệ admin để xử lý vấn đề này.' + error
                        );
                    });
            },
        }).then(function(result) {
            if(result.value) {
                if(result.value.status == 0) {
                    swalInit.fire({
                        type: 'error',
                        text: result.value.msg
                    });
                }else {
                    swalInit.fire({
                        type: 'success',
                        text: result.value.msg
                    });
                    location.reload();
                }
            }
        });
    });
    $('#_accept_revert').on('click', function() {
        var $this = $(this);
        swalInit.fire({
            title: 'Bản ghi này đã bị xoá',
            input: 'checkbox',
            type: 'error',
            inputValue: 0,
            inputClass: 'form-check-styled',
            inputPlaceholder: 'Bạn có chắc chắn muốn khôi phục lại bản ghi này?',
            confirmButtonText: 'Xác nhận <i class="icon-arrow-right14 ml-2></i>',
            inputValidator: function(value) {
                return !value && 'Bạn cần xác nhận hành động của mình'
            },
            onOpen: function() {

                // Initialize Switchery
                var elem = document.querySelector('.swal2-checkbox.form-check-styled input[type=checkbox]');
                var init = new Switchery(elem);
            },
            preConfirm: function() {
                return fetch($this.data('link-revert'))
                    .then(function(response) {
                        if(!response.ok) {
                            throw new Error(response.statusText)
                        }
                        return response.json();
                    })
                    .catch(function(error) {
                        swalInit.showValidationMessage(
                            'Có gì đó không ổn. Vui lòng liên hệ admin để xử lý vấn đề này.' + error
                        );
                    });
            },
        }).then(function(result) {
            if(result.value) {
                if(result.value.status == 0) {
                    swalInit.fire({
                        type: 'error',
                        text: result.value.msg
                    });
                }else {
                    swalInit.fire({
                        type: 'success',
                        text: result.value.msg
                    });
                    location.reload();
                }

            }
        });
    });
}